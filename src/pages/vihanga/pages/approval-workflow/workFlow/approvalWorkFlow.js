import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Card1 from "./filterSection/cards/card1";
import ApprovalWorkflowCard from "./components/topSection";
import WorkflowFilterCard from "./filterSection/filterSection";
import { appURL } from "utilities";
import { useHistory } from "react-router-dom";
import { Toast } from "service/toast";


const ApprovalWorkFlow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search,setSearch]= useState("");
  const history = useHistory();

const filteredWorkflows = workflows.filter((workflow) => {
    if (!search) return true;
    const approvalChainSteps = Array.isArray(workflow?.approvalChain)
    ? workflow.approvalChain
    : Object.values(workflow?.approvalChain || {}).flat();

  const searchValue = search.toLowerCase();
    return (
      workflow?.workflowDetails?.name?.toLowerCase().includes(searchValue) ||
      workflow?.workflowDetails?.description?.toLowerCase().includes(searchValue)||
       (Array.isArray(approvalChainSteps) &&
      approvalChainSteps.some(
        (step) =>
          typeof step?.title === "string" &&
          step.title.toLowerCase().includes(searchValue)
      ))
  );
})

  const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;
  const fetchWorkflows = async () => {
    try {
      const response = await axios.get(
        `${appURL}/recruitment/workflow?companyId=${companyId}`
      );
      const workflowArray = response?.data?.data;
      if (response?.data?.success && Array.isArray(workflowArray)) {
        setWorkflows(workflowArray);
      } else {
        setError("Failed to retrieve workflows");
      }
    } catch (err) {
      setError("Error fetching workflows");
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {

   fetchWorkflows();
 }, []);

 const handleDelete = async (workflowId) => {
  try {
   const response = await axios.delete(
     `${appURL}/recruitment/workflow?id=${workflowId}&companyId=${companyId}`
   );
    if (response?.data?.success) {
      fetchWorkflows();
      Toast({ message: "Workflow deleted successfully", type: "success" });
    }
  } catch (err) {
    console.log("error", err);
    Toast({ message: "Failed to delete workflow", type: "error" });
  }
 }
  const handleEdit = (workflowId) => {
    const selectedWorkflow = workflows.find(
      (workflow) => workflow._id === workflowId
    );

    if (!selectedWorkflow) {
      setError("Workflow not found");
      return;
    }

    history.push({
      pathname: "/admin/approval",
      state: {
        isEdit: true,
        workflowId,
        workflow: selectedWorkflow,
      },
    });
  };
  

  return (
    <Box sx={{}}>
      <ApprovalWorkflowCard />
      <WorkflowFilterCard search={search}
        setSearch={setSearch}/>
      <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
        {loading && <Box>Loading...</Box>}
        {error && <Box color="error.main">{error}</Box>}
        {!loading && !error && filteredWorkflows.length === 0 && (
          <Box>No workflows found</Box>
        )}
        {!loading && !error && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredWorkflows.map((workflow) => (
              <Card1
                key={workflow._id}
                workflow={workflow}
                handleDelete={handleDelete}
                handleEdit={() => handleEdit(workflow._id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};


export default ApprovalWorkFlow;