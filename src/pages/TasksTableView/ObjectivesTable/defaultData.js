export const displayOpts = {
  employeeName: false,
  dueDate: true,
  owner: true,
  progressStatus: true,
  comments: true,
  title: true,
  status: true,
  priority: true,
  targetDate: true,
  progress: true,
  keyResultName: true
};
export const displayOpts2 = {
  onTrack: true,
  atRisk: true,
  offTrack: true,
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