

const transformChild = (childData, index, data) => {
  return childData.map((item) => ({
    ...item,
    dueDate: window.moment(item.targetDate).format("YYYY-MM-DD"),
    owner: data[index].owner ? data[index].owner : data[index].employeeName,
    successMetrics: data[index].successMetrics,
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
      dueDate: window.moment(data[i].dueDate).format("YYYY-MM-DD"),
      weight: data[i].weight,
      owner: data[i].owner ? data[i].owner : data[i].employeeName,
      successMetrics: data[i].successMetrics,
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
      objectiveStatus: data[i].objectiveStatus,
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
    });
  }
  return items;
};