
export const filterData = (data, displayOptions2, searchKey, transcript) => {
  return data.filter((item) => {
  
    if (displayOptions2.offTrack && !displayOptions2.onTrack && !displayOptions2.atRisk) {
      if (item.progressStatus >= 0 && item.progressStatus <= 60) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1
        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && displayOptions2.onTrack && !displayOptions2.atRisk) {
      if (item.progressStatus > 80) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1


        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && !displayOptions2.onTrack && displayOptions2.atRisk) {
      if (item.progressStatus > 61 && item.progressStatus <= 80) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1

        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && displayOptions2.atRisk && !displayOptions2.onTrack) {
      if (item.progressStatus > 0 && item.progressStatus <= 80) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1

        );
      }
      return null;
    }
    else if (!displayOptions2.offTrack && displayOptions2.atRisk && displayOptions2.onTrack) {
      if (item.progressStatus > 61) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1

        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && !displayOptions2.atRisk && displayOptions2.onTrack) {
      if (item.progressStatus > 0 && item.progressStatus <= 60 || item.progressStatus > 80) {
        return (
          (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
          (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1

        );
      }
      return null;
    }
    else if (displayOptions2.offTrack && displayOptions2.atRisk && displayOptions2.onTrack) {
      return (
        (item.title?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.status?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.priority?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.mainTask?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.targetDate?.toString()?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.krReferenceId?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1 ||
        (item.linkToKR?.toLowerCase() || '').indexOf(searchKey.toLowerCase()) !== -1

      );
    }



    return item;
  });
};