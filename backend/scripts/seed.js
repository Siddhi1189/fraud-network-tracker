import path from 'path';
import { fileURLToPath } from 'url';
import { getDriver, closeDatabaseDriver } from '../src/config/database.js';

// ==========================================
// 1. DETERMINISTIC SYNTHETIC DATASETS
// ==========================================

/**
 * 24 Synthetic Persons
 * Note: Only node-specific properties are stored here.
 */
export const persons = [
  { id: 'P-001', name: 'Eleanor Sterling', kycRef: 'KYC-US-1001', email: 'eleanor.sterling@example.test' },
  { id: 'P-002', name: 'Marcus Holloway', kycRef: 'KYC-US-1002', email: 'marcus.holloway@example.test' },
  { id: 'P-003', name: 'Sofia Chen', kycRef: 'KYC-US-1003', email: 'sofia.chen@example.test' },
  { id: 'P-004', name: 'Darius Vance', kycRef: 'KYC-US-1004', email: 'darius.vance@example.test' },
  { id: 'P-005', name: 'Lucas Bennett', kycRef: 'KYC-US-1005', email: 'lucas.bennett@example.test' },
  { id: 'P-006', name: 'Elena Rostova', kycRef: 'KYC-US-1006', email: 'elena.rostova@example.test' },
  { id: 'P-007', name: 'Mateo Rossi', kycRef: 'KYC-US-1007', email: 'mateo.rossi@example.test' },
  { id: 'P-008', name: 'Amina Yusuf', kycRef: 'KYC-US-1008', email: 'amina.yusuf@example.test' },
  { id: 'P-009', name: 'Liam O\'Connor', kycRef: 'KYC-US-1009', email: 'liam.oconnor@example.test' },
  { id: 'P-010', name: 'Chloe Dubois', kycRef: 'KYC-US-1010', email: 'chloe.dubois@example.test' },
  { id: 'P-011', name: 'Victor Navarro', kycRef: 'KYC-US-1011', email: 'victor.navarro@example.test' },
  { id: 'P-012', name: 'Isabella Ramos', kycRef: 'KYC-US-1012', email: 'isabella.ramos@example.test' },
  { id: 'P-013', name: 'Julian Thorne', kycRef: 'KYC-US-1013', email: 'julian.thorne@example.test' },
  { id: 'P-014', name: 'Maya Patel', kycRef: 'KYC-US-1014', email: 'maya.patel@example.test' },
  { id: 'P-015', name: 'Gabriel Santos', kycRef: 'KYC-US-1015', email: 'gabriel.santos@example.test' },
  { id: 'P-016', name: 'Nora Lindqvist', kycRef: 'KYC-US-1016', email: 'nora.lindqvist@example.test' },
  { id: 'P-017', name: 'Oliver Wright', kycRef: 'KYC-US-1017', email: 'oliver.wright@example.test' },
  { id: 'P-018', name: 'Zoe Zimmerman', kycRef: 'KYC-US-1018', email: 'zoe.zimmerman@example.test' },
  { id: 'P-019', name: 'Ethan Walker', kycRef: 'KYC-US-1019', email: 'ethan.walker@example.test' },
  { id: 'P-020', name: 'Harper Reed', kycRef: 'KYC-US-1020', email: 'harper.reed@example.test' },
  { id: 'P-021', name: 'Benjamin Hayes', kycRef: 'KYC-US-1021', email: 'benjamin.hayes@example.test' },
  { id: 'P-022', name: 'Grace Kim', kycRef: 'KYC-US-1022', email: 'grace.kim@example.test' },
  { id: 'P-023', name: 'Samuel Morales', kycRef: 'KYC-US-1023', email: 'samuel.morales@example.test' },
  { id: 'P-024', name: 'Hannah Abbott', kycRef: 'KYC-US-1024', email: 'hannah.abbott@example.test' },
];

/**
 * 28 Synthetic Accounts
 */
