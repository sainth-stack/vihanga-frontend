export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      employeeName: data[i].employeeName,
      okrPeriod: data[i].okrPeriod,
      okrYear: data[i].okrYear,
      objective: data[i].objective,
      dueDate: data[i].dueDate ? window.moment(data[i].dueDate).format("D MMM YYYY") : "No Date",
      weight: data[i].weight,
      rewardPoints: data[i].rewardPoints,
      owner: data[i].owner ? data[i].owner : data[i].employeeName,
      successMetrics: data[i].successMetrics,
      profilePicture: data[i].profilePicture,
      progressStatus: data[i].progressStatus,
      feedAttachment: data[i].feedAttachment,
      comments: data[i].comments,
      employeeReferenceId: data[i].employeeReferenceId,
      updatedAt: data[i].updatedAt,
      children: [],
      cascaded: data[i].cascaded,
      dimension: data[i].dimension,
      objectiveStatus: data[i].objectiveStatus,
      uom: data[i].uom,
      polarity: data[i].polarity,
      target: data[i].target,
      actual: data[i].actual,
      targetDate: data[i].targetDate,
      actualDate: data[i].actualDate
    });
  }
  return items;
};

export const tableGeneratorChild = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      keyResultName: data[i].keyResultName,
      dueDate: window.moment(data[i].targetDate).format("YYYY-MM-DD"),
      feedAttachment: data[i].feedAttachment,
      updatedAt: data[i].updatedAt,
      profilePicture: data[i].profilePicture,
    });
  }
  return items;
};