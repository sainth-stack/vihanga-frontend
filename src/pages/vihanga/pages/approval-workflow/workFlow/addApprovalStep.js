import React from "react";
import AddApprovalHeader from "./addApprovalHeader";
import SelectCard from "./bodySection";
import { useLocation } from "react-router-dom";

const AddApprovalStep = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState("roles");
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div>
      <AddApprovalHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <SelectCard
        selected={location.state?.selected}
        workflowDetails={location.state?.workflowDetails}
        approvalChain={location.state?.approvalChain}
        step={location.state?.step || 0}
        isEdit={location.state?.isEdit}
        workflowId={location.state?.workflowId}
        activeTab={activeTab}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AddApprovalStep;
