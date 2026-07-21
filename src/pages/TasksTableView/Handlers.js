/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styles.scss";
import {
  deleteObjectives,
  updateObjective,
} from "action/UserAct";
import {
  deletekeyResult,
  updatekeyResults,
} from "action/keyResultAct";
import { deleteTask, deleteTasks, copyTask } from "action/TasksAct";
import { updateTask } from "action/TasksAct";
import { updateNotification, updateNotificationTask } from "action/NotificationAct";
import { useQueryClient } from "@tanstack/react-query";

export function Handlers(data, setUpdateObj, setLoading, dispatch, props, refreshData, checkCelebration, setEditModal, setError, setEditModalTask, setSubTaskModal, setOrderModalShow3, selectedUsers, setSelectedUsers, setRewardPoints) {
  const queryClient = useQueryClient();
  const handleEdit = (cellContent, field) => {
    const updateOb = {
      id: cellContent._id,
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
    };
    setUpdateObj(updateOb); // setShowInputBox(!showInputBox);
  };

  const handleEditTask = (cellContent, field) => {
    const updateOb = {
      id: cellContent._id,
      _id: cellContent._id,
      title: cellContent.title,
      krReferenceId: cellContent.krReferenceId,
      estimationEffort: cellContent.estimationEffort,
      mainTask: cellContent.mainTask,
      assignTo: cellContent.assignTo,
      actualEffort: cellContent.actualEffort,
      linkToKR: cellContent.linkToKR,
      priority: cellContent.priority,
      targetDate: cellContent.targetDate,
      dueDate: cellContent.dueDate,
      startDate: cellContent.startDate,
      actualCompletionDate: cellContent.actualCompletionDate,
      description: cellContent.description,
      status: cellContent.status,
      progressStatus: cellContent.progressStatus,
      taskPercentage: cellContent.taskPercentage,
      attachments: cellContent.attachments
    };
    setUpdateObj(updateOb);
  };

  const handleSubTask = (cellContent, filed) => {
    const updateObj = {
      ...cellContent,
      mainTask: cellContent.mainTask,
    }
    setUpdateObj(updateObj);
  }

  const handleViewTask = (cellContent, field) => {
    const updateOb = {
      id: cellContent._id,
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
      krReferenceId: cellContent.krReferenceId,
      mainTask: cellContent.mainTask,
      ...cellContent
    };
    setUpdateObj(updateOb);
  };

  const handleCallbackEdit = childData => {
    setLoading(true);
    let finalDet = {
      ...childData
    };
    let response = dispatch(updateObjective(childData._id, finalDet));
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
        if (childData.children.length > 0) {
          let updatedPercentsData = childData.children.map(item => {
            let actual = parseFloat(item.polarity === "Positive" ? (item.target * (childData.progressStatus / 100)) : ((item.target) / (childData.progressStatus / 100))).toFixed(2);
            let percent = childData.progressStatus;
            let obj = {
              ...item
            };
            obj.actual = +actual;
            obj.percent = percent;
            return obj;
          });
          let updatedPercents = updatedPercentsData.map(item => {
            return {
              _id: item._id,
              actual: item.actual,
              target: item.target,
              polarity: item.polarity,
              percent: item.percent
            };
          });
          let response2 = dispatch(updatekeyResults({
            data: updatedPercents
          }));
          response2.then(({
            success,
            message
          }) => {
            if (success) {
              const objectiveStatus = {
                objectiveStatus: "Update",
                row: childData,
                companyInfo: props.companyInfo
              };
              let response3 = dispatch(updateNotification(childData._id, objectiveStatus));
              response3.then(({
                success,
                message
              }) => {
                if (success) {
                  setLoading(false);
                  refreshData(childData._id);
                  setEditModal(false);
                  setError("");
                } else {
                  setLoading(false);
                  setError(message);
                }
              });
            } else {
              setLoading(false);
              setError(message);
            }
          });
        } else {
          const objectiveStatus = {
            objectiveStatus: "Update",
            row: childData,
            companyInfo: props.companyInfo
          };
          let response3 = dispatch(updateNotification(childData._id, objectiveStatus));
          response3.then(({
            success,
            message
          }) => {
            if (success) {
              setLoading(false);
              refreshData();
              setEditModal(false);
              setError("");
            } else {
              setLoading(false);
              setError(message);
            }
          });
        }
      } else {
        setLoading(false);
        //setError(message);
      }
    }).catch(e => {
      setLoading(false);
      refreshData();
      setEditModal(false);
    });
  };

  const handleCallbackEditTask = (childData, callback) => {
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
            callback();
            let response2 = dispatch(updateNotificationTask(childData[1].id, objectiveStatus));
            response2.then(({
              success,
              message
            }) => {
              if (success) {
                setEditModalTask(false);
                refreshData(childData[1].id);
                setLoading(false);
                setError("");
                queryClient.invalidateQueries("tasks");
                callback();
              }
            });
          }
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          queryClient.invalidateQueries("tasks");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
      queryClient.invalidateQueries("tasks");
    }
  };

  const handleDelete = (id, row) => {
    try {
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row,
        companyInfo: props.companyInfo
      };
      let response2 = dispatch(updateNotification(id, objectiveStatus));
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
      let response = dispatch(deletekeyResult(id));
      response.then(({
        success,
        message
      }) => {
        if (success) {
          refreshData();
          setError("");
        } else {
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
                refreshData();
                setError("");
                queryClient.invalidateQueries("tasks");
              } else {
                setError(message);
                queryClient.invalidateQueries("tasks");
              }
            });
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
      queryClient.invalidateQueries("tasks");
    }
  };

  const handlecallback = childData => {
    if (childData.refreshData) {
      refreshData();
      queryClient.invalidateQueries("tasks");
    }
  };

  const handleBulkDelete = () => {
    try {
      setLoading(true);
      let user =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row: { ...selectedUsers[0], employeeReferenceId: user.ownerId },
        companyInfo: props.companyInfo
      };
      let response2 = dispatch(updateNotificationTask(selectedUsers[0]._id, objectiveStatus));
      response2.then(({
        success,
        message
      }) => {
        if (success) {
          let response = dispatch(deleteTasks({
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
              queryClient.invalidateQueries("tasks");
            } else {
              setLoading(false);
              setError(message);
              setOrderModalShow3(false);
              queryClient.invalidateQueries("tasks");
            }
          });
        } else {
          setError(message);
          queryClient.invalidateQueries("tasks");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
      setOrderModalShow3(false);
      queryClient.invalidateQueries("tasks");
    }
  };

  const handleCopyTask = (id, row) => {
    try {
      setLoading(true);
      let response = dispatch(copyTask(id));
      response.then(({
        success,
        message,
        data
      }) => {
        if (success) {
          let user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;

          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Create",
              row: {
                ...data,
                employeeReferenceId: user.ownerId
              },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId
              }
            };
            let response2 = dispatch(updateNotificationTask(data._id, objectiveStatus));
            response2.then(({
              success,
              message
            }) => {
              if (success) {
                setLoading(false);
                refreshData(data._id);
                setError("");
                queryClient.invalidateQueries("tasks");
              } else {
                setLoading(false);
                setError(message);
                queryClient.invalidateQueries("tasks");
              }
            });
          }
        } else {
          setLoading(false);
          setError(message);
          queryClient.invalidateQueries("tasks");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
      queryClient.invalidateQueries("tasks");
    }
  };

  return {
    handleEdit,
    handleDelete,
    handleDeleteKeyResults,
    handleViewTask,
    handleSubTask,
    handleEditTask,
    handleDeleteTasks,
    handleCallbackEdit,
    handleBulkDelete,
    handlecallback,
    handleCallbackEditTask,
    handleCopyTask
  };
}