export const accounts = [
  { id: 'ACC-001', accountNumber: '10009101', bank: 'Apex Bank', balance: 45000.0, riskScore: 0.88, isFlagged: true, createdAt: '2025-10-01T08:00:00Z' },
  { id: 'ACC-002', accountNumber: '10009102', bank: 'Crestview Financial', balance: 38000.0, riskScore: 0.85, isFlagged: true, createdAt: '2025-10-02T09:00:00Z' },
  { id: 'ACC-003', accountNumber: '10009103', bank: 'Nexus Trust', balance: 42500.0, riskScore: 0.82, isFlagged: true, createdAt: '2025-10-05T10:00:00Z' },
  { id: 'ACC-004', accountNumber: '10009104', bank: 'Vanguard Bancorp', balance: 39100.0, riskScore: 0.86, isFlagged: true, createdAt: '2025-10-08T11:00:00Z' },
  { id: 'ACC-005', accountNumber: '10009205', bank: 'Apex Bank', balance: 15200.0, riskScore: 0.72, isFlagged: false, createdAt: '2025-11-01T08:00:00Z' },
  { id: 'ACC-006', accountNumber: '10009206', bank: 'Apex Bank', balance: 19400.0, riskScore: 0.74, isFlagged: false, createdAt: '2025-11-02T08:30:00Z' },
  { id: 'ACC-007', accountNumber: '10009207', bank: 'Apex Bank', balance: 22100.0, riskScore: 0.78, isFlagged: false, createdAt: '2025-11-03T09:00:00Z' },
  { id: 'ACC-008', accountNumber: '10009208', bank: 'Apex Bank', balance: 18700.0, riskScore: 0.76, isFlagged: false, createdAt: '2025-11-04T09:30:00Z' },
  { id: 'ACC-009', accountNumber: '10009309', bank: 'Summit Federal', balance: 12400.0, riskScore: 0.65, isFlagged: false, createdAt: '2025-11-10T10:00:00Z' },
  { id: 'ACC-010', accountNumber: '10009410', bank: 'Ironclad Bank', balance: 68500.0, riskScore: 0.92, isFlagged: true, createdAt: '2025-11-15T08:00:00Z' },
  { id: 'ACC-011', accountNumber: '10009411', bank: 'Apex Bank', balance: 1400.0, riskScore: 0.68, isFlagged: false, createdAt: '2025-12-01T10:00:00Z' },
  { id: 'ACC-012', accountNumber: '10009412', bank: 'Crestview Financial', balance: 1200.0, riskScore: 0.67, isFlagged: false, createdAt: '2025-12-02T10:30:00Z' },
  { id: 'ACC-013', accountNumber: '10009413', bank: 'Nexus Trust', balance: 1800.0, riskScore: 0.70, isFlagged: false, createdAt: '2025-12-03T11:00:00Z' },
  { id: 'ACC-014', accountNumber: '10009414', bank: 'Vanguard Bancorp', balance: 1100.0, riskScore: 0.69, isFlagged: false, createdAt: '2025-12-04T11:30:00Z' },
  { id: 'ACC-015', accountNumber: '10009415', bank: 'Summit Federal', balance: 1500.0, riskScore: 0.71, isFlagged: false, createdAt: '2025-12-05T12:00:00Z' },
  { id: 'ACC-016', accountNumber: '10009416', bank: 'Horizon Union', balance: 28000.0, riskScore: 0.84, isFlagged: true, createdAt: '2025-12-10T09:00:00Z' },
  { id: 'ACC-017', accountNumber: '10009417', bank: 'Zenith Capital', balance: 24000.0, riskScore: 0.81, isFlagged: true, createdAt: '2025-12-12T09:30:00Z' },
  { id: 'ACC-018', accountNumber: '10009518', bank: 'Apex Bank', balance: 31000.0, riskScore: 0.45, isFlagged: false, createdAt: '2025-12-15T10:00:00Z' },
  { id: 'ACC-019', accountNumber: '10009519', bank: 'Crestview Financial', balance: 27500.0, riskScore: 0.42, isFlagged: false, createdAt: '2025-12-18T10:30:00Z' },
  { id: 'ACC-020', accountNumber: '10009620', bank: 'Pinnacle Bank', balance: 8400.0, riskScore: 0.08, isFlagged: false, createdAt: '2025-09-01T08:00:00Z' },
  { id: 'ACC-021', accountNumber: '10009621', bank: 'Pinnacle Bank', balance: 14200.0, riskScore: 0.10, isFlagged: false, createdAt: '2025-09-05T09:00:00Z' },
  { id: 'ACC-022', accountNumber: '10009622', bank: 'Beacon Credit Union', balance: 19800.0, riskScore: 0.06, isFlagged: false, createdAt: '2025-09-10T10:00:00Z' },
  { id: 'ACC-023', accountNumber: '10009623', bank: 'Beacon Credit Union', balance: 11500.0, riskScore: 0.12, isFlagged: false, createdAt: '2025-09-12T11:00:00Z' },
  { id: 'ACC-024', accountNumber: '10009724', bank: 'Horizon Union', balance: 9300.0, riskScore: 0.15, isFlagged: false, createdAt: '2025-09-15T12:00:00Z' },
  { id: 'ACC-025', accountNumber: '10009725', bank: 'Zenith Capital', balance: 16400.0, riskScore: 0.11, isFlagged: false, createdAt: '2025-09-20T13:00:00Z' },
  { id: 'ACC-026', accountNumber: '10009726', bank: 'Nexus Trust', balance: 22000.0, riskScore: 0.18, isFlagged: false, createdAt: '2025-09-22T14:00:00Z' },
  { id: 'ACC-027', accountNumber: '10009727', bank: 'Summit Federal', balance: 14700.0, riskScore: 0.14, isFlagged: false, createdAt: '2025-09-25T15:00:00Z' },
  { id: 'ACC-028', accountNumber: '10009828', bank: 'Pinnacle Bank', balance: 3200.0, riskScore: 0.05, isFlagged: false, createdAt: '2025-12-28T16:00:00Z' },
];

