/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./styles.scss";
import objective from "assets/svg/objective.svg";
import childIcon from "assets/svg/child.svg";
import taskPlusIcon from "assets/svg/tasks.svg";

import ProgressStatus from "./ProgressStatus";
import ArrowOrderComponent from "./ObjectivesTable/ArrowOrderComponent";
import ManagerCascadedComponent from "./ObjectivesTable/ManagerCascadedComponent";
import ObjectivesActionsComponent from "./ObjectivesTable/ObjectivesActionsComponent";
import TasksActionsComponent from "./ObjectivesTable/TasksActionsComponent";
import ApproveRejectComponent from "./ObjectivesTable/ApproveRejectComponent";
import { Link } from "react-router-dom";
import { AuthUserId, defaultProfilePic } from "utilities";
import { RatingComponent } from "./Rating";

export function Columns(stepStatus, handleEdit, setEditModal, privileges, refreshData, props, totalWeight, handleDelete, setOrderModalShow4, setMultipleObjectives, setSelectedObjective, handleDeleteKeyResults, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks, handleOpenPopup, handleAuditHistory, hideColumns, handleUpdateGoals, isEmployee, isManager, status, templateInfo) {
  const columns = [{
    dataField: "objective",
    text: templateInfo?.percentageType === 'goal' ? "GOAL" : 'OBJECTIVE',
    sort: true,
    headerClasses: "id-custom-cell",
    style: {
      width: "18.8%",
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      const openEditPopup = () => {
        let goalData = {
          ...row,
          hideColumns
        }
        handleEdit(goalData);
        setEditModal(true);
      }
      return <div >
        <img src={objective} alt="Objective" className="mr-1" style={{
          height: 15
        }} onClick={openEditPopup} />
        <a href="#" onClick={openEditPopup}>{row.objective}</a>
        {!hideColumns && <i className="fa fa-trash p-2 cursor-pointer" onClick={() => handleDelete(row._id, row)} />}
        <br />
        <small onClick={() => {
          handleEdit(row);
          setEditModal(true);
        }}>OKR Name</small>
        {row.cascaded && <ManagerCascadedComponent />}
      </div>;
    }
  }, {
    dataField: "dueDate",
    text: "DUE DATE",
    sort: true,
    style: {
      width: "9.8%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },

  },
  {
    dataField: "weight",
    text: "WEIGHT",
    sort: true,
    style: {
      width: "12%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <p> {row.weight}
        </p>
      </div>;
    }
  },
  {
    dataField: "progressStatus",
    text: "PROGRESS",
    sort: true,
    hidden: templateInfo?.percentageType === 'goal' ? true : false,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <ProgressStatus percent={row.progressStatus} row={row} readOnly={true} updatedAt={row.updatedAt} onEdit={() => {
        if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
          handleEdit(row);
          setEditModal(true);
        }
      }} />;
    }
  },
  {
    dataField: "owner",
    text: "OWNER",
    sort: true,
    hidden: hideColumns ? true : false,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <p>
          <img src={row.profilePicture ? row.profilePicture : defaultProfilePic} alt="user pic" className="userPic" />{" "}
          {row.owner}
        </p>
      </div>;
    }
  },
  {
    dataField: "progressStatus",
    text: "PROGRESS",
    sort: true,
    hidden: hideColumns ? true : false,
    style: {
      width: "12.8%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <ProgressStatus percent={row.progressStatus} updatedAt={row.updatedAt} onEdit={() => {
        if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
          handleEdit(row);
          setEditModal(true);
        }
      }} />;
    }
  },
  {
    dataField: "employeeRating",
    text: "Employee Rating",
    sort: false,
    hidden: (hideColumns && isEmployee) && stepStatus?.filter((item) => item.label === 'Submit').length > 0 ? false : true,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <RatingComponent
          isGoals={true}
          readonly={isEmployee !== AuthUserId || status !== "Submit"}
          value={row.employeeRating} name="employeeRating" onChange={(event) => {
            let goalData = {
              ...row,
              employeeRating: event.target.value
            };
            handleUpdateGoals(row._id, goalData);
          }
          } />
      </div>;
    }
  },
  {
    dataField: "managerRating",
    text: "Manager Rating",
    sort: false,
    hidden: status !== "Submit" || ((hideColumns && isManager === AuthUserId) && stepStatus.filter((item) => item.label === 'Manager Review').length == 0) ? false : true,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div className="text-left">
        <RatingComponent
          isGoals={true}
          readonly={isManager !== AuthUserId || status !== "Manager Review"}
          value={row.managerRating} name="managerRating" onChange={(event) => {
            let goalData = {
              ...row,
              managerRating: event.target.value
            }
            handleUpdateGoals(row._id, goalData);
          }
          } />
      </div>;
    }
  }
    , {
    dataField: "successMetrics",
    text: "APPROVE/REJECT",
    hidden: hideColumns ? true : false,
    sort: true,
    formatter: (cellContent, row) => {
      return <ApproveRejectComponent privileges={privileges} refreshData={() => refreshData()} row={row} companyInfo={props.companyInfo} totalWeight={totalWeight} forwardedRef3={props.forwardedRef3} />;
    }
  }, {
    dataField: "action",
    text: "ACTION",
    hidden: hideColumns ? true : false,
    formatter: (cellContent, row) => {
      return <ObjectivesActionsComponent privileges={privileges} row={row} companyInfo={props.companyInfo} handleEdit={handleEdit} setEditModal={setEditModal} handleDelete={handleDelete} setOrderModalShow4={setOrderModalShow4} setMultipleObjectives={setMultipleObjectives} setSelectedObjective={setSelectedObjective} forwardedRef2={props.forwardedRef2} refreshData={() => refreshData()} handleAuditHistory={handleAuditHistory} />;
    }
  }
  ];
  const columnsChild = [{
    dataField: "objective",
    text: templateInfo?.percentageType === 'goal' ? "GOAL" : 'OBJECTIVE',
    sort: true,
    headerClasses: "id-custom-cell",
    style: {
      width: "18.8%",
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      const handleOpenPopup2 = () => {
        handleOpenPopup({
          data: {
            ...row,
            _id: row?.objectiveId,
            keyId: row?._id,
            privileges,
            objectiveStatus: row?.objectiveStatus,
            polarity: row?.polarity ? row?.polarity : 'Positive',
          },
        })
      }
      return <div >
        <img src={objective} alt="Objective" className="mr-1" style={{
          height: 15
        }} onClick={() => handleOpenPopup2()} />
        <a href="#" onClick={() => handleOpenPopup2()}>{row.objective}</a>
        {!hideColumns && <i className="fa fa-trash p-2 cursor-pointer" onClick={() => handleDelete(row._id, row)} />}
        <br />
        <small onClick={() => {
          handleEdit(row);
          setEditModal(true);
        }}>OKR Name</small>
        {row.cascaded && <ManagerCascadedComponent />}
      </div>;
    }
  }, {
    dataField: "dueDate",
    text: "DUE DATE",
    sort: true,
    style: {
      width: "9.8%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },

  },
  {
    dataField: "weight",
    text: "WEIGHT",
    sort: true,
    style: {
      width: "12%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <p> {row.weight}
        </p>
      </div>;
    }
  },
  {
    dataField: "progressStatus",
    text: "PROGRESS",
    sort: true,
    hidden: templateInfo?.percentageType === 'goal' ? true : false,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div style={{ width: '38%' }}>
        <ProgressStatus percent={row.percent} row={row} readOnly={true} updatedAt={row.updatedAt} onEdit={() => {
          if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
            handleEdit(row);
            setEditModal(true);
          }
        }} />
      </div>;
    }
  },
  {
    dataField: "owner",
    text: "OWNER",
    sort: true,
    hidden: hideColumns ? true : false,
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <p>
          <img src={row.profilePicture ? row.profilePicture : defaultProfilePic} alt="user pic" className="userPic" />{" "}
          {row.owner}
        </p>
      </div>;
    }
  },
  {
    dataField: "progressStatus",
    text: "PROGRESS",
    sort: true,
    hidden: hideColumns ? true : false,
    style: {
      width: "130px"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div style={{ width: '140px' }}>
        <ProgressStatus percent={row.progressStatus} updatedAt={row.updatedAt} onEdit={() => {
          if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
            handleEdit(row);
            setEditModal(true);
          }
        }} />
      </div>;
    }
  },
  ];
  const columnsChildTasks = [{
    dataField: "title",
    text: "TITLE",
    sort: true,
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "19.5%",
      height: "91px"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <p className="text-left">
        <img src={taskPlusIcon} alt="Objective" className="mr-1" style={{
          height: 15
        }} />
        <a href="#">{row.title}</a>
      </p>;
    }
  }, {
    dataField: "targetDate",
    text: "TARGET DATE",
    sort: true,
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "10.4%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <p>{window.moment(row.dueDate).format("D MMM YYYY")}</p>;
    }
  }, {
    dataField: "weight",
    text: "WEIGHT",
    sort: true,
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "9%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        {
        }
      </div>;
    }
  }, {
    dataField: "owner",
    text: "OWNER",
    sort: true,
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "15%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      return <div>
        <p>
          <img src={row.profilePicture ? row.profilePicture : defaultProfilePic} alt="user pic" className="userPic" />{" "}
          {row.owner}
        </p>
      </div>;
    }
  }, {
    dataField: "successMetrics",
    text: "SUCCESS METRICS",
    sort: true,
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "29.5%"
    },
    sortCaret: (order, column) => {
      return <ArrowOrderComponent order={order} />;
    },
    formatter: (cellContent, row) => {
      let status = "";

      if (row.status === "notstarted") {
        status = "Not Started";
      } else if (row.status === "inprogress") {
        status = "In Progress";
      } else if (row.status === "completed") {
        status = "Completed";
      }

      return <p>{status}</p>;
    }
  }, {
    dataField: "action",
    text: "ACTION",
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "7.5%"
    },
    formatter: (cellContent, row) => {
      return <TasksActionsComponent privileges={privileges} row={row} handleViewTask={handleViewTask} setViewModalTask={setViewModalTask} handleEditTask={handleEditTask} setEditModalTask={setEditModalTask} handleDeleteTasks={handleDeleteTasks} />;
    }
  }, {
    dataField: "feed",
    text: "FEED",
    headerAttrs: {
      hidden: true
    },
    style: {
      width: "6%"
    },
    formatter: (cellContent, row) => {
      return (
        <Link to="/admin/tasks" className="btn btn-default">
          <i className='fa fa-external-link text-green' />
        </Link>
      )
    }
  }];
  return {
    columns,
    columnsChild,
    columnsChildTasks
  };
}
