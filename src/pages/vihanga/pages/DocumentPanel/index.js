import React from "react";
import DocumentSubmissionsTable from "./DocumentSubmissionsTable";

const DocumentPanel = ({ isAdmin = false, employeeId = null }) => {
  return <DocumentSubmissionsTable isAdmin={isAdmin} employeeId={employeeId} />;
};

export default DocumentPanel;
export { DocumentSubmissionsTable };