/**
 * 10 Synthetic Devices
 */
export const devices = [
  { id: 'DEV-001', deviceId: 'DVID-9001-A1', ipAddress: '198.51.100.11', deviceType: 'desktop_windows' },
  { id: 'DEV-002', deviceId: 'DVID-9002-B2', ipAddress: '198.51.100.12', deviceType: 'mobile_ios' },
  { id: 'DEV-003', deviceId: 'DVID-9003-C3', ipAddress: '198.51.100.13', deviceType: 'mobile_android' },
  { id: 'DEV-004', deviceId: 'DVID-9004-D4', ipAddress: '198.51.100.14', deviceType: 'desktop_macos' },
  { id: 'DEV-005', deviceId: 'DVID-9005-E5', ipAddress: '198.51.100.15', deviceType: 'desktop_linux' },
  { id: 'DEV-006', deviceId: 'DVID-9006-F6', ipAddress: '198.51.100.16', deviceType: 'mobile_ios' },
  { id: 'DEV-007', deviceId: 'DVID-9007-G7', ipAddress: '198.51.100.17', deviceType: 'desktop_windows' },
  { id: 'DEV-008', deviceId: 'DVID-9008-H8', ipAddress: '198.51.100.18', deviceType: 'mobile_android' },
  { id: 'DEV-009', deviceId: 'DVID-9009-I9', ipAddress: '198.51.100.19', deviceType: 'desktop_macos' },
  { id: 'DEV-010', deviceId: 'DVID-9010-J0', ipAddress: '198.51.100.20', deviceType: 'mobile_ios' },
];

/**
 * 10 Synthetic PhoneNumbers
 */
export const phoneNumbers = [
  { id: 'PH-001', number: '+1-555-0101' },
  { id: 'PH-002', number: '+1-555-0102' },
  { id: 'PH-003', number: '+1-555-0103' },
  { id: 'PH-004', number: '+1-555-0104' },
  { id: 'PH-005', number: '+1-555-0105' },
  { id: 'PH-006', number: '+1-555-0106' },
  { id: 'PH-007', number: '+1-555-0107' },
  { id: 'PH-008', number: '+1-555-0108' },
  { id: 'PH-009', number: '+1-555-0109' },
  { id: 'PH-010', number: '+1-555-0110' },
];

/**
 * 10 Synthetic Addresses
 */
export const addresses = [
  { id: 'ADDR-001', street: '742 Evergreen Terrace', city: 'Metro City', postalCode: '90210' },
  { id: 'ADDR-002', street: '10880 Wilshire Blvd', city: 'Metro City', postalCode: '90024' },
  { id: 'ADDR-003', street: '450 Lexington Ave', city: 'Central City', postalCode: '10017' },
  { id: 'ADDR-004', street: '200 South Biscayne Blvd', city: 'Bay Harbor', postalCode: '33131' },
  { id: 'ADDR-005', street: '100 North Tampa St', city: 'Riverton', postalCode: '33602' },
  { id: 'ADDR-006', street: '600 West Broadway', city: 'Pacific View', postalCode: '92101' },
  { id: 'ADDR-007', street: '500 West 2nd St', city: 'Austin Hills', postalCode: '78701' },
  { id: 'ADDR-008', street: '1111 Lincoln Rd', city: 'Bay Harbor', postalCode: '33139' },
  { id: 'ADDR-009', street: '333 South Hope St', city: 'Metro City', postalCode: '90071' },
  { id: 'ADDR-010', street: '100 Pine St', city: 'Pacific View', postalCode: '94111' },
];

/**
 * 28 Account Ownership Relationships (:Person)-[:OWNS]->(:Account)
 */
export const ownerships = [
  { personId: 'P-001', accountId: 'ACC-001' },
  { personId: 'P-002', accountId: 'ACC-002' },
  { personId: 'P-003', accountId: 'ACC-003' },
  { personId: 'P-004', accountId: 'ACC-004' },
  { personId: 'P-005', accountId: 'ACC-005' },
  { personId: 'P-006', accountId: 'ACC-006' },
  { personId: 'P-007', accountId: 'ACC-007' },
  { personId: 'P-008', accountId: 'ACC-008' },
  { personId: 'P-009', accountId: 'ACC-009' },
  { personId: 'P-010', accountId: 'ACC-010' },
  { personId: 'P-011', accountId: 'ACC-011' },
  { personId: 'P-012', accountId: 'ACC-012' },
  { personId: 'P-013', accountId: 'ACC-013' },
  { personId: 'P-014', accountId: 'ACC-014' },
  { personId: 'P-015', accountId: 'ACC-015' },
  { personId: 'P-016', accountId: 'ACC-016' },
  { personId: 'P-017', accountId: 'ACC-017' },
  { personId: 'P-018', accountId: 'ACC-018' },
  { personId: 'P-019', accountId: 'ACC-019' },
  { personId: 'P-020', accountId: 'ACC-020' },
  { personId: 'P-021', accountId: 'ACC-021' },
  { personId: 'P-022', accountId: 'ACC-022' },
  { personId: 'P-023', accountId: 'ACC-023' },
  { personId: 'P-024', accountId: 'ACC-028' },
  // Secondary account ownerships for high-volume network structure
  { personId: 'P-001', accountId: 'ACC-024' },
  { personId: 'P-002', accountId: 'ACC-025' },
  { personId: 'P-020', accountId: 'ACC-026' },
  { personId: 'P-021', accountId: 'ACC-027' },
];

/**
 * 24 Phone Registration Relationships (:Person)-[:REGISTERED_WITH]->(:PhoneNumber)
 */
export const phoneRegistrations = [
  { personId: 'P-001', phoneId: 'PH-002' },
  { personId: 'P-002', phoneId: 'PH-003' },
  { personId: 'P-003', phoneId: 'PH-004' },
  { personId: 'P-004', phoneId: 'PH-005' },
  // SHARED_PHONE_01 Cluster (P-005, P-006, P-007 share PH-001)
  { personId: 'P-005', phoneId: 'PH-001' },
  { personId: 'P-006', phoneId: 'PH-001' },
  { personId: 'P-007', phoneId: 'PH-001' },
  { personId: 'P-008', phoneId: 'PH-006' },
  { personId: 'P-009', phoneId: 'PH-007' },
  { personId: 'P-010', phoneId: 'PH-008' },
  { personId: 'P-011', phoneId: 'PH-009' },
  { personId: 'P-012', phoneId: 'PH-002' },
  { personId: 'P-013', phoneId: 'PH-003' },
  { personId: 'P-014', phoneId: 'PH-004' },
  { personId: 'P-015', phoneId: 'PH-005' },
  { personId: 'P-016', phoneId: 'PH-006' },
  { personId: 'P-017', phoneId: 'PH-007' },
  { personId: 'P-018', phoneId: 'PH-008' },
  { personId: 'P-019', phoneId: 'PH-009' },
  { personId: 'P-020', phoneId: 'PH-006' },
  { personId: 'P-021', phoneId: 'PH-007' },
  { personId: 'P-022', phoneId: 'PH-008' },
  { personId: 'P-023', phoneId: 'PH-009' },
  { personId: 'P-024', phoneId: 'PH-010' },
];

/**
 * 24 Address Residency Relationships (:Person)-[:LIVES_AT]->(:Address)
 */
export const addressRegistrations = [
  { personId: 'P-001', addressId: 'ADDR-002' },
  { personId: 'P-002', addressId: 'ADDR-003' },
  { personId: 'P-003', addressId: 'ADDR-004' },
  { personId: 'P-004', addressId: 'ADDR-005' },
  { personId: 'P-005', addressId: 'ADDR-006' },
  { personId: 'P-006', addressId: 'ADDR-007' },
  { personId: 'P-007', addressId: 'ADDR-008' },
  // SHARED_ADDRESS_01 Cluster (P-008, P-009, P-010 share ADDR-001)
  { personId: 'P-008', addressId: 'ADDR-001' },
  { personId: 'P-009', addressId: 'ADDR-001' },
  { personId: 'P-010', addressId: 'ADDR-001' },
  { personId: 'P-011', addressId: 'ADDR-009' },
  { personId: 'P-012', addressId: 'ADDR-002' },
  { personId: 'P-013', addressId: 'ADDR-003' },
  { personId: 'P-014', addressId: 'ADDR-004' },
  { personId: 'P-015', addressId: 'ADDR-005' },
  { personId: 'P-016', addressId: 'ADDR-006' },
  { personId: 'P-017', addressId: 'ADDR-007' },
  { personId: 'P-018', addressId: 'ADDR-008' },
  { personId: 'P-019', addressId: 'ADDR-009' },
  { personId: 'P-020', addressId: 'ADDR-002' },
  { personId: 'P-021', addressId: 'ADDR-003' },
  { personId: 'P-022', addressId: 'ADDR-004' },
  { personId: 'P-023', addressId: 'ADDR-005' },
  { personId: 'P-024', addressId: 'ADDR-010' },
];

/**
 * 28 Device Usage Relationships (:Account)-[:USED_DEVICE]->(:Device)
 */
