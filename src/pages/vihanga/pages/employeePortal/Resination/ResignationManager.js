import React, { useState } from "react";
import ResignationForm from "./form/ResignationForm";
import ResignationTable from "./resignationTable/resignationTable";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const ResignationManager = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Called by table when "Edit" is clicked
  const handleEdit = (record) => {
    setSelectedRecord(record);
  };

  // Called by form after create/update or cancel
  const handleSaved = () => {
    setSelectedRecord(null);
    setRefreshFlag((f) => !f);
  };

  return (
    <>
      <ResignationForm selectedRecord={selectedRecord} onSaved={handleSaved} />
      <ResignationTable onEdit={handleEdit} refreshFlag={refreshFlag} />
    </>
  );
};

export default ResignationManager;
