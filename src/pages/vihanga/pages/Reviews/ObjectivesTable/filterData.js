
export const filterData = (data, displayOptions2, searchKey, transcript) => {
  return data.filter((item) => {
    if (displayOptions2.offTrack && !displayOptions2.onTrack && !displayOptions2.atRisk) {
      if (item.progressStatus >= 0 && item.progressStatus <= 60) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && displayOptions2.onTrack && !displayOptions2.atRisk) {
      if (item.progressStatus > 80) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && !displayOptions2.onTrack && displayOptions2.atRisk) {
      if (item.progressStatus > 61 && item.progressStatus <= 80) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && displayOptions2.atRisk && !displayOptions2.onTrack) {
      if (item.progressStatus > 0 && item.progressStatus <= 80) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && displayOptions2.atRisk && displayOptions2.onTrack) {
      if (item.progressStatus > 61) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && !displayOptions2.atRisk && displayOptions2.onTrack) {
      if (item.progressStatus > 0 && item.progressStatus <= 60 || item.progressStatus > 80) {
        return (
          (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && displayOptions2.atRisk && displayOptions2.onTrack) {
      return (
        (item.employeeName?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.okrPeriod?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.okrYear?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.objective?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.dueDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.owner?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.employeeReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
      );
    }

    return null;
  });
};