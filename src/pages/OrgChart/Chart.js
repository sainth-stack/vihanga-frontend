import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { useDispatch } from 'react-redux';
import { getOrgChart } from 'action/EmployeeAct';
import { LoadingIndicator } from 'utilities';
import OrgChartComponent from './NewOrgChart';
import avatarPersonnel from 'assets/svg/avatar-personnel.svg';
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
const Chart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const fetchOrgChartData = () => {
    try {
      setLoading(true);
      let response = dispatch(getOrgChart());
      response.then(({ data: payload, message }) => {
        const apiData = payload?.finalData ?? [];
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Build maps
          const idToEmployee = new Map();
          const nameToId = new Map();
          apiData.forEach((emp) => {
            if (emp && emp._id) {
              idToEmployee.set(emp._id, emp);
              if (emp.name && typeof emp.name === 'string') {
                nameToId.set(emp.name.trim(), emp._id);
              }
            }
          });

          // Derive child->parent mapping from nested children arrays if present
          const childToParentFromChildren = new Map();
          apiData.forEach((emp) => {
            if (Array.isArray(emp.children)) {
              emp.children.forEach((child) => {
                if (child && child._id) {
                  childToParentFromChildren.set(child._id, emp._id);
                }
              });
            }
          });

          // Resolve parent for each employee
          const nodes = Array.from(idToEmployee.values()).map((emp) => {
            let resolvedManagerId = null;
            // Priority 1: explicit children relationship
            if (childToParentFromChildren.has(emp._id)) {
              resolvedManagerId = childToParentFromChildren.get(emp._id);
            } else if (emp.lineManager && typeof emp.lineManager === 'string') {
              const managerCandidate = emp.lineManager.trim();
              if (idToEmployee.has(managerCandidate)) {
                resolvedManagerId = managerCandidate;
              } else if (nameToId.has(managerCandidate)) {
                resolvedManagerId = nameToId.get(managerCandidate);
              }
            }

            // Avoid self-links
            if (resolvedManagerId === emp._id) {
              resolvedManagerId = null;
            }
            return {
              nodeId: `E-${emp._id}`,
              parentNodeId: resolvedManagerId ? `E-${resolvedManagerId}` : null,
              nodeImage: emp?.profilePicture && String(emp?.profilePicture).trim() !== "" ? emp?.profilePicture : (emp?.gender === "Male" ? maleIcon : femaleIcon),
              name: emp?.name,
              positionName: emp?.designation || emp?.jobCategory || emp?.role,
              jobCategory: emp?.jobCategory || emp?.role,
              directSubordinates: emp?.direct || 0,
              totalSubordinates: emp?.subOrdinates || 0,
              _raw: emp,
              _resolvedManagerId: resolvedManagerId,
            };
          });

          // Enforce single root if needed
          const roots = nodes.filter((n) => n.parentNodeId === null);
          if (roots.length > 1) {
            // Prefer one with empty lineManager or with highest subordinates
            const pickPrimary = () => {
              const withEmptyLM = roots.filter((n) => !n._raw.lineManager || n._raw.lineManager.trim() === '');
              if (withEmptyLM.length === 1) return withEmptyLM[0];
              if (withEmptyLM.length > 1) {
                return withEmptyLM.sort((a, b) => (b.totalSubordinates || 0) - (a.totalSubordinates || 0))[0];
              }
              return roots.sort((a, b) => (b.totalSubordinates || 0) - (a.totalSubordinates || 0))[0];
            };
            const primaryRoot = pickPrimary();
            const primaryId = primaryRoot.nodeId;
            nodes.forEach((n) => {
              if (n.parentNodeId === null && n.nodeId !== primaryId) {
                n.parentNodeId = primaryId;
              }
            });
          }

          // Detect and resolve cycles
          const detectAndResolveCycles = (nodes) => {
            const visited = new Set();
            const visiting = new Set();
            const nodeMap = new Map();
            
            // Build node map for quick lookup
            nodes.forEach(node => {
              nodeMap.set(node.nodeId, node);
            });
            
            const detectCycle = (nodeId, path = []) => {
              if (visiting.has(nodeId)) {
                // Cycle detected! Return the cycle path
                const cycleStart = path.indexOf(nodeId);
                return path.slice(cycleStart).concat(nodeId);
              }
              
              if (visited.has(nodeId)) {
                return null; // Already processed this subtree
              }
              
              visiting.add(nodeId);
              path.push(nodeId);
              
              const node = nodeMap.get(nodeId);
              if (node && node.parentNodeId && nodeMap.has(node.parentNodeId)) {
                const cycle = detectCycle(node.parentNodeId, [...path]);
                if (cycle) {
                  return cycle;
                }
              }
              
              visiting.delete(nodeId);
              visited.add(nodeId);
              return null;
            };
            
            // Check each node for cycles
            const resolvedNodes = [...nodes];
            const processedNodes = new Set();
            
            for (const node of resolvedNodes) {
              if (!processedNodes.has(node.nodeId)) {
                const cycle = detectCycle(node.nodeId);
                if (cycle) {
                  console.warn('Cycle detected in org chart:', cycle);
                  
                  // Break the cycle by choosing the best node to be the manager
                  // Priority: higher total subordinates, then higher direct subordinates
                  const cycleNodes = cycle.slice(0, -1).map(id => nodeMap.get(id)).filter(Boolean);
                  const bestManager = cycleNodes.reduce((best, current) => {
                    if (!best) return current;
                    if ((current.totalSubordinates || 0) > (best.totalSubordinates || 0)) return current;
                    if ((current.totalSubordinates || 0) === (best.totalSubordinates || 0) && 
                        (current.directSubordinates || 0) > (best.directSubordinates || 0)) return current;
                    return best;
                  });
                  
                  // Remove parent relationship for the chosen manager
                  const managerNodeInResolved = resolvedNodes.find(n => n.nodeId === bestManager.nodeId);
                  if (managerNodeInResolved) {
                    managerNodeInResolved.parentNodeId = null;
                    console.warn(`Broke cycle by making ${bestManager.name} (${bestManager.nodeId}) a root node`);
                  }
                  
                  // Mark all nodes in cycle as processed
                  cycle.forEach(nodeId => processedNodes.add(nodeId));
                }
              }
            }
            
            return resolvedNodes;
          };
          
          const cycleResolvedNodes = detectAndResolveCycles(nodes);
          
          // Re-enforce single root after cycle resolution (since breaking cycles might create new roots)
          const rootsAfterCycleResolution = cycleResolvedNodes.filter((n) => n.parentNodeId === null);
          if (rootsAfterCycleResolution.length > 1) {
            // Choose primary root using the same logic as before
            const pickPrimary = () => {
              const withEmptyLM = rootsAfterCycleResolution.filter((n) => !n._raw.lineManager || n._raw.lineManager.trim() === '');
              if (withEmptyLM.length === 1) return withEmptyLM[0];
              if (withEmptyLM.length > 1) {
                return withEmptyLM.sort((a, b) => (b.totalSubordinates || 0) - (a.totalSubordinates || 0))[0];
              }
              return rootsAfterCycleResolution.sort((a, b) => (b.totalSubordinates || 0) - (a.totalSubordinates || 0))[0];
            };
            const primaryRoot = pickPrimary();
            const primaryId = primaryRoot.nodeId;
            
            // Make all other roots report to the primary root
            cycleResolvedNodes.forEach((n) => {
              if (n.parentNodeId === null && n.nodeId !== primaryId) {
                n.parentNodeId = primaryId;
                console.warn(`Made ${n.name} (${n.nodeId}) report to primary root ${primaryRoot.name} to ensure single root`);
              }
            });
          }
          
          // Calculate actual direct and total subordinates based on the hierarchy
          const calculateSubordinates = (nodes) => {
            // Create a map for quick lookup
            const nodeMap = new Map();
            nodes.forEach(node => {
              nodeMap.set(node.nodeId, node);
            });
            
            // Build children map
            const childrenMap = new Map();
            nodes.forEach(node => {
              if (node.parentNodeId) {
                if (!childrenMap.has(node.parentNodeId)) {
                  childrenMap.set(node.parentNodeId, []);
                }
                childrenMap.get(node.parentNodeId).push(node.nodeId);
              }
            });
            
            // Calculate total subordinates recursively
            const calculateTotalSubordinates = (nodeId) => {
              const children = childrenMap.get(nodeId) || [];
              let total = children.length; // Start with direct children count
              
              // Add all descendants
              children.forEach(childId => {
                total += calculateTotalSubordinates(childId);
              });
              
              return total;
            };
            // Update each node with calculated values
            nodes.forEach(node => {
              const children = childrenMap.get(node.nodeId) || [];
              node.directSubordinates = children.length;
              node.totalSubordinates = calculateTotalSubordinates(node.nodeId);
            });
            
            return { nodes, childrenMap };
          };
          
          const { nodes: nodesWithCalculatedCounts, childrenMap } = calculateSubordinates(cycleResolvedNodes);          
          const finalNodes = nodesWithCalculatedCounts.map(({ _raw, _resolvedManagerId, ...rest }) => rest);

          setData(finalNodes);
          setEmployees(payload.employees || []);
          setLoading(false);
          setError("");
        } else if (Array.isArray(apiData) && apiData.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message || "Failed to load org chart data");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchOrgChartData();
  }, []);
  return error ? (
    <h3 className="text-danger">{error}</h3>
  ) : loading ? (
    <LoadingIndicator size="3" />
  ) : (
    <>
      <div className="d-flex justify-content-between pt-2  org-topbar">
      </div>
      <div className='printonly org-bg'>
        <h1 className='orgTitle'>OrgChart</h1>
        <OrgChartComponent
          data={data}
        />
      </div>
    </>
  );
};

export default Chart;