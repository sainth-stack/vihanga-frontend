import { Options } from "./Options";
import { Handlers } from "./Handlers";
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import { useDispatch, useSelector } from "react-redux";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { LoadingIndicator } from "utilities";
import { createTask, getAuditHistory } from "action/TasksAct";
import ConfirmModal from "components/ConfirmModal";
import TasksView from "./TasksView";
import { filterData } from "./ObjectivesTable/filterData";
import { tableGenerator } from "./ObjectivesTable/transformTable";
import {
  displayOpts,
  displayOpts2,
  selectRow,
} from "./ObjectivesTable/defaultData";
import ObjectiveHeader from "./ObjectivesTable/ObjectiveHeader";
import { totalQuartersData } from "./ObjectivesTable/getMonthsData";
import {
  handleCascade,
  handleSureDelete,
} from "./ObjectivesTable/handleFunctions";
import CreateColumn from "./ObjectivesTable/CreateColumn";
import { Columns } from "./Columns";
import useWindowSize from "components/UseWindowSize";
import ObjectiveMobileTable from "./ObjectiveMobile/ObjectiveMobileTable";
import search from "assets/svg/search.svg";
import SpeechRecognition from "react-speech-recognition";
import SubTask from "./Subtask";
import EditPopupSubtask from "pages/Tasks/EditPopupSubtask";
import { updateNotificationTask } from "action/NotificationAct";
import CommentPopup from "pages/Tasks/commentPopup";
import ShowAuditHistory from "./ShowAuditHistory";
import { useGetTasks } from "pages/Objectives/hooks/useGetEmployees";
import { useQueryClient } from "@tanstack/react-query";

export default function ObjectivesTable(props) {
  const selectedTaskUser = useSelector((store) => store.user.selectedTaskUser);
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [, setError] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [, setOrderModalShow4] = useState(false);
  const [orderModalShowComment, setOrderModalShowComment] = useState(false);
  const [editTaskModal, setEditModalTask] = useState(false);
  const [subTaskModal, setSubTaskModal] = useState(false);
  const [, setSelectedObjective] = useState();
  const [viewTaskModal, setViewModalTask] = useState(false);
  const [, setMultipleObjectives] = useState(false);
  const [task, setTask] = useState(false);
  const [, selectedObjectiveId] = useState([]);
  const [auditHistory, setAuditHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [, setEditModal] = useState(false);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [searchIcon, showSearchIcon] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const {
    data: tasksResponse,
    isLoading: tasksLoading,
    error: tasksError,
  } = useGetTasks();
  const queryClient = useQueryClient();
  const onChangeText = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions };
    updatedData[name] = value;
    setDisplayOptions(updatedData);
    setError("");
  };
  const SpeechRecog = () => {
    SpeechRecognition.startListening();
    setSearchKey("");
  };

  const onChangeText2 = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions2 };
    updatedData[name] = value;
    setDisplayOptions2(updatedData);
    setError("");
  };
  const { checkboxOptions, filterOptions } = Options(
    displayOptions,
    onChangeText,
    displayOptions2,
    onChangeText2
  );

  const refreshData = (id = null) => {
    try {
      setLoading(true);
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      if (user !== null) {
        const { data, privileges, message } = tasksResponse;
        if (privileges && privileges.length > 0) {
          setPrivileges(privileges[0].privileges);
        }
        if (data !== undefined && data.length > 0) {
          let childTasks = [];
          data.forEach((item) => {
            if (item.children.length > 0) {
              item.children.forEach((child) => childTasks.push(child));
            }
            childTasks.push(item);
          });
          let updatedObjective = childTasks.filter((item) => item._id === id);
          let subTask = childTasks.filter(
            (item) => item.mainTask !== "" && item._id == id
          );
          let rewardPoints = 0;
          if (subTask.length > 0 && subTask[0].progressStatus >= 100) {
            let mainTask = subTask[0].mainTask;
            let mainTaskData = childTasks.filter(
              (item) => item._id == mainTask
            );
            if (
              mainTaskData.length > 0 &&
              mainTaskData[0].progressStatus >= 100
            ) {
              rewardPoints +=
                mainTaskData[0].rewardPoints + subTask[0].rewardPoints;
              setRewardPoints(rewardPoints);
            }
          } else if (
            updatedObjective.length > 0 &&
            updatedObjective[0].progressStatus >= 100
          ) {
            let subTasks = childTasks.filter((item) => item.mainTask == id);
            let totalRewardPoints = subTasks.reduce((prev, current) => {
              return prev + Number(current.rewardPoints);
            }, 0);
            rewardPoints +=
              totalRewardPoints + updatedObjective[0].rewardPoints;
            setRewardPoints(rewardPoints);
          }
          if (rewardPoints > 0) {
            checkCelebration();
          }

          let result = tableGenerator(data, data.length);
          setTasks(result);
          const {
            totalWeights,
            totalWeightsPercent,
            totalQ1,
            totalQ2,
            totalQ3,
            totalQ4,
          } = totalQuartersData(result, props.companyInfo);
          setTotalWeight(totalWeights);
          setData(result);
          props.handlecallback(result);
          setError("");
          props.getdatafromtable(result);
          setLoading(false);
        } else if (data.length === 0) {
          setError("No Data Found!");
          setLoading(false);
          setTasks([]);
          setData([]);
        } else {
          setError(message);
          setLoading(false);
        }
      }
    } catch (error) {
      setError(error.toString());
    }
  };
  useEffect(() => {
    refreshData();
    //eslint-disable-next-line
  }, [
    tasksResponse,
    props.refresh,
    props.refresh2,
    props.companyInfo,
    selectedTaskUser,
  ]);

  useEffect(() => {
    queryClient.invalidateQueries("tasks");
    refreshData();
  }, [editTaskModal]);

  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  };
  const handleCallbackTrans = (childData) => {
    setSearchKey(childData);
  };
  const handleCallback = () => {
    props.handleCallback2();
  };
  const addComment = (row) => {
    setOrderModalShowComment(true);
    setTask(row);
  };
  const handleAuditHistory = (id) => {
    let response2 = dispatch(getAuditHistory(id));
    response2.then(({ data, message }) => {
      if (data !== undefined && data.length > 0) {
        setAuditHistory(data);
        setShowAuditHistory(true);
        setError("");
      } else if (data.length === 0) {
        setError("No Data Found!");
      } else {
        setError(message);
      }
    });
  };
  const {
    handleEdit,
    handleDelete,
    handleDeleteKeyResults,
    handleViewTask,
    handleEditTask,
    handleSubTask,
    handleDeleteTasks,
    handleCallbackEdit,
    handleBulkDelete,
    handlecallback,
    handleCallbackEditTask,
    handleCopyTask,
  } = Handlers(
    data,
    setUpdateObj,
    setLoading,
    dispatch,
    props,
    refreshData,
    checkCelebration,
    setEditModal,
    setError,
    setEditModalTask,
    setSubTaskModal,
    setOrderModalShow3,
    selectedUsers,
    setSelectedUsers,
    setRewardPoints
  );
  const { columns, columnsChild, columnsChildTasks } = Columns(
    handleEdit,
    setEditModal,
    privileges,
    refreshData,
    props,
    totalWeight,
    handleDelete,
    setOrderModalShow4,
    setMultipleObjectives,
    setSelectedObjective,
    handleDeleteKeyResults,
    handleViewTask,
    setViewModalTask,
    handleEditTask,
    handleSubTask,
    setEditModalTask,
    setSubTaskModal,
    handleDeleteTasks,
    addComment,
    handleAuditHistory,
    handleCopyTask
  );

  const handleCallback2 = (childData, callback) => {
    try {
      setLoading(true);
      const data = {
        title: childData?.title,
        description: childData?.description,
        startDate: childData?.startDate,
        dueDate: childData?.dueDate,
        actualCompletionDate: childData?.actualCompletionDate,
        linkToKR: childData?.linkToKr,
        assignTo: childData?.assignTo,
        priority: childData?.priority,
        comments: childData.comments,
        attachments: childData.attachments,
        krReferenceId: childData.krReferenceId,
        estimationEffort: childData.estimationEffort,
        actualEffort: childData.actualEffort,
        recurrence: childData.recurrence ? childData.recurrence : false,
        recurrenceDetails: childData.recurrenceDetails
          ? childData.recurrenceDetails
          : null,
        progressStatus: childData.progressStatus,
        mainTask: childData.mainTask,
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
        userId: childData.userId,
      };
      let response = dispatch(createTask(data));
      response.then(({ data, message }) => {
        if (data !== undefined) {
          let user =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Create",
              row: { ...data, employeeReferenceId: user.ownerId },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId,
              },
            };
            let response2 = dispatch(
              updateNotificationTask(data._id, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              if (success) {
                setSubTaskModal(false);
                setLoading(false);
                refreshData(data._id);
                setError("");
                callback();
              }
            });
            queryClient.invalidateQueries("tasks");
          }
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          queryClient.invalidateQueries("tasks");
        } else {
          setLoading(false);
          setError(message);
          queryClient.invalidateQueries("tasks");
        }
      });
      response.catch((msg) => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  return (
    <>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"}
          alt="LottieConfettie"
        />
        <br />
        <h3>You have earned {rewardPoints} reward points</h3>
      </div>
      <div
        className={
          isMobile ? "mt-2 pt-0 company-form-mobile" : "shadow mt-2 pt-0"
        }
      >
        <div className="">
          {isMobile && (
            <div className="d-flex text-12 align-items-center">
              <input
                type="checkbox"
                id="selectAll"
                className="mr-1"
                checked={selectedUsers.length === data.length}
                onChange={() => {
                  selectRow(selectedUsers, setSelectedUsers, data).onSelectAll(
                    selectedUsers.length === data.length ? false : true
                  );
                }}
              />{" "}
              <label htmlFor="selectAll" className="mb-0 font-weight-bold">
                Select All
              </label>
            </div>
          )}
          <ObjectiveHeader
            SpeechRecog={SpeechRecog}
            searchKey={searchKey}
            setSearchKey={setSearchKey}
            privileges={privileges}
            handleSureDelete={() =>
              handleSureDelete(selectedUsers, setOrderModalShow3)
            }
            handleCascade={() =>
              handleCascade(
                setMultipleObjectives,
                selectedUsers,
                selectedObjectiveId,
                setOrderModalShow4
              )
            }
            checkboxOptions={checkboxOptions}
            filterOptions={filterOptions}
            onChangeText2={onChangeText2}
            showSearchIcon={showSearchIcon}
            searchIcon={searchIcon}
            handlecallback={handleCallbackTrans}
            forwardedRef={props.forwardedRef4}
          />
        </div>
        <CreateColumn
          setOrderModalShow3={(status) => props.setOrderModalShow3(status)}
          setOrderModalShow5={(status) => setSubTaskModal(status)}
          forwardedRef={props.forwardedRef}
          forwardedRef1={props.forwardedRef5}
          forwardedRef2={props.forwardedRef6}
          handlecallback={handleCallback}
        />
        {isMobile && searchIcon && (
          <div className="input-group col-lg-6 col-xs-12 col-sm-12 p-0 mt-5 nav-item search-bar">
            <div className="input-group-append searchInput-icon ">
              <img src={search} alt="search-icon" className="searchIcon" />
            </div>
            <input
              type="text"
              className="bg-light outline-none searchInput text-dark mt-0 fs14"
              placeholder="Search Task by Due date, Owner or Success Metrics"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        )}
        {loading && privileges.length === 0 ? (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        ) : data.length > 0 ? (
          isMobile ? (
            <ObjectiveMobileTable
              privileges={privileges}
              companyInfo={props.companyInfo}
              handleEdit={handleEdit}
              setEditModal={setEditModal}
              handleDelete={handleDelete}
              setOrderModalShow4={setOrderModalShow4}
              setMultipleObjectives={setMultipleObjectives}
              setSelectedObjective={setSelectedObjective}
              selectedUsers={selectedUsers}
              setSelectedUsers={(row) =>
                selectRow(selectedUsers, setSelectedUsers, data).onSelect(row)
              }
              handleDeleteKeyResults={handleDeleteKeyResults}
              handleViewTask={handleViewTask}
              setViewModalTask={setViewModalTask}
              handleEditTask={handleEditTask}
              handleSubTask={handleSubTask}
              setEditModalTask={setEditModalTask}
              handleDeleteTasks={handleDeleteTasks}
              refreshData={refreshData}
              totalWeight={totalWeight}
              title="objectives"
              data={filterData(data, displayOptions2, searchKey)}
              columns={columns.filter((item) => {
                let filteredNames = checkboxOptions
                  .filter((checkbox) => checkbox.value)
                  .map((check) => check.name);
                filteredNames.push("action");
                filteredNames.push("feed");
                return filteredNames.includes(item.dataField);
              })}
              paginationFactory={paginationFactory}
              searchKey={searchKey}
              selectRow={selectRow(selectedUsers, setSelectedUsers, data)}
              data2={data2}
              childData={{
                data,
                columnsChild,
                columnsChildTasks,
                searchKey,
                checkboxOptions,
              }}
            />
          ) : (
            <Table
              title="objectives"
              data={filterData(data, displayOptions2, searchKey)}
              columns={columns.filter((item) => {
                let filteredNames = checkboxOptions
                  .filter((checkbox) => checkbox.value)
                  .map((check) => check.name);
                filteredNames.push("action");
                filteredNames.push("feed");
                return filteredNames.includes(item.dataField);
              })}
              paginationFactory={paginationFactory}
              searchKey={searchKey}
              selectRow={selectRow(selectedUsers, setSelectedUsers, data)}
              data2={data2}
              childData={{
                data,
                columnsChild,
                columnsChildTasks,
                searchKey,
                checkboxOptions,
              }}
            />
          )
        ) : (
          <div className="text-center">
            <h5 className="mb-4 mt-4 pb-4 text-danger">No Tasks Found</h5>
          </div>
        )}
      </div>
      {showAuditHistory && (
        <ShowAuditHistory
          data={auditHistory}
          show={showAuditHistory}
          onHide={() => setShowAuditHistory(false)}
        />
      )}
      {orderModalShowComment && (
        <CommentPopup
          show={orderModalShowComment}
          data={task}
          onHide={() => setOrderModalShowComment(false)}
          krReferenceId={task._id}
          handlecallback={(comments) => {
            refreshData();
          }}
        />
      )}
      {subTaskModal && (
        <SubTask
          show={subTaskModal}
          onHide={() => {
            setSubTaskModal(false);
          }}
          handlecallback={(data, callback) => handleCallback2(data, callback)}
          tasks={tasks}
          data={updateObj}
          loading={loading}
        />
      )}
      {orderModalShow3 && (
        <ConfirmModal
          show={orderModalShow3}
          onHide={() => setOrderModalShow3(false)}
          onProceed={() => handleBulkDelete()}
        />
      )}
      {editTaskModal && (
        <EditPopupSubtask
          show={editTaskModal}
          onHide={() => setEditModalTask(false)}
          data={updateObj}
          handlecallback={(status, callback) => {
            handleCallbackEditTask(status, callback);
            refreshData();
          }}
        />
      )}
      {viewTaskModal && (
        <TasksView
          show={viewTaskModal}
          onHide={() => setViewModalTask(false)}
          data={updateObj}
          tasks={tasks.map((item) => {
            return {
              key: item.title,
              value: item._id,
            };
          })}
          owner={props.ownerDet}
        />
      )}
    </>
  );
}