export const deviceUsages = [
  { accountId: 'ACC-001', deviceId: 'DEV-002' },
  { accountId: 'ACC-002', deviceId: 'DEV-003' },
  { accountId: 'ACC-003', deviceId: 'DEV-004' },
  { accountId: 'ACC-004', deviceId: 'DEV-005' },
  // SHARED_DEVICE_01 Cluster (ACC-005, ACC-006, ACC-007, ACC-008 share DEV-001)
  { accountId: 'ACC-005', deviceId: 'DEV-001' },
  { accountId: 'ACC-006', deviceId: 'DEV-001' },
  { accountId: 'ACC-007', deviceId: 'DEV-001' },
  { accountId: 'ACC-008', deviceId: 'DEV-001' },
  { accountId: 'ACC-009', deviceId: 'DEV-002' },
  { accountId: 'ACC-010', deviceId: 'DEV-003' },
  { accountId: 'ACC-011', deviceId: 'DEV-004' },
  { accountId: 'ACC-012', deviceId: 'DEV-005' },
  { accountId: 'ACC-013', deviceId: 'DEV-006' },
  { accountId: 'ACC-014', deviceId: 'DEV-007' },
  { accountId: 'ACC-015', deviceId: 'DEV-008' },
  { accountId: 'ACC-016', deviceId: 'DEV-009' },
  { accountId: 'ACC-017', deviceId: 'DEV-002' },
  { accountId: 'ACC-018', deviceId: 'DEV-003' },
  { accountId: 'ACC-019', deviceId: 'DEV-004' },
  { accountId: 'ACC-020', deviceId: 'DEV-006' },
  { accountId: 'ACC-021', deviceId: 'DEV-007' },
  { accountId: 'ACC-022', deviceId: 'DEV-008' },
  { accountId: 'ACC-023', deviceId: 'DEV-009' },
  { accountId: 'ACC-024', deviceId: 'DEV-002' },
  { accountId: 'ACC-025', deviceId: 'DEV-003' },
  { accountId: 'ACC-026', deviceId: 'DEV-006' },
  { accountId: 'ACC-027', deviceId: 'DEV-007' },
  { accountId: 'ACC-028', deviceId: 'DEV-010' },
];

/**
 * Deterministically constructs exactly 140 Transfers (:Account)-[:TRANSFERRED_TO]->(:Account)
 */
