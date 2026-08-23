import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { fraudApi } from '../api/client.js';
import { transformInvestigationToGraph } from '../utils/graphTransform.js';
import { formatSignalName } from '../utils/sessionHistory.js';
import RiskBadge from '../components/RiskBadge.jsx';
import { LoadingState, ErrorState } from '../components/FeedbackStates.jsx';
import { SearchIcon, ArrowRightIcon, NetworkIcon } from '../components/Icons.jsx';

export default function NetworkGraph() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accountIdInput, setAccountIdInput] = useState(id || 'ACC-010');
  const [currentAccountId, setCurrentAccountId] = useState(id || 'ACC-010');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cytoscape state
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [currentLayout, setCurrentLayout] = useState('cose');
  const [nodesLocked, setNodesLocked] = useState(false);

  // Fetch investigation data and build graph
  const loadGraphData = useCallback(async (accId) => {
    if (!accId) return;

    setLoading(true);
    setError(null);
    setSelectedNode(null);
    setSearchTerm('');
    setSearchNotFound(false);

    try {
      const data = await fraudApi.investigate(accId.trim());
      setReport(data);
    } catch (err) {
      setReport(null);
      setError({
        status: err.status,
        message: err.message || 'Failed to load graph data for this account.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync on param change or initial mount
  useEffect(() => {
    if (id) {
      setAccountIdInput(id);
      setCurrentAccountId(id);
      loadGraphData(id);
    } else {
      loadGraphData(currentAccountId);
    }
  }, [id, loadGraphData]);

  // Layout configuration generator
  const getLayoutConfig = (layoutName) => {
    if (layoutName === 'concentric') {
      return {
        name: 'concentric',
        concentric: (node) => (node.data('isPrimary') ? 10 : node.data('nodeTier') === 'connected_account' ? 5 : 2),
        levelWidth: () => 2,
        padding: 35,
        animate: false,
      };
    }

    if (layoutName === 'breadthfirst') {
      return {
        name: 'breadthfirst',
        directed: true,
        padding: 35,
        animate: false,
        roots: cyRef.current ? cyRef.current.nodes('[isPrimary = true]') : undefined,
      };
    }

    // Default tuned CoSE layout: tightly packed, centrally focused
    return {
      name: 'cose',
      idealEdgeLength: (edge) => (edge.data('edgeType') === 'incoming' || edge.data('edgeType') === 'outgoing' ? 85 : 75),
      nodeRepulsion: (node) => (node.data('isPrimary') ? 9000 : 5500),
      nodeOverlap: 10,
      gravity: 1.2,
      componentSpacing: 45,
      nestingFactor: 1.2,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      padding: 35,
      randomize: false,
      animate: false,
    };
  };

  // Initialize and update Cytoscape instance
  useEffect(() => {
    if (!containerRef.current || !report) return;

    const elements = transformInvestigationToGraph(report);

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        // Base Node
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-family': 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif',
            'font-size': '9.5px',
            'font-weight': '600',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '78px',
            'color': '#FFFFFF',
            'text-outline-width': 2,
            'text-outline-color': '#0F172A',
            'width': 48,
            'height': 48,
            'border-width': 2.5,
            'border-color': '#FFFFFF',
            'transition-property': 'background-color, border-color, border-width, opacity',
            'transition-duration': '0.15s',
          },
        },

        // Tier 1: Primary Account (Dominant Focal Point)
        {
          selector: 'node[isPrimary = true]',
          style: {
            'background-color': '#0E4D45',
            'border-color': '#10B981',
            'border-width': 4.5,
            'width': 72,
            'height': 72,
            'font-size': '11px',
            'font-weight': 'bold',
            'text-max-width': '95px',
            'text-outline-width': 2.5,
            'text-outline-color': '#052E28',
            'z-index': 100,
          },
        },

        // Tier 2: Directly Connected Accounts (Inbound / Outbound / Cycle)
        {
          selector: 'node[type = "Account"][nodeTier = "connected_account"]',
          style: {
            'background-color': '#1E40AF',
            'border-color': '#93C5FD',
            'border-width': 3,
            'width': 54,
            'height': 54,
            'font-size': '10px',
            'font-weight': 'bold',
            'shape': 'ellipse',
            'z-index': 80,
          },
        },

        // Tier 3: Secondary / Shared Accounts
        {
          selector: 'node[type = "Account"][nodeTier = "secondary"]',
          style: {
            'background-color': '#3B82F6',
            'border-color': '#BFDBFE',
            'border-width': 2,
            'width': 44,
            'height': 44,
            'font-size': '9px',
            'shape': 'ellipse',
            'z-index': 60,
          },
        },

        // Device Entities
        {
          selector: 'node[type = "Device"]',
          style: {
            'background-color': '#D97706',
            'border-color': '#FDE68A',
            'shape': 'round-rectangle',
            'width': 48,
            'height': 48,
            'font-size': '9.5px',
            'text-outline-color': '#78350F',
            'z-index': 70,
          },
        },

        // Phone Entities
        {
          selector: 'node[type = "PhoneNumber"]',
          style: {
            'background-color': '#0D9488',
            'border-color': '#99F6E4',
            'shape': 'diamond',
            'width': 50,
            'height': 50,
            'font-size': '9.5px',
            'text-outline-color': '#134E4A',
            'z-index': 70,
          },
        },

        // Address Entities
        {
          selector: 'node[type = "Address"]',
          style: {
            'background-color': '#059669',
            'border-color': '#A7F3D0',
            'shape': 'hexagon',
            'width': 50,
            'height': 50,
            'font-size': '9.5px',
            'text-outline-color': '#064E3B',
            'z-index': 70,
          },
        },

        // Person Entities
        {
          selector: 'node[type = "Person"]',
          style: {
            'background-color': '#6366F1',
            'border-color': '#C7D2FE',
            'shape': 'ellipse',
            'width': 46,
            'height': 46,
            'font-size': '9.5px',
            'text-outline-color': '#312E81',
            'z-index': 70,
          },
        },

        // Selected Node Highlight
        {
          selector: 'node:selected',
          style: {
            'border-color': '#F59E0B',
            'border-width': 5,
            'shadow-blur': 16,
            'shadow-color': '#F59E0B',
            'shadow-opacity': 0.85,
            'z-index': 999,
          },
        },

        // Base Edge Styling
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': '#94A3B8',
            'target-arrow-color': '#94A3B8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'control-point-step-size': 35,
            'arrow-scale': 1.25,
            'opacity': 0.85,
          },
        },

        // Inbound Transfer Edge
        {
          selector: 'edge[edgeType = "incoming"]',
          style: {
            'line-color': '#10B981',
            'target-arrow-color': '#10B981',
            'width': 3,
            'opacity': 0.95,
          },
        },

        // Outbound Transfer Edge
        {
          selector: 'edge[edgeType = "outgoing"]',
          style: {
            'line-color': '#EF4444',
            'target-arrow-color': '#EF4444',
            'width': 3,
            'opacity': 0.95,
          },
        },

        // Cycle Transfer Edge
        {
          selector: 'edge[edgeType = "cycle"]',
          style: {
            'line-color': '#F59E0B',
            'target-arrow-color': '#F59E0B',
            'width': 3,
            'opacity': 0.95,
          },
        },

        // Device Usage / Metadata Links
        {
          selector: 'edge[edgeType = "device"], edge[edgeType = "metadata"]',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [5, 4],
            'line-color': '#8B5CF6',
            'target-arrow-color': '#8B5CF6',
            'width': 2,
            'opacity': 0.8,
          },
        },

        // Ownership Link
        {
          selector: 'edge[edgeType = "owns"]',
          style: {
            'line-color': '#3B82F6',
            'target-arrow-color': '#3B82F6',
            'width': 2.5,
            'opacity': 0.9,
          },
        },
      ],
      layout: getLayoutConfig(currentLayout),
    });

    // Event listeners
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode(node.data());
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    // Run layout and center/fit after layout completes
    const layout = cy.layout(getLayoutConfig(currentLayout));
    layout.on('layoutstop', () => {
      cy.fit(null, 35);
      const primary = cy.nodes('[isPrimary = true]');
      if (primary.length > 0) {
        primary.select();
        setSelectedNode(primary.first().data());
      }
    });
    layout.run();

    cyRef.current = cy;

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [report, currentLayout]);

  // Handle Search Input Submission (loads new account investigation)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = accountIdInput.trim();
    if (trimmed) {
      navigate(`/graph/${encodeURIComponent(trimmed)}`);
    }
  };

  // Search inside active graph canvas
  const handleGraphNodeSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!cyRef.current) return;

    if (!term.trim()) {
      setSearchNotFound(false);
      cyRef.current.nodes().style('opacity', 1);
      cyRef.current.edges().style('opacity', 0.85);
      return;
    }

    const matched = cyRef.current.nodes().filter((n) => {
      const id = n.data('id') || '';
      const label = n.data('shortLabel') || '';
      return id.toLowerCase().includes(term.toLowerCase()) || label.toLowerCase().includes(term.toLowerCase());
    });

    if (matched.length > 0) {
      setSearchNotFound(false);
      cyRef.current.nodes().style('opacity', 0.25);
      cyRef.current.edges().style('opacity', 0.1);
      matched.style('opacity', 1);
      matched.connectedEdges().style('opacity', 0.9);
      matched.neighborhood().nodes().style('opacity', 0.8);
      cyRef.current.center(matched);

      // Select first match
      matched.first().select();
      setSelectedNode(matched.first().data());
    } else {
      setSearchNotFound(true);
      cyRef.current.nodes().style('opacity', 0.3);
      cyRef.current.edges().style('opacity', 0.1);
    }
  };

  // Layout switcher
  const handleLayoutChange = (layoutName) => {
    setCurrentLayout(layoutName);
    if (cyRef.current) {
      const layout = cyRef.current.layout(getLayoutConfig(layoutName));
      layout.on('layoutstop', () => {
        cyRef.current.fit(null, 35);
      });
      layout.run();
    }
  };

  // Zoom / Fit / Lock Controls
  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(null, 35);
  };

  const handleToggleLock = () => {
    if (!cyRef.current) return;
    const newLockState = !nodesLocked;
    setNodesLocked(newLockState);
    cyRef.current.nodes().forEach((n) => n.lock(newLockState));
  };

  const getTopSignalName = () => {
    if (!report || !Array.isArray(report.signals) || report.signals.length === 0) {
      return report?.riskScore === 0 ? 'Low Activity' : 'No Significant Signal';
    }
    const sorted = [...report.signals].sort((a, b) => (b.weight || 0) - (a.weight || 0));
    return formatSignalName(sorted[0].signal);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn select-none">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#111827] tracking-tight text-left">
            Network Graph
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5 text-left font-sans-ui">
            Interactive visualization of account relationships and money flow.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to={`/investigate/${encodeURIComponent(currentAccountId)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCD6CC] bg-white text-stone-700 hover:bg-[#FAF7F2] text-xs font-semibold transition"
          >
            <span>&larr; Back to Investigation</span>
          </Link>
        </div>
      </div>

      {/* Account Stat Summary Bar */}
      {report && (
        <div className="bg-white border border-[#EBE6DD] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-left">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Account ID</span>
              <span className="text-base font-bold font-mono text-[#0E4D45]">{report.accountId}</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Risk Score</span>
              <span className="text-base font-bold text-stone-900">{report.riskScore} / 100</span>
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-0.5">Risk Level</span>
              <RiskBadge level={report.riskLevel} size="sm" />
            </div>

            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Top Signal Detected</span>
              <span className="text-xs font-bold text-[#0E4D45]">{getTopSignalName()}</span>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={accountIdInput}
              onChange={(e) => setAccountIdInput(e.target.value)}
              placeholder="e.g. ACC-010"
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E2DDD5] rounded-xl text-stone-900 text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-[#0E4D45]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Load
            </button>
          </form>
        </div>
      )}

      {/* Main Interactive Canvas Section */}
      {loading ? (
        <LoadingState message="Rendering network graph..." submessage="Constructing nodes and edges from CognoDB relationship records" />
      ) : error ? (
        <ErrorState
          title={error.status === 404 ? 'Account Not Found' : 'Graph Generation Failed'}
          message={error.message}
          onRetry={() => loadGraphData(currentAccountId)}
        />
      ) : (
        <div className="bg-white border border-[#EBE6DD] rounded-2xl shadow-xs overflow-hidden relative flex flex-col lg:flex-row min-h-[620px]">
          {/* Main Cytoscape Canvas Area */}
          <div className="flex-1 relative min-h-[540px] flex flex-col">
            {/* Top Canvas Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              {/* Search Inside Graph */}
              <div className="relative pointer-events-auto w-52 sm:w-64">
                <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleGraphNodeSearch}
                  placeholder="Search node in graph..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white/95 backdrop-blur-xs border border-[#E0DBD2] rounded-xl text-xs text-stone-800 shadow-xs focus:outline-none focus:border-[#0E4D45]"
                />
                {searchNotFound && (
                  <span className="absolute right-2 top-2 text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                    No match
                  </span>
                )}
              </div>

              {/* Toolbar Controls: Zoom, Fit, Lock, Layout */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-white/95 backdrop-blur-xs border border-[#E0DBD2] p-1 rounded-xl shadow-xs text-xs font-medium text-stone-700">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                  title="Zoom In"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={handleFit}
                  className="px-2 py-1 rounded-lg hover:bg-stone-100 transition cursor-pointer text-[11px] font-semibold"
                  title="Fit to Screen"
                >
                  Fit
                </button>

                <div className="w-px h-4 bg-stone-200 mx-0.5" />

                <button
                  onClick={handleToggleLock}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer text-[11px] font-semibold ${
                    nodesLocked ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-stone-100 text-stone-700'
                  }`}
                  title="Lock node positions"
                >
                  {nodesLocked ? 'Locked' : 'Lock Nodes'}
                </button>

                <div className="w-px h-4 bg-stone-200 mx-0.5" />

                {/* Layout Switcher */}
                <select
                  value={currentLayout}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                  className="bg-transparent text-stone-800 text-[11px] font-semibold py-1 px-1.5 rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="cose">CoSE (Investigation)</option>
                  <option value="concentric">Concentric Rings</option>
                  <option value="breadthfirst">Flow Hierarchy</option>
                </select>
              </div>
            </div>

            {/* Cytoscape Canvas Container DOM Element */}
            <div ref={containerRef} className="w-full h-full min-h-[540px] bg-[#FAF7F2]/60 flex-1 cursor-grab active:cursor-grabbing" />

            {/* Bottom Graph Legend */}
            <div className="p-3 bg-white/95 backdrop-blur-xs border-t border-[#EBE6DD] flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-600">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-stone-800">Legend:</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0E4D45] border border-[#10B981]" /> Primary Account</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF]" /> Account</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#D97706]" /> Device</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45 bg-[#0D9488]" /> Phone</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" /> Address</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" /> Person</span>
              </div>

              <div className="flex items-center gap-4 text-stone-500">
                <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-[#10B981]" /> Inbound</span>
                <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-[#EF4444]" /> Outbound</span>
                <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-[#F59E0B]" /> Cycle</span>
                <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 border-t border-dashed border-[#8B5CF6]" /> Metadata</span>
              </div>
            </div>
          </div>

          {/* Right Selected Entity Inspector Panel */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#EBE6DD] bg-white p-6 flex flex-col justify-between text-left">
            <div>
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                Selected Entity
              </h2>

              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedNode.isPrimary ? 'bg-[#0E4D45] text-white' : 'bg-stone-200 text-stone-800'
                      }`}>
                        {selectedNode.type || 'Node'}
                      </span>
                      {selectedNode.isPrimary && (
                        <span className="text-[10px] font-bold text-[#0E4D45]">Primary Target</span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-sm text-stone-900 truncate">
                      {selectedNode.shortLabel || selectedNode.id}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {selectedNode.type === 'Account' && (
                      <>
                        {selectedNode.bank && (
                          <div className="flex justify-between py-1 border-b border-stone-100">
                            <span className="text-stone-400">Bank:</span>
                            <span className="font-semibold text-stone-800">{selectedNode.bank}</span>
                          </div>
                        )}
                        {typeof selectedNode.balance === 'number' && (
                          <div className="flex justify-between py-1 border-b border-stone-100">
                            <span className="text-stone-400">Balance:</span>
                            <span className="font-semibold text-stone-800">${selectedNode.balance.toLocaleString()}</span>
                          </div>
                        )}
                        {typeof selectedNode.riskScore === 'number' && (
                          <div className="flex justify-between py-1 border-b border-stone-100">
                            <span className="text-stone-400">Risk Score:</span>
                            <span className="font-bold text-stone-800">{selectedNode.riskScore} / 100</span>
                          </div>
                        )}
                        {selectedNode.riskLevel && (
                          <div className="flex justify-between items-center py-1 border-b border-stone-100">
                            <span className="text-stone-400">Risk Level:</span>
                            <RiskBadge level={selectedNode.riskLevel} size="sm" />
                          </div>
                        )}
                      </>
                    )}

                    {selectedNode.type === 'Device' && (
                      <>
                        <div className="flex justify-between py-1 border-b border-stone-100">
                          <span className="text-stone-400">Hardware ID:</span>
                          <span className="font-mono text-stone-800 font-medium">{selectedNode.hardwareId || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-100">
                          <span className="text-stone-400">Device Type:</span>
                          <span className="text-stone-800 capitalize">{selectedNode.deviceType || 'Hardware'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-100">
                          <span className="text-stone-400">IP Address:</span>
                          <span className="font-mono text-stone-800">{selectedNode.ipAddress || '—'}</span>
                        </div>
                      </>
                    )}

                    {selectedNode.type === 'PhoneNumber' && (
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">Phone Number:</span>
                        <span className="font-mono text-stone-800 font-semibold">{selectedNode.phoneNumber || selectedNode.id}</span>
                      </div>
                    )}

                    {selectedNode.type === 'Address' && (
                      <>
                        <div className="py-1 border-b border-stone-100 space-y-1">
                          <span className="text-stone-400 block">Address:</span>
                          <span className="text-stone-800 font-medium">{selectedNode.street || selectedNode.id}</span>
                        </div>
                        {selectedNode.city && (
                          <div className="flex justify-between py-1 border-b border-stone-100">
                            <span className="text-stone-400">City / Zip:</span>
                            <span className="text-stone-800">{selectedNode.city} {selectedNode.postalCode || ''}</span>
                          </div>
                        )}
                      </>
                    )}

                    {selectedNode.type === 'Person' && (
                      <div className="flex justify-between py-1 border-b border-stone-100">
                        <span className="text-stone-400">Person ID:</span>
                        <span className="font-mono text-stone-800 font-semibold">{selectedNode.id}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-stone-400 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC]">
                  Click on any node or edge in the graph canvas to inspect its metadata.
                </div>
              )}
            </div>

            {selectedNode && selectedNode.type === 'Account' && selectedNode.id !== currentAccountId && (
              <div className="pt-4 border-t border-stone-100 mt-4">
                <Link
                  to={`/investigate/${encodeURIComponent(selectedNode.id)}`}
                  className="w-full py-2.5 bg-[#0E4D45] hover:bg-[#0B3B34] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>Investigate this Account</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
