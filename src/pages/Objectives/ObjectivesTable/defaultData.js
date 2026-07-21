export const displayOpts = {
  employeeName: true,
  okrPeriod: true,
  okrYear: true,
  objective: true,
  dueDate: true,
  weight: true,
  owner: true,
  successMetrics: true,
  progressStatus: true,
  feedAttachment: true,
  comments: true,
  employeeReferenceId: true,
  keyResultName: true,
};
export const displayOpts2 = {
  onTrack: true,
  atRisk: true,
  offTrack: true,
};

export const selectRow = (selectedUsers, setSelectedUsers, data, readonly = false) => ({
  mode: "checkbox",
  clickToSelect: true,
  onSelect: (row) => {
    if (!readonly) {
      let totalData = [...selectedUsers];
      let filteredData = totalData.findIndex((item) => item._id === row._id);
      if (filteredData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filteredData, 1);
        setSelectedUsers(totalData);
      }
    }
  },
  onSelectAll: (isSelected) => {
    if (!readonly) {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    }
  },
});