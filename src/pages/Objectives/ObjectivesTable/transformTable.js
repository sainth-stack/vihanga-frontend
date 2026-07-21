

const transformChild = (childData, index, data) => {
  return childData.map((item) => ({
    ...item,
    dueDate: window.moment(item.targetDate).format("YYYY-MM-DD"),
    owner: data[index].owner ? data[index].owner : data[index].employeeName,
    successMetrics: data[index].successMetrics,
    profilePicture: data[index].profilePicture,
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
      children:
        data[i].children.length > 0
          ? transformChild(data[i].children, i, data)
          : data[i].children,
      cascaded: data[i].cascaded,
      cascadedById: data[i].cascadedById,
      cascadedByName: data[i].cascadedByName,
      dimension: data[i].dimension,
      objectiveStatus: data[i].objectiveStatus,
      IndividualNames: data[i].IndividualNames || [],
      IndividualProgress: data[i].IndividualProgress || [],
      eachPercentage: data[i].eachPercentage || [],
      randomColors: data[i].randomColors || [],
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