import React, { useEffect, useState } from "react";
import "./styles.scss";
import More from "../../assets/svg/More.svg";
import Message from "../../assets/svg/message.svg";
import Attachment from "../../assets/svg/attachment.svg";
import DotEllipse from "../../assets/svg/dotEllipse.svg";
import ChildPlus from "../../assets/svg/childPlus.svg";
import { updateTask, deleteTask } from "action/TasksAct";
import { useDispatch } from "react-redux";
import CommentPopup from "./commentPopup";
import { getAllCommentsByReferenceId } from "action/TasksCommentsAct";
import { Draggable } from "react-beautiful-dnd";
import TasksView from "../Objectives/TasksView";
import { updateNotificationTask } from "action/NotificationAct";
import { defaultProfilePic } from "utilities";
import EditPopupSubtask from "./EditPopupSubtask";


const TaskCard = ({ styles, task, handlecallback, index, employees, privileges = [], forwardRef, allTasks }) => {
  const [orderModalShow2, setOrderModalShow2] = useState(false);
  const [orderModalShow, setOrderModalShow] = useState(false);
  const dispatch = useDispatch();
  const [viewTaskModal, setViewModalTask] = useState(false);
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [comments2, setComments] = useState("");
  let bgColor = styles;
  const handleEdit = (id) => {
    setOrderModalShow2(true);
  };
  const handleCallback3 = (childData, callback) => {
    try {
      setLoading(true);
      let response = dispatch(updateTask(childData[1].id, childData[0]));
      response.then(({ data, message, success }) => {
        if (success) {
          let user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Update", row: { ...childData[0], employeeReferenceId: user.ownerId }, companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId
              }
            };
            let response2 = dispatch(updateNotificationTask(childData[1].id, objectiveStatus));
            response2.then(({ success, message }) => {
              if (success) {
                setOrderModalShow2(false);
                //   history.push('/admin/tasks')
                handlecallback({
                  reload: true,
                });
                setLoading(false);
                setError("");
                callback();
              }
            })
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

  const fetchComments = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllCommentsByReferenceId(task.id));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setComments(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setComments([]);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  }

  const handleDelete = (id, row) => {
    handlecallback({
      reload: true,
    });
    try {
      setLoading(true);
      let user = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
      if (user !== null) {
        const objectiveStatus = {
          objectiveStatus: "Delete", row: { ...row, employeeReferenceId: user.ownerId }, companyInfo: {
            employeeName: user.ownerName,
            employeeReferenceId: user.ownerId
          }
        };
        let response2 = dispatch(updateNotificationTask(id, objectiveStatus));
        response2.then(({ success, message }) => {
          if (success) {
            let response = dispatch(deleteTask(id));
            response.then(({ success, message }) => {
              if (success) {
                setLoading(false);
                setError("");
                handlecallback({
                  reload: true,
                });
              } else {
                setLoading(false);
                setError(message);
              }
            });
          }
        })
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCallback = (childData) => {
    setComments(childData)
  };
  const addComment = () => {
    setOrderModalShow(true);
  };
  const View = () => {
    setViewModalTask(true);
  }
  useEffect(() => {
    fetchComments()
  }, [])
  return (
    task && (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => {
          return (
            <div className="task-card mt-3" {...provided.draggableProps} {...provided.dragHandleProps} snapshot={snapshot} ref={provided.innerRef} >
              <div className="row d-flex justify-content-between align-items-center pt-2">
                <div className="ml-4">
                  <span
                    className="badg text-light pt-1 pb-1"
                    style={{ background: bgColor }}
                  >
                    {task.priority.split(" ")[0]}
                  </span>
                </div>
                <div className="mr-4 d-flex align-items-center">
                  <p className="date2 mb-0">
                    {
                      task.dueDate !== null && (
                        <>
                          Due on {window.moment(task.dueDate).format("DD MMMM YYYY").split(" ")[0] + " " + window.moment(task.dueDate).format("DD MMMM YYYY").split(" ")[1].slice(0, 3) + " " + window.moment(task.dueDate).format("DD MMMM YYYY").split(" ")[2]}
                        </>
                      )
                    }
                  </p>
                  <div className="d-flex flex-wrap" ref={index === 0 ? forwardRef : null}>
                    <div className="dropdown actionDropdown">
                      <button
                        className="dropdown-hide d-toggle ml-1"
                        type="button"
                        style={{ border: "none", backgroundColor: "white" }}
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <img src={More} alt={More} style={{ height: 15 }} />
                      </button>
                      <div
                        className="dropdown-menu text-left "
                        aria-labelledby="dropdownMenuButton"
                      >
                        {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Tasks")[0].edit && <button
                          className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                          onClick={() => handleEdit(task.id)}
                        >
                          &nbsp;Edit
                        </button>}
                        {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Tasks")[0].delete &&
                          <button
                            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                            onClick={() => handleDelete(task.id, task)}
                          >
                            &nbsp;Delete
                          </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <p className="task-title m-0" onClick={View}>{task.title}</p>
              </div>
              <div className="row d-flex justify-content-between mt-4">
                <div className="ml-4 d-flex">
                  <div onClick={addComment} className="cursor-pointer">
                    <img src={Message} alt="message" />
                    <span className="date ml-1">{comments2.length}</span>
                  </div>
                  {task.attachments !== undefined && task.attachments.length > 0 && <div className="ml-3 cursor-pointer">
                    <a href={task.attachments} target="_blank" rel="noopener noreferrer">
                      <img src={Attachment} alt="attachment" />
                    </a>
                  </div>}
                </div>
                <div className="d-flex flex-wrap mr-4">
                  <div className="dropdown actionDropdown">
                    <button
                      className="dropdown-hide d-toggle ml-3"
                      type="button"
                      style={{ border: "none", backgroundColor: "white" }}
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <div className="d-flex">
                        <div className="">
                          <img src={DotEllipse} alt="dotEllipse" />
                          <span className="plus-icon">
                            <img src={ChildPlus} alt="childPlus" />
                          </span>
                        </div>
                        <div>
                          {employees && task.assignTo.map((employee) => (
                            <img src={employees && employees.length > 0 ? employees.filter(item => item.value === employee).length > 0 ? employees.filter(item => item.value === employee)[0].profilePicture : defaultProfilePic : defaultProfilePic} alt="Avatar" title={employees && employees.length > 0 ? employees.filter(item => item.value === employee).length > 0 ? employees.filter(item => item.value === employee)[0].key : "" : ""} className="profile-pic2" />
                          ))}
                        </div>
                      </div>{" "}
                    </button>
                    <div
                      className="dropdown-menu text-left "
                      aria-labelledby="dropdownMenuButton"
                    >
                      {employees && task.assignTo.map((employee) => (
                        <li>  {employees && employees.length > 0 ? employees.filter(item => item.value === employee).length > 0 ? employees.filter(item => item.value === employee)[0].key : "" : ""} </li>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {orderModalShow2 && <EditPopupSubtask
                show={orderModalShow2}
                data={task}
                onHide={() => setOrderModalShow2(false)}
                handlecallback={handleCallback3}
                allTasks={allTasks}
              />}
              {orderModalShow && <CommentPopup
                show={orderModalShow}
                data={task}
                onHide={() => setOrderModalShow(false)}
                krReferenceId={task.id}
                handlecallback={handleCallback}
              />}
              {viewTaskModal &&
                <TasksView
                  show={viewTaskModal}
                  onHide={() => setViewModalTask(false)}
                  data={task}
                // owner={props.ownerDet}
                />
              }
            </div>
          )
        }}
      </Draggable>
    )
  );
};

export default TaskCard;
