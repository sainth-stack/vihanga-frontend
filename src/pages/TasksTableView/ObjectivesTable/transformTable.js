const transformChild = (childData, index, data) => {
  return childData.map((item, i) => ({
    ...item,
    id: i + 1,
    children: tableGeneratorChild(item, childData.length),
  }));
};
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      title: data[i].title,
      targetDate: data[i].dueDate
        ? window.moment(data[i].dueDate).format("D MMM YYYY")
        : "No Date",
      dueDate: data[i].dueDate
        ? window.moment(data[i].dueDate).format("D MMM YYYY")
        : "No Date",
      actualCompletionDate: data[i].actualCompletionDate
        ? window.moment(data[i].actualCompletionDate).format("D MMM YYYY")
        : null,
      startDate: data[i].startDate
        ? window.moment(data[i].startDate).format("D MMM YYYY")
        : null,
      profilePicture: data[i].profilePicture,
      mainTask: data[i].mainTask ? data[i].mainTask : "",
      actualEffort: data[i].actualEffort ? data[i].actualEffort : "",
      krReferenceId: data[i].krReferenceId ? data[i].krReferenceId : "",
      linkToKR: data[i].linkToKR ? data[i].linkToKR : "",
      assignTo: data[i].assignTo ? data[i].assignTo : [],
      progressStatus: data[i].progressStatus ? data[i].progressStatus : 0,
      priority: data[i].priority,
      estimationEffort: data[i].estimationEffort,
      status: data[i].status,
      owner: data[i].owner,
      userId: data[i].userId,
      companyId: data[i].companyId,
      recurrence: data[i].recurrence,
      description: data[i].description,
      employeeName: data[i].employeeName,
      dueMessage: data[i].dueMessage,
      rewardPoints: data[i].rewardPoints ? data[i].rewardPoints : 0,
      children:
        data[i].children.length > 0
          ? transformChild(data[i].children, i, data)
          : data[i].children,
      comments: data[i].comments ? data[i].comments : [],
      createdAt: data[i].createdAt,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};

export const tableGeneratorChild = (data, length) => {
  const items = [];
  if (data && data.comments && data.comments.length > 0) {
    items.push({
      comment: data.comments[0].comment,
    });
  }
  return items;
};
