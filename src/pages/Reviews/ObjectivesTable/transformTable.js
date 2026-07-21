

const transformChild = (childData, index, data) => {
  return childData.map((item) => ({
    ...item,
    dueDate: window.moment(item.targetDate).format("YYYY-MM-DD"),
    owner: data[index].owner ? data[index].owner : data[index].employeeName,
    successMetrics: data[index].successMetrics,
    profilePicture: data[index].profilePicture,
    weight: data[index].weight,
    objectiveStatus: data[index].objectiveStatus
  }));
};
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
      dueDate: data[i].dueDate || data[i].targetDate ? window.moment( data[i].dueDate || data[i].targetDate).format("D MMM YYYY") : "No Date",
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
      children: tableGeneratorChild2(data[i].children,data[i].children?.length),
      cascaded: data[i].cascaded,
      dimension: data[i].dimension,
      objectiveStatus: data[i].objectiveStatus,
      uom: data[i].uom,
      polarity: data[i].polarity,
      target: data[i].target,
      actual: data[i].actual,
      targetDate: data[i].targetDate,
      actualDate: data[i].actualDate,
      employeeRating: data[i].employeeRating,
      managerRating: data[i].managerRating,
    });
  }
  return items;
};

export const tableGeneratorObjective = (data, length) => {
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
      children: tableGeneratorChild2(data[i].children,data[i].children?.length),
      cascaded: data[i].cascaded,
      dimension: data[i].dimension,
      objectiveStatus: data[i].objectiveStatus,
      uom: data[i].uom,
      polarity: data[i].polarity,
      target: data[i].target,
      actual: data[i].actual,
      targetDate: data[i].targetDate,
      actualDate: data[i].actualDate,
      employeeRating: data[i].employeeRating,
      managerRating: data[i].managerRating,
    });
  }
  return items;
};

export const tableGeneratorChild2 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      ...data[i],
      id: i + 1,
      _id: data[i]._id,
      keyResultName: data[i].keyResultName,
      dueDate: window.moment(data[i].targetDate).format("D MMM YYYY"),
      feedAttachment: data[i].feedAttachment,
      updatedAt: data[i].updatedAt,
      profilePicture: data[i].profilePicture,
      objective: data[i].keyResultName,
      children: tableGeneratorChild3(data[i].children,data[i].children?.length),
      weight: data[i].percent || 0,
      progressStatus: data[i].progressStatus,
      actual:(data[i].actual || data[i].actual===null) ? data[i].actual :0
    });
  }
  return items;
};

export const tableGeneratorChild3 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
    ...data[i],
      progressStatus: data[i].progressStatus,
      objective: data[i].title,
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