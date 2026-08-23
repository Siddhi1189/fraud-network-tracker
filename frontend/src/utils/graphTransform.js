/**
 * Defensive Cytoscape Graph Element Transformer.
 * Converts real backend investigation reports and detector payloads into
 * strictly validated, deduplicated Cytoscape graph nodes and edges.
 *
 * Adheres strictly to the canonical graph model:
 * (:Person)-[:OWNS]->(:Account)
 * (:Person)-[:REGISTERED_WITH]->(:PhoneNumber)
 * (:Person)-[:LIVES_AT]->(:Address)
 * (:Account)-[:USED_DEVICE]->(:Device)
 * (:Account)-[:TRANSFERRED_TO]->(:Account)
 */

/**
 * Transforms an investigation report into Cytoscape element definitions.
 * @param {object} report Real backend investigation response
 * @returns {Array} Array of Cytoscape node and edge element objects
 */
export function transformInvestigationToGraph(report) {
  if (!report || !report.accountId) {
    return [];
  }

  const nodesMap = new Map();
  const edgesMap = new Map();

  const primaryAccountId = report.accountId;

  // 1. Add Primary Target Account Node (Tier: primary)
  nodesMap.set(primaryAccountId, {
    data: {
      id: primaryAccountId,
      label: `${primaryAccountId}\n(Primary Account)`,
      shortLabel: primaryAccountId,
      type: 'Account',
      isPrimary: true,
      nodeTier: 'primary',
      bank: report.accountInfo?.bank || 'Bank Account',
      balance: report.accountInfo?.balance,
      riskScore: report.riskScore,
      riskLevel: report.riskLevel,
      nodeCategory: 'primary',
    },
  });

  const signals = Array.isArray(report.signals) ? report.signals : [];

  for (const signalItem of signals) {
    const { signal, evidence } = signalItem;
    if (!evidence) continue;

    // A. FAN_IN_DISPERSAL Evidence
    if (signal === 'FAN_IN_DISPERSAL') {
      // Inbound Transactions & Source Accounts
      const inTxns = Array.isArray(evidence.inboundTransactions)
        ? evidence.inboundTransactions
        : (evidence.sourceAccountIds || []).map((id, idx) => ({
            fromAccountId: id,
            transactionId: `IN-${idx + 1}`,
          }));

      for (const txn of inTxns) {
        const fromId = txn.fromAccountId;
        if (!fromId) continue;

        if (!nodesMap.has(fromId)) {
          nodesMap.set(fromId, {
            data: {
              id: fromId,
              label: `${fromId}\n(Inbound)`,
              shortLabel: fromId,
              type: 'Account',
              isPrimary: false,
              nodeTier: 'connected_account',
              nodeCategory: 'source',
            },
          });
        }

        const edgeId = `edge-${fromId}->${primaryAccountId}-${txn.transactionId || 'in'}`;
        if (!edgesMap.has(edgeId)) {
          edgesMap.set(edgeId, {
            data: {
              id: edgeId,
              source: fromId,
              target: primaryAccountId,
              label: 'TRANSFERRED_TO',
              edgeType: 'incoming',
              amount: txn.amount,
              timestamp: txn.timestamp,
              transactionId: txn.transactionId,
            },
          });
        }
      }

      // Outbound Transactions & Destination Accounts
      const outTxns = Array.isArray(evidence.outboundTransactions)
        ? evidence.outboundTransactions
        : (evidence.destinationAccountIds || []).map((id, idx) => ({
            toAccountId: id,
            transactionId: `OUT-${idx + 1}`,
          }));

      for (const txn of outTxns) {
        const toId = txn.toAccountId;
        if (!toId) continue;

        if (!nodesMap.has(toId)) {
          nodesMap.set(toId, {
            data: {
              id: toId,
              label: `${toId}\n(Outbound)`,
              shortLabel: toId,
              type: 'Account',
              isPrimary: false,
              nodeTier: 'connected_account',
              nodeCategory: 'destination',
            },
          });
        }

        const edgeId = `edge-${primaryAccountId}->${toId}-${txn.transactionId || 'out'}`;
        if (!edgesMap.has(edgeId)) {
          edgesMap.set(edgeId, {
            data: {
              id: edgeId,
              source: primaryAccountId,
              target: toId,
              label: 'TRANSFERRED_TO',
              edgeType: 'outgoing',
              amount: txn.amount,
              timestamp: txn.timestamp,
              transactionId: txn.transactionId,
            },
          });
        }
      }
    }

    // B. CIRCULAR_TRANSFER Evidence
    if (signal === 'CIRCULAR_TRANSFER' && Array.isArray(evidence.cycles)) {
      for (const cycle of evidence.cycles) {
        const path = cycle.cyclePath || [];
        const txns = cycle.transactions || [];

        for (let i = 0; i < path.length - 1; i++) {
          const fromId = path[i];
          const toId = path[i + 1];

          if (!nodesMap.has(fromId)) {
            const isPrim = fromId === primaryAccountId;
            nodesMap.set(fromId, {
              data: {
                id: fromId,
                label: isPrim ? `${fromId}\n(Primary Account)` : `${fromId}\n(Cycle)`,
                shortLabel: fromId,
                type: 'Account',
                isPrimary: isPrim,
                nodeTier: isPrim ? 'primary' : 'connected_account',
                nodeCategory: isPrim ? 'primary' : 'cycle',
              },
            });
          }

          if (!nodesMap.has(toId)) {
            const isPrim = toId === primaryAccountId;
            nodesMap.set(toId, {
              data: {
                id: toId,
                label: isPrim ? `${toId}\n(Primary Account)` : `${toId}\n(Cycle)`,
                shortLabel: toId,
                type: 'Account',
                isPrimary: isPrim,
                nodeTier: isPrim ? 'primary' : 'connected_account',
                nodeCategory: isPrim ? 'primary' : 'cycle',
              },
            });
          }

          const txn = txns[i] || {};
          const edgeId = `edge-${fromId}->${toId}-${txn.transactionId || i}`;
          if (!edgesMap.has(edgeId)) {
            edgesMap.set(edgeId, {
              data: {
                id: edgeId,
                source: fromId,
                target: toId,
                label: 'TRANSFERRED_TO',
                edgeType: fromId === primaryAccountId ? 'outgoing' : toId === primaryAccountId ? 'incoming' : 'cycle',
                amount: txn.amount,
                timestamp: txn.timestamp,
                transactionId: txn.transactionId,
              },
            });
          }
        }
      }
    }

    // C. SHARED_DEVICE Evidence
    if (signal === 'SHARED_DEVICE' && Array.isArray(evidence.sharedDevices)) {
      for (const dev of evidence.sharedDevices) {
        const deviceId = dev.deviceId || dev.hardwareId || 'DEV-UNKNOWN';

        if (!nodesMap.has(deviceId)) {
          nodesMap.set(deviceId, {
            data: {
              id: deviceId,
              label: `${deviceId}\n(Device)`,
              shortLabel: deviceId,
              type: 'Device',
              nodeTier: 'entity',
              hardwareId: dev.hardwareId,
              ipAddress: dev.ipAddress,
              deviceType: dev.deviceType,
              nodeCategory: 'device',
            },
          });
        }

        // Link primary account to device
        const primEdgeId = `edge-${primaryAccountId}->${deviceId}-used`;
        if (!edgesMap.has(primEdgeId)) {
          edgesMap.set(primEdgeId, {
            data: {
              id: primEdgeId,
              source: primaryAccountId,
              target: deviceId,
              label: 'USED_DEVICE',
              edgeType: 'device',
            },
          });
        }

        // Link other related accounts to device
        const relAccounts = dev.relatedAccounts || [];
        for (const relAccId of relAccounts) {
          if (relAccId === primaryAccountId) continue;

          if (!nodesMap.has(relAccId)) {
            nodesMap.set(relAccId, {
              data: {
                id: relAccId,
                label: `${relAccId}\n(Account)`,
                shortLabel: relAccId,
                type: 'Account',
                isPrimary: false,
                nodeTier: 'secondary',
                nodeCategory: 'shared_account',
              },
            });
          }

          const relEdgeId = `edge-${relAccId}->${deviceId}-used`;
          if (!edgesMap.has(relEdgeId)) {
            edgesMap.set(relEdgeId, {
              data: {
                id: relEdgeId,
                source: relAccId,
                target: deviceId,
                label: 'USED_DEVICE',
                edgeType: 'device',
              },
            });
          }
        }
      }
    }

    // D. SHARED_PHONE Evidence
    if (signal === 'SHARED_PHONE' && Array.isArray(evidence.sharedPhones)) {
      for (const phone of evidence.sharedPhones) {
        const phoneId = phone.phoneId || phone.phoneNumber || 'PH-UNKNOWN';

        if (!nodesMap.has(phoneId)) {
          nodesMap.set(phoneId, {
            data: {
              id: phoneId,
              label: `${phone.phoneNumber || phoneId}\n(Phone)`,
              shortLabel: phone.phoneNumber || phoneId,
              type: 'PhoneNumber',
              nodeTier: 'entity',
              phoneNumber: phone.phoneNumber,
              nodeCategory: 'phone',
            },
          });
        }

        // Persons linked to this phone
        const personIds = phone.relatedPersonIds || [];
        for (const pId of personIds) {
          if (!nodesMap.has(pId)) {
            nodesMap.set(pId, {
              data: {
                id: pId,
                label: `${pId}\n(Person)`,
                shortLabel: pId,
                type: 'Person',
                nodeTier: 'entity',
                nodeCategory: 'person',
              },
            });
          }

          const phoneEdgeId = `edge-${pId}->${phoneId}-registered`;
          if (!edgesMap.has(phoneEdgeId)) {
            edgesMap.set(phoneEdgeId, {
              data: {
                id: phoneEdgeId,
                source: pId,
                target: phoneId,
                label: 'REGISTERED_WITH',
                edgeType: 'metadata',
              },
            });
          }
        }

        // Accounts owned by those persons
        const accIds = phone.relatedAccountIds || [];
        for (const relAccId of accIds) {
          if (!nodesMap.has(relAccId)) {
            const isPrim = relAccId === primaryAccountId;
            nodesMap.set(relAccId, {
              data: {
                id: relAccId,
                label: isPrim ? `${relAccId}\n(Primary Account)` : `${relAccId}\n(Account)`,
                shortLabel: relAccId,
                type: 'Account',
                isPrimary: isPrim,
                nodeTier: isPrim ? 'primary' : 'secondary',
                nodeCategory: isPrim ? 'primary' : 'shared_account',
              },
            });
          }

          // Link person to account if we know the person
          for (const pId of personIds) {
            const ownsEdgeId = `edge-${pId}->${relAccId}-owns`;
            if (!edgesMap.has(ownsEdgeId)) {
              edgesMap.set(ownsEdgeId, {
                data: {
                  id: ownsEdgeId,
                  source: pId,
                  target: relAccId,
                  label: 'OWNS',
                  edgeType: 'owns',
                },
              });
            }
          }
        }
      }
    }

    // E. SHARED_ADDRESS Evidence
    if (signal === 'SHARED_ADDRESS' && Array.isArray(evidence.sharedAddresses)) {
      for (const addr of evidence.sharedAddresses) {
        const addrId = addr.addressId || 'ADDR-UNKNOWN';
        const displayLabel = addr.street ? `${addr.street}\n(Address)` : `${addrId}\n(Address)`;

        if (!nodesMap.has(addrId)) {
          nodesMap.set(addrId, {
            data: {
              id: addrId,
              label: displayLabel,
              shortLabel: addr.street || addrId,
              type: 'Address',
              nodeTier: 'entity',
              street: addr.street,
              city: addr.city,
              postalCode: addr.postalCode,
              nodeCategory: 'address',
            },
          });
        }

        // Persons linked to this address
        const personIds = addr.relatedPersonIds || [];
        for (const pId of personIds) {
          if (!nodesMap.has(pId)) {
            nodesMap.set(pId, {
              data: {
                id: pId,
                label: `${pId}\n(Person)`,
                shortLabel: pId,
                type: 'Person',
                nodeTier: 'entity',
                nodeCategory: 'person',
              },
            });
          }

          const addrEdgeId = `edge-${pId}->${addrId}-lives`;
          if (!edgesMap.has(addrEdgeId)) {
            edgesMap.set(addrEdgeId, {
              data: {
                id: addrEdgeId,
                source: pId,
                target: addrId,
                label: 'LIVES_AT',
                edgeType: 'metadata',
              },
            });
          }
        }

        // Accounts associated with those persons
        const accIds = addr.relatedAccountIds || [];
        for (const relAccId of accIds) {
          if (!nodesMap.has(relAccId)) {
            const isPrim = relAccId === primaryAccountId;
            nodesMap.set(relAccId, {
              data: {
                id: relAccId,
                label: isPrim ? `${relAccId}\n(Primary Account)` : `${relAccId}\n(Account)`,
                shortLabel: relAccId,
                type: 'Account',
                isPrimary: isPrim,
                nodeTier: isPrim ? 'primary' : 'secondary',
                nodeCategory: isPrim ? 'primary' : 'shared_account',
              },
            });
          }

          for (const pId of personIds) {
            const ownsEdgeId = `edge-${pId}->${relAccId}-owns`;
            if (!edgesMap.has(ownsEdgeId)) {
              edgesMap.set(ownsEdgeId, {
                data: {
                  id: ownsEdgeId,
                  source: pId,
                  target: relAccId,
                  label: 'OWNS',
                  edgeType: 'owns',
                },
              });
            }
          }
        }
      }
    }
  }

  return [...nodesMap.values(), ...edgesMap.values()];
}

export default {
  transformInvestigationToGraph,
};
