import React from "react";
import "./styles.scss";
import TaskCard from "./taskCard";
import TaskPlus from "../../assets/svg/taskPlus.svg";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { multiStatus } from "reducer";
const ParentCard = ({
  setOrderModalShow,
  status,
  employees,
  lineColor,
  tasks,
  handlecallback,
  privileges,
  setTasks,
  forwardRef,
  showEditPopup,
  allTasks
}) => {
  let bgColor;
  const handleCallback = (childData) => {
    handlecallback(childData.reload);
  };
  const dispatch = useDispatch();
  const multiTasks = useSelector((state) => state.data.multiStatus);
  return (
    <div className="p-card mt-2">
      <div className="line col-12" style={{ background: lineColor }}></div>
      <div
        style={{
          padding: "10px",
          borderRadius: "5px",
          background: "#f6f8fc",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Droppable droppableId={`${status.toLowerCase().replace(/ /g, "")}`}>
          {(provided) => (
            <div
              className="col-12"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="row d-flex justify-content-between pt-3">
                <div className="ml-4">
                  <p className="p-title">
                    {status}
                    <span className="ml-2">({tasks.length})</span>
                  </p>
                </div>

              </div>
              {tasks &&
                tasks.map((task, index) => {
                  let priority = task.priority;
                  switch (priority) {
                    case "Low Level":
                      bgColor = "#3FC429";
                      break;
                    case "Medium Level":
                      bgColor = "#FFBF00";
                      break;
                    case "High Level":
                      bgColor = "#FA5453";
                      break;
                    default:
                      break;
                  }
                  return (
                    <div key={index} className="task-card">
                      <input className="task-checkbox" type="checkbox" value={task.id} checked={task.checked} name={task.id}
                        onChange={(e) => {
                          let checked = e.target.checked ? true : false;
                          let id = e.target.name;
                          let multinewTasks = [...multiTasks]
                          let newTaskIndex = multinewTasks.findIndex((task) => task.id === id)
                          if (newTaskIndex > -1) {
                            multinewTasks.splice(newTaskIndex, 1)
                            dispatch(multiStatus(multinewTasks));
                          } else {
                            let newTask = { ...task, checked: true };
                            multinewTasks.push(newTask);
                            dispatch(multiStatus(multinewTasks));
                          }
                          let newTasks = tasks.map((task) => {
                            if (task.id === id) {
                              task.checked = checked;
                            }
                            return task;
                          });
                          setTasks(newTasks);
                        }}
                      />
                      <TaskCard
                        styles={bgColor}
                        task={showEditPopup ? tasks.filter((task) => task.id === showEditPopup).length > 0 ? tasks.filter((task) => task.id === showEditPopup)[0] : null : task}
                        index={index}
                        handlecallback={(data) => handleCallback(data)}
                        employees={employees}
                        privileges={privileges}
                        forwardRef={forwardRef}
                        showEditPopup={showEditPopup ? true : false}
                        allTasks={allTasks}
                      />
                    </div>
                  );
                })}
              {provided.placeholder}
              {/* <TaskCard styles="#FFBF00" />
            <TaskCard styles="#FA5453" /> */}
              <div className="text-center addTask">
                {status === "Not Started" ? (
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      setOrderModalShow(true);
                    }}
                  >
                    Add task
                    <span className="ml-2">
                      <img src={TaskPlus} alt="TaskPlus" />
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default ParentCard;
