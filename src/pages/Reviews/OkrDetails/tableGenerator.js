
const transformChild = (childData, index, data) => {
  return childData.map((item) => ({
    ...item,
    dueDate: item.targetDate,
    status: item.status
  }));
};
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id || "",
      dimension: data[i].dimension || "",
      isAlignedToCompany: data[i].isAlignedToCompany || "",
      okrName: data[i].okrName || "",
      keyResultName: data[i].keyResultName || "",
      objectiveId: data[i].objectiveId || "",
      frequency: data[i].frequency || "",
      uom: data[i].uom || "",
      polarity: data[i].polarity || "",
      msc: data[i].msc || "",
      targetDate: window.moment(data[i].targetDate).format("DD MMM YYYY") || "",
      actualDate: data[i].actualDate ? window.moment(data[i].actualDate).format("DD MMM YYYY") : "",
      target: data[i].target || "",
      actual: data[i].actual || 0,
      feedAttachment: data[i].feedAttachment || "",
      progress: data[i].progress || "",
      basevalue: data[i].basevalue || 0,
      objectiveStatus: data[i].objectiveStatus || 0,
      children: data[i].children.length > 0 ? transformChild(data[i].children, i, data) : data[i].children,
      rewardPoints: data[i].rewardPoints || 0,
      createdAt: data[i].createdAt || 0,
      updatedAt: data[i].updatedAt || 0,
    });
  }

  return items;
};