function buildTransfers() {
  const list = [
    // 1. RING_01: 4-hop circular transfer loop
    { transactionId: 'TXN-0001', fromId: 'ACC-001', toId: 'ACC-002', amount: 14500.0, timestamp: '2026-02-10T10:00:00Z' },
    { transactionId: 'TXN-0002', fromId: 'ACC-002', toId: 'ACC-003', amount: 14200.0, timestamp: '2026-02-10T11:30:00Z' },
    { transactionId: 'TXN-0003', fromId: 'ACC-003', toId: 'ACC-004', amount: 13900.0, timestamp: '2026-02-10T13:00:00Z' },
    { transactionId: 'TXN-0004', fromId: 'ACC-004', toId: 'ACC-001', amount: 13600.0, timestamp: '2026-02-10T14:45:00Z' },

    // 2. SHARED_DEVICE_01: External activity for accounts sharing DEV-001
    { transactionId: 'TXN-0005', fromId: 'ACC-005', toId: 'ACC-018', amount: 4200.0, timestamp: '2026-02-05T09:15:00Z' },
    { transactionId: 'TXN-0006', fromId: 'ACC-006', toId: 'ACC-018', amount: 3800.0, timestamp: '2026-02-05T10:00:00Z' },
    { transactionId: 'TXN-0007', fromId: 'ACC-007', toId: 'ACC-019', amount: 5100.0, timestamp: '2026-02-05T11:20:00Z' },
    { transactionId: 'TXN-0008', fromId: 'ACC-008', toId: 'ACC-019', amount: 4900.0, timestamp: '2026-02-05T12:00:00Z' },

    // 3. SMURFING_01: 5 synthetic near-threshold fan-in deposits + 2 outbound dispersals
    { transactionId: 'TXN-0009', fromId: 'ACC-011', toId: 'ACC-010', amount: 9400.0, timestamp: '2026-02-15T09:10:00Z' },
    { transactionId: 'TXN-0010', fromId: 'ACC-012', toId: 'ACC-010', amount: 9650.0, timestamp: '2026-02-15T09:35:00Z' },
    { transactionId: 'TXN-0011', fromId: 'ACC-013', toId: 'ACC-010', amount: 9200.0, timestamp: '2026-02-15T10:05:00Z' },
    { transactionId: 'TXN-0012', fromId: 'ACC-014', toId: 'ACC-010', amount: 9800.0, timestamp: '2026-02-15T10:40:00Z' },
    { transactionId: 'TXN-0013', fromId: 'ACC-015', toId: 'ACC-010', amount: 9500.0, timestamp: '2026-02-15T11:15:00Z' },
    { transactionId: 'TXN-0014', fromId: 'ACC-010', toId: 'ACC-016', amount: 23500.0, timestamp: '2026-02-15T14:10:00Z' },
    { transactionId: 'TXN-0015', fromId: 'ACC-010', toId: 'ACC-017', amount: 23000.0, timestamp: '2026-02-15T14:45:00Z' },

    // 4. NORMAL_01: Standard day-to-day transfers for control accounts
    { transactionId: 'TXN-0016', fromId: 'ACC-020', toId: 'ACC-021', amount: 150.0, timestamp: '2026-01-10T12:00:00Z' },
    { transactionId: 'TXN-0017', fromId: 'ACC-021', toId: 'ACC-022', amount: 85.5, timestamp: '2026-01-12T15:30:00Z' },
    { transactionId: 'TXN-0018', fromId: 'ACC-022', toId: 'ACC-023', amount: 240.0, timestamp: '2026-01-15T09:45:00Z' },
    { transactionId: 'TXN-0019', fromId: 'ACC-023', toId: 'ACC-020', amount: 65.0, timestamp: '2026-01-18T18:20:00Z' },
    { transactionId: 'TXN-0020', fromId: 'ACC-020', toId: 'ACC-024', amount: 320.0, timestamp: '2026-01-20T11:10:00Z' },
    { transactionId: 'TXN-0021', fromId: 'ACC-021', toId: 'ACC-025', amount: 510.0, timestamp: '2026-01-22T14:00:00Z' },
    { transactionId: 'TXN-0022', fromId: 'ACC-022', toId: 'ACC-026', amount: 120.0, timestamp: '2026-01-25T16:30:00Z' },
    { transactionId: 'TXN-0023', fromId: 'ACC-023', toId: 'ACC-027', amount: 450.0, timestamp: '2026-01-28T10:15:00Z' },

    // 5. LOW_ACTIVITY_01: Exactly one transfer for ACC-028
    { transactionId: 'TXN-0024', fromId: 'ACC-020', toId: 'ACC-028', amount: 50.0, timestamp: '2026-01-05T10:00:00Z' },
  ];

  // Active accounts participating in background network flow (excluding ACC-028 to keep it low-activity)
  const activeAccounts = [
    'ACC-001', 'ACC-002', 'ACC-003', 'ACC-004', 'ACC-005',
    'ACC-006', 'ACC-007', 'ACC-008', 'ACC-009', 'ACC-010',
    'ACC-011', 'ACC-012', 'ACC-013', 'ACC-014', 'ACC-015',
    'ACC-016', 'ACC-017', 'ACC-018', 'ACC-019', 'ACC-020',
    'ACC-021', 'ACC-022', 'ACC-023', 'ACC-024', 'ACC-025',
    'ACC-026', 'ACC-027'
  ];

  // Exactly 116 deterministic background commerce transfers (TXN-0025 to TXN-0140)
  for (let i = 25; i <= 140; i++) {
    const pad = String(i).padStart(4, '0');
    const fromIdx = (i * 7 + 3) % activeAccounts.length;
    let toIdx = (i * 11 + 5) % activeAccounts.length;
    if (toIdx === fromIdx) {
      toIdx = (toIdx + 1) % activeAccounts.length;
    }
    const fromId = activeAccounts[fromIdx];
    const toId = activeAccounts[toIdx];
    const amount = Number(((i * 37.5) % 4500 + 45.0).toFixed(2));

    const day = ((i * 3) % 80) + 1; // 1 to 80
    const month = day <= 30 ? '01' : day <= 58 ? '02' : '03';
    const mDay = day <= 30 ? day : day <= 58 ? (day - 30) : (day - 58);
    const hour = String((i * 4) % 24).padStart(2, '0');
    const minute = String((i * 17) % 60).padStart(2, '0');
    const dateStr = `2026-${month}-${String(mDay).padStart(2, '0')}T${hour}:${minute}:00Z`;

    list.push({
      transactionId: `TXN-${pad}`,
      fromId,
      toId,
      amount,
      timestamp: dateStr,
    });
  }

  return list;
}

export const transfers = buildTransfers();

// ==========================================
// 2. SEED ENGINE CORE LOGIC
// ==========================================

/**
 * Idempotently seeds the CognoDB graph using parameterized Cypher and UNWIND batches.
 * Verifies exact node/relationship counts and all 7 ground-truth fraud & control scenarios.
 */
export async function seedDatabase() {
  const driver = getDriver();

  if (!driver) {
    console.error('Seed execution failed: Database driver is not initialized or configuration is missing.');
    process.exit(1);
  }

  const session = driver.session();

  try {
    console.log('--- Seeding CognoDB Graph with Synthetic Dataset ---');

    // 1. Ingest Nodes
    await session.run(`UNWIND $rows AS row MERGE (p:Person {id: row.id}) SET p += row`, { rows: persons });
    await session.run(`UNWIND $rows AS row MERGE (a:Account {id: row.id}) SET a += row`, { rows: accounts });
    await session.run(`UNWIND $rows AS row MERGE (d:Device {id: row.id}) SET d += row`, { rows: devices });
    await session.run(`UNWIND $rows AS row MERGE (ph:PhoneNumber {id: row.id}) SET ph += row`, { rows: phoneNumbers });
    await session.run(`UNWIND $rows AS row MERGE (addr:Address {id: row.id}) SET addr += row`, { rows: addresses });

    // 2. Ingest Relationships
    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Person {id: row.personId}), (a:Account {id: row.accountId})
       MERGE (p)-[:OWNS]->(a)`,
      { rows: ownerships }
    );

    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Person {id: row.personId}), (ph:PhoneNumber {id: row.phoneId})
       MERGE (p)-[:REGISTERED_WITH]->(ph)`,
      { rows: phoneRegistrations }
    );

    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Person {id: row.personId}), (addr:Address {id: row.addressId})
       MERGE (p)-[:LIVES_AT]->(addr)`,
      { rows: addressRegistrations }
    );

    await session.run(
      `UNWIND $rows AS row
       MATCH (a:Account {id: row.accountId}), (d:Device {id: row.deviceId})
       MERGE (a)-[:USED_DEVICE]->(d)`,
      { rows: deviceUsages }
    );

    await session.run(
      `UNWIND $rows AS row
       MATCH (from:Account {id: row.fromId}), (to:Account {id: row.toId})
       MERGE (from)-[r:TRANSFERRED_TO {transactionId: row.transactionId}]->(to)
       SET r.amount = row.amount, r.timestamp = row.timestamp`,
      { rows: transfers }
    );

    console.log('Graph ingestion completed successfully.\n');

    // ==========================================
    // 3. READ-ONLY VERIFICATION QUERIES
    // ==========================================
    console.log('=== VERIFYING GRAPH DATA COUNTS ===');

    const expectedNodes = { Person: 24, Account: 28, Device: 10, PhoneNumber: 10, Address: 10 };
    const nodeCounts = {};
    for (const [label, expected] of Object.entries(expectedNodes)) {
      const res = await session.run(`MATCH (n:${label}) RETURN count(n) AS count`);
      const count = res.records[0].get('count').toNumber();
      nodeCounts[label] = count;
      if (count !== expected) {
        throw new Error(`Count mismatch for :${label}. Expected ${expected}, got ${count}`);
      }
      console.log(`- ${label}: ${count} / ${expected} (MATCH)`);
    }

    const expectedRels = { OWNS: 28, REGISTERED_WITH: 24, LIVES_AT: 24, USED_DEVICE: 28, TRANSFERRED_TO: 140 };
    const relCounts = {};
    for (const [relType, expected] of Object.entries(expectedRels)) {
      const res = await session.run(`MATCH ()-[r:${relType}]->() RETURN count(r) AS count`);
      const count = res.records[0].get('count').toNumber();
      relCounts[relType] = count;
      if (count !== expected) {
        throw new Error(`Count mismatch for :${relType}. Expected ${expected}, got ${count}`);
      }
      console.log(`- ${relType}: ${count} / ${expected} (MATCH)`);
    }

    console.log('\n=== VERIFYING GROUND-TRUTH SCENARIOS ===');

    // 1. RING_01 (Circular Transfer Ring)
    const ringRes = await session.run(`
      MATCH path = (a:Account {id: 'ACC-001'})-[:TRANSFERRED_TO]->(b:Account)-[:TRANSFERRED_TO*2..4]->(a)
      RETURN [a.id] + [n IN nodes(path) | n.id] AS ringPath
      LIMIT 1
    `);
    const ringNodes = ringRes.records.length > 0 ? ringRes.records[0].get('ringPath') : null;
    const ringVerified = ringNodes && ringNodes.length >= 4;
    console.log(`- RING_01 (Circular Transfer Ring): ${ringVerified ? 'VERIFIED' : 'NOT VERIFIED'} (${ringNodes ? ringNodes.join(' → ') : 'None'})`);
    if (!ringVerified) throw new Error('Scenario verification failed: RING_01');

    // 2. SHARED_DEVICE_01 (Shared Device Cluster)
    const devRes = await session.run(`
      MATCH (a:Account)-[:USED_DEVICE]->(d:Device {id: 'DEV-001'})
      RETURN count(a) AS accountCount, collect(a.id) AS accounts
    `);
    const devAccCount = devRes.records[0].get('accountCount').toNumber();
    const devAccounts = devRes.records[0].get('accounts');
    const devVerified = devAccCount >= 3;
    console.log(`- SHARED_DEVICE_01 (Shared Device): ${devVerified ? 'VERIFIED' : 'NOT VERIFIED'} (${devAccCount} accounts: ${devAccounts.join(', ')})`);
    if (!devVerified) throw new Error('Scenario verification failed: SHARED_DEVICE_01');

    // 3. SHARED_PHONE_01 (Shared Phone Number)
    const phoneRes = await session.run(`
      MATCH (p:Person)-[:REGISTERED_WITH]->(ph:PhoneNumber {id: 'PH-001'})
      RETURN count(p) AS personCount, collect(p.id) AS persons
    `);
    const phoneCount = phoneRes.records[0].get('personCount').toNumber();
    const phonePersons = phoneRes.records[0].get('persons');
    const phoneVerified = phoneCount >= 3;
    console.log(`- SHARED_PHONE_01 (Shared Phone): ${phoneVerified ? 'VERIFIED' : 'NOT VERIFIED'} (${phoneCount} persons: ${phonePersons.join(', ')})`);
    if (!phoneVerified) throw new Error('Scenario verification failed: SHARED_PHONE_01');

    // 4. SHARED_ADDRESS_01 (Shared Physical Address)
    const addrRes = await session.run(`
      MATCH (p:Person)-[:LIVES_AT]->(addr:Address {id: 'ADDR-001'})
      RETURN count(p) AS personCount, collect(p.id) AS persons
    `);
    const addrCount = addrRes.records[0].get('personCount').toNumber();
    const addrPersons = addrRes.records[0].get('persons');
    const addrVerified = addrCount >= 3;
    console.log(`- SHARED_ADDRESS_01 (Shared Address): ${addrVerified ? 'VERIFIED' : 'NOT VERIFIED'} (${addrCount} persons: ${addrPersons.join(', ')})`);
    if (!addrVerified) throw new Error('Scenario verification failed: SHARED_ADDRESS_01');

    // 5. SMURFING_01 (Fan-in & Rapid Dispersal)
    const smurfInRes = await session.run(`
      MATCH (mule:Account)-[t:TRANSFERRED_TO]->(agg:Account {id: 'ACC-010'})
      RETURN count(t) AS inCount, sum(t.amount) AS totalIn, collect(DISTINCT mule.id) AS senders
    `);
    const smurfOutRes = await session.run(`
      MATCH (agg:Account {id: 'ACC-010'})-[t:TRANSFERRED_TO]->(out:Account)
      RETURN count(t) AS outCount, sum(t.amount) AS totalOut, collect(DISTINCT out.id) AS receivers
    `);
    const smurfInCount = smurfInRes.records[0].get('inCount').toNumber();
    const smurfOutCount = smurfOutRes.records[0].get('outCount').toNumber();
    const smurfVerified = smurfInCount >= 5 && smurfOutCount >= 2;
    console.log(`- SMURFING_01 (Fan-In / Dispersal): ${smurfVerified ? 'VERIFIED' : 'NOT VERIFIED'} (${smurfInCount} inbound fan-in transfers, ${smurfOutCount} outbound dispersals)`);
    if (!smurfVerified) throw new Error('Scenario verification failed: SMURFING_01');

    // 6. NORMAL_01 (Normal Control Account)
    const normRes = await session.run(`
      MATCH (p:Person)-[:OWNS]->(a:Account {id: 'ACC-020'})-[:USED_DEVICE]->(d:Device),
            (p)-[:REGISTERED_WITH]->(ph:PhoneNumber),
            (p)-[:LIVES_AT]->(addr:Address)
      RETURN a.id AS accountId, a.riskScore AS riskScore, p.name AS ownerName
    `);
    const normVerified = normRes.records.length > 0 && normRes.records[0].get('riskScore') < 0.2;
    console.log(`- NORMAL_01 (Control Account): ${normVerified ? 'VERIFIED' : 'NOT VERIFIED'} (ACC-020 riskScore: ${normRes.records[0]?.get('riskScore')})`);
    if (!normVerified) throw new Error('Scenario verification failed: NORMAL_01');

    // 7. LOW_ACTIVITY_01 (Low-Connectivity Account)
    const lowRes = await session.run(`
      MATCH (a:Account {id: 'ACC-028'})
      OPTIONAL MATCH (a)-[t1:TRANSFERRED_TO]->()
      OPTIONAL MATCH ()-[t2:TRANSFERRED_TO]->(a)
      RETURN count(t1) + count(t2) AS totalTransfers
    `);
    const lowTransfers = lowRes.records[0].get('totalTransfers').toNumber();
    const lowVerified = lowTransfers === 1;
    console.log(`- LOW_ACTIVITY_01 (Low Activity): ${lowVerified ? 'VERIFIED' : 'NOT VERIFIED'} (ACC-028 total transfers: ${lowTransfers})`);
    if (!lowVerified) throw new Error('Scenario verification failed: LOW_ACTIVITY_01');

    console.log('\nSeed execution and verification successful.');
    return true;
  } catch (err) {
    console.error(`Seed execution error: ${err.message}`);
    process.exitCode = 1;
    return false;
  } finally {
    await session.close();
    await closeDatabaseDriver();
  }
}

// Execute when invoked directly from command line
const currentFilePath = fileURLToPath(import.meta.url);
const invokedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFilePath === currentFilePath) {
  seedDatabase();
}
