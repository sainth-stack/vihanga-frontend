export const handleEditViewTask = (cellContent, field) => {
  const updateOb = {
    _id: cellContent._id,
    title: cellContent.title,
    dueDate: cellContent.dueDate,
    attachments: cellContent.feedAttachment,
    description: cellContent.description,
    startDate: cellContent.startDate,
    actualCompletionDate: cellContent.actualCompletionDate,
    linkToKR: cellContent.linkToKR,
    assignTo: cellContent.assignTo,
    priority: cellContent.priority,
    comments: cellContent.comments,
    krReferenceId: cellContent.krReferenceId
  };
  return updateOb;
};