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
};
export const displayOpts2 = {
  active: true,
  inactive: true,
};

export const selectRow = (selectedUsers, setSelectedUsers, data) => ({
  mode: "checkbox",
  clickToSelect: true,
  onSelect: (row) => {
    let totalData = [...selectedUsers];
    let filteredData = totalData.findIndex((item) => item._id === row._id);
    if (filteredData < 0) {
      totalData.push(row);
      setSelectedUsers(totalData);
    } else {
      totalData.splice(filteredData, 1);
      setSelectedUsers(totalData);
    }
  },
  onSelectAll: (isSelected) => {
    if (isSelected) {
      setSelectedUsers(data);
    } else {
      setSelectedUsers([]);
    }
  },
});