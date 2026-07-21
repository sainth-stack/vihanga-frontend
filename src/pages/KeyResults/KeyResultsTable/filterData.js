
export const filterData = (data, displayOptions2, searchKey) => {
  return data.filter((item) => {
    if (displayOptions2.active && !displayOptions2.inactive) {
      if (item.status === "Active") {
        return (
          item.employeeName.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.okrPeriod.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.okrYear.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.objective.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.dueDate.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.owner.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 ||
          item.employeeReferenceId
            .toLowerCase()
            .indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    } else if (displayOptions2.inactive && !displayOptions2.active) {
      if (item.status === "Inactive") {
        return (
          item.employeeName.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.okrPeriod.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.okrYear.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.objective.toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.dueDate.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !==
          -1 ||
          item.owner.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 ||
          item.employeeReferenceId
            .toLowerCase()
            .indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    } else if (displayOptions2.active && displayOptions2.inactive) {
      return (
        item.employeeName.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !==
        -1 ||
        item.okrPeriod.toLowerCase().indexOf(searchKey.toLowerCase()) !==
        -1 ||
        item.okrYear.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 ||
        item.objective.toLowerCase().indexOf(searchKey.toLowerCase()) !==
        -1 ||
        item.dueDate.toString().toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 ||
        item.owner.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1 ||
        item.employeeReferenceId
          .toLowerCase()
          .indexOf(searchKey.toLowerCase()) !== -1
      );
    }
    return null;
  });
};