/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styles.scss";
import {
  deletekeyResult,
} from "action/keyResultAct";
import { deleteTask } from "action/TasksAct";
import { updateTask } from "action/TasksAct";
import { updateNotificationTask, updateNotificationGoal,updateNotification } from "action/NotificationAct";
import { useQueryClient } from "@tanstack/react-query";
import { deleteObjectives, updateObjective } from "action/GoalsAct";
import {
  updateObjective as updateData,
} from "action/UserAct";
export function Handlers(data, setUpdateObj, setLoading, dispatch, props, refreshData, checkCelebration, setEditModal, setError, setEditModalTask, setOrderModalShow3, selectedUsers, setSelectedUsers, setRewardPoints,templateInfo) {
  const queryClient = useQueryClient();
  const handleEdit = (cellContent, field) => {
    const updateOb = {
      _id: cellContent._id,
      objective: cellContent.objective,
      successMetrics: cellContent.successMetrics,
      weight: cellContent.weight,
      owner: cellContent.owner,
      dueDate: cellContent.dueDate,
      progressStatus: cellContent.progressStatus,
      comments: cellContent.comments,
      feedAttachment: cellContent.feedAttachment,
      employeeName: cellContent.employeeName,
      employeeReferenceId: cellContent.employeeReferenceId,
      okrYear: cellContent.okrYear,
      okrPeriod: cellContent.okrPeriod,
      fieldName: field,
      children: cellContent.children,
      data: data,
      objectiveStatus: cellContent.objectiveStatus,
      dimension: cellContent.dimension,
      ...cellContent
    };
    setUpdateObj(updateOb); // setShowInputBox(!showInputBox);
  };

  const handleEditTask = (cellContent, field) => {
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
    setUpdateObj(updateOb);
  };

  const handleViewTask = (cellContent, field) => {
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
    setUpdateObj(updateOb);
  };

  const handleCallbackEdit = childData => {
    setLoading(true);
    let finalDet = {
      ...childData
    };
    let response = dispatch(templateInfo?.percentageType === 'goal' ?updateObjective(childData._id, finalDet):updateData(childData._id, finalDet));
    response.then(({
      success,
      message,
      data
    }) => {
      if (success) {
        if (data.rewardPoints > 0) {
          setRewardPoints(data.rewardPoints);
          checkCelebration()
        }
        const objectiveStatus = {
          objectiveStatus: "Update",
          row: childData,
          companyInfo: props.companyInfo
        };
        let response3 = dispatch(templateInfo?.percentageType !== 'goal' ?updateNotification(childData._id, objectiveStatus) :updateNotificationGoal(childData._id, objectiveStatus));
        response3.then(({
          success,
          message
        }) => {
          if (success) {
            setLoading(false);
            refreshData(childData._id);
            setEditModal(false);
            setError("");
            queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
          }
        }).catch(e => {
          setLoading(false);
          refreshData();
          setEditModal(false);
        });
      } else {
        setLoading(false);
        //setError(message);
      }
    });
  };
  const handleCallbackEditTask = childData => {
    try {
      setLoading(true);
      let response = dispatch(updateTask(childData[1].id, childData[0]));
      response.then(({
        data,
        message,
        success
      }) => {
        if (success) {
          let user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;

          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Update",
              row: {
                ...childData[0],
                employeeReferenceId: user.ownerId
              },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId
              }
            };
            let response2 = dispatch(updateNotificationTask(childData[1].id, objectiveStatus));
            response2.then(({
              success,
              message
            }) => {
              if (success) {
                setEditModalTask(false);
                refreshData();
                setLoading(false);
                setError("");
                queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
              }
            });
          }
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleDelete = (id, row) => {
    try {
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row,
        companyInfo: props.companyInfo
      };
      let response2 = dispatch(updateNotificationGoal(id, objectiveStatus));
      response2.then(({
        success,
        message
      }) => {
        if (success) {
          let response = dispatch(deleteObjectives({
            data: [id]
          }));
          response.then(({
            success,
            message
          }) => {
            if (success) {
              refreshData();
              setError("");
              queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
            } else {
              setError(message);
            }
          });
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleDeleteKeyResults = id => {
    try {
      //setLoading(true);
      let response = dispatch(deletekeyResult(id));
      response.then(({
        success,
        message
      }) => {
        if (success) {
          //setLoading(false);
          refreshData();
          setError("");
          queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
        } else {
          //setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleDeleteTasks = (id, row) => {
    try {
      //setLoading(true);
      let user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;

      if (user !== null) {
        const objectiveStatus = {
          objectiveStatus: "Delete",
          row: {
            ...row,
            employeeReferenceId: user.ownerId
          },
          companyInfo: {
            employeeName: user.ownerName,
            employeeReferenceId: user.ownerId
          }
        };
        let response2 = dispatch(updateNotificationTask(id, objectiveStatus));
        response2.then(({
          success,
          message
        }) => {
          if (success) {
            let response = dispatch(deleteTask(id));
            response.then(({
              success,
              message
            }) => {
              if (success) {
                //setLoading(false);
                refreshData();
                setError("");
                queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
              } else {
                //setLoading(false);
                setError(message);
              }
            });
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handlecallback = childData => {
    if (childData.refreshData) {
      refreshData();
    }
  };

  const handleBulkDelete = () => {
    try {
      setLoading(true);
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row: selectedUsers[0],
        companyInfo: props.companyInfo
      };
      let response2 = dispatch(updateNotificationGoal(selectedUsers[0]._id, objectiveStatus));
      response2.then(({
        success,
        message
      }) => {
        if (success) {
          let response = dispatch(deleteObjectives({
            data: selectedUsers
          }));
          response.then(({
            success,
            message
          }) => {
            if (success) {
              setLoading(false);
              setSelectedUsers([])
              refreshData();
              setError("");
              setOrderModalShow3(false);
              queryClient.invalidateQueries("goals", "objectives", "keyresults", "tasks");
            } else {
              setLoading(false);
              setError(message);
              setOrderModalShow3(false);
            }
          });
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
      setOrderModalShow3(false);
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleDeleteKeyResults,
    handleViewTask,
    handleEditTask,
    handleDeleteTasks,
    handleCallbackEdit,
    handleBulkDelete,
    handlecallback,
    handleCallbackEditTask
  };
}
