import { tableGenerator } from "./tableGenerator";
import { handleEditViewTask } from "./handlers";
import columnsKr from "./Columns/columnsKr";
import columnsTasks from "./Columns/columnsTasks";
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
import React from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import { useState, useEffect } from "react";
import download from "assets/svg/download.svg";
import cascadeIcon from "assets/svg/cascadeIcon.svg";
import { Col, Row } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import CheckboxInput from "components/Company/CheckboxInput";
import Button from "components/Company/Button";
import { useLocation } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getAuditHistory,
  getTasks,
  updateTask,
} from "action/TasksAct";
import CommentPopup from "./CommentsPopup";
import EditCommentPopup from "./EditComment";
import plusIcon from "assets/svg/plus.svg";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import {
  getKeyResults,
  createkeyResult,
  deletekeyResult,
  updatekeyResult,
  updatekeyResultCascaded,
} from "../../../action/keyResultAct";
import { useDispatch } from "react-redux";
import paginationFactory from "react-bootstrap-table2-paginator";

import {
  AuthUserId,
  Frequencies,
  LoadingIndicator,
  Polarities,
  UOMs,
  Validator,
} from "utilities";

import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import { Toast } from "service/toast";
import CascadedPopup from "./CascadedPopup";
import Table from "components/Table";
import TasksEditPopup from "../TasksEditPopup";
import TasksView from "../TasksView";
import {
  updateNotificationKR,
  updateNotificationTask,
} from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import KeyResultsMobileTable from "./OKRMobile/KeyResultMobileTable";
import { useHistory } from "react-router-dom";
import SubTask from "pages/Tasks/Subtask";
import PredictionChart from "./PredictionChart";
import ShowAuditHistory from "pages/TasksTableView/ShowAuditHistory";
import { useQueryClient } from "@tanstack/react-query";
import { Options } from "pages/TasksTableView/Options";
import {
  displayOpts,
  displayOpts2,
} from "pages/TasksTableView/ObjectivesTable/defaultData";
import RewardPointsComponent from "components/RewardPoints";
import ViewCommentPopup from "./CommentsViewPopup";
import { useTranslation } from "react-i18next";
import { getKPIs } from "service/integrationapis";
import { getKPIById, querySalesforce, updateKPI } from 'service/integrationapis'; // Assuming this is your API function
import { useQuery, useMutation } from '@tanstack/react-query';

export default function OkrDetails(props) {
  const history = useHistory();
  const location = useLocation();
  const okrdetails = props.state ? props.state : location.state.data;
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const getActaul = (okrdetails) => {
    if (okrdetails.actual || okrdetails.actual == 0) {
      return okrdetails.actual;
    } else return null;
  };
  const emptyData = {
    dimension: okrdetails.dimension ? okrdetails.dimension : "",
    keyResultName: okrdetails.keyResultName ? okrdetails.keyResultName : "",
    target: okrdetails.target ? okrdetails.target : "",
    actual: getActaul(okrdetails),
    basevalue: okrdetails.basevalue ? okrdetails.basevalue : 0,
    status: okrdetails.status ? okrdetails.status : "",
    frequency: okrdetails.frequency ? okrdetails.frequency : undefined,
    uom: okrdetails.uom ? okrdetails.uom : "",
    polarity: okrdetails.polarity ? okrdetails.polarity : "Positive",
    msc: okrdetails.msc ? okrdetails.msc : "",
    targetDate: okrdetails.targetDate ? okrdetails.targetDate : null,
    actualDate: okrdetails.actualDate ? okrdetails.actualDate : null,
    okrName: okrdetails.objective,
    feedAttachment: okrdetails.feedAttachment ? okrdetails.feedAttachment : "",
    objectiveStatus: okrdetails.objectiveStatus
      ? okrdetails.objectiveStatus
      : "",
    userId: AuthUserId,
    percent: okrdetails.percent ? okrdetails.percent : 0,
    createdAt: okrdetails.createdAt ? okrdetails.createdAt : 0,
    updatedAt: okrdetails.updatedAt ? okrdetails.updatedAt : 0,
    keyId: okrdetails.keyId ? okrdetails.keyId : "",
  };
  const [comment, setComment] = useState({});
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [orderModalShow2, setOrderModalShow2] = useState(false);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [orderModalShow4, setOrderModalShow4] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(false);
  const [selectedKR, setSelectedKR] = useState("");
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [addNewKr, setAddNewKr] = useState(true);
  const [updateData, setUpdateData] = useState(emptyData);
  const [, setCreatedData] = useState({});
  const [updateRowId, setUpdateRowId] = useState("");
  const [, setClearSelectInputs] = useState(false);
  const [, forceUpdate] = useState(false);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const validator = Validator();
  const [isAlignedToCompany, setIsAlignedToCompany] = useState(false);
  const [updateCheckBox, setUpdateCheckBox] = useState(false);
  const [showAttachment, setShowAttachment] = useState(true);
  const [krReferenceId, setKRReferenceId] = useState("");
  const [employeeReferenceId, setemployeeReferenceId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [keyResultsText, setKeyResultsText] = useState({});
  const [updateObj, setUpdateObj] = useState({});
  const [editTaskModal, setEditModalTask] = useState(false);
  const [viewTaskModal, setViewModalTask] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [krForm, setKrForm] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const queryClient = useQueryClient();
  const [selectedKpi, setSelectedKpi] = useState({});
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [modelCommentView, setModelHanldeView] = useState(false);
  const onChangeText = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions };
    updatedData[name] = value;
    setDisplayOptions(updatedData);
    setError("");
  };
  const onChangeText2 = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions2 };
    updatedData[name] = value;
    setDisplayOptions2(updatedData);
    setError("");
  };
  useEffect(() => {
    setPrivileges(okrdetails?.privileges || props?.state?.privileges);
  }, [props.state, okrdetails]);
  const handleDeleteTasks = (id, row) => {
    try {
      let user =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      if (user !== null) {
        const objectiveStatus = {
          objectiveStatus: "Delete",
          row: { ...row, employeeReferenceId: user.ownerId },
          companyInfo: {
            employeeName: user.ownerName,
            employeeReferenceId: user.ownerId,
          },
        };
        let response2 = dispatch(updateNotificationTask(id, objectiveStatus));
        response2.then(({ success, message }) => {
          if (success) {
            let response = dispatch(deleteTask(id));
            response.then(({ success, message }) => {
              if (success) {
                fetchKeyResults();
                setError("");
                queryClient.invalidateQueries("keyresults", "tasks");
              } else {
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
  const handleCallbackEditTask = (childData) => {
    try {
      setLoading(true);
      let response = dispatch(updateTask(childData[1].id, childData[0]));
      response.then(({ data, message, success }) => {
        if (success) {
          let user =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Update",
              row: { ...childData[0], employeeReferenceId: user.ownerId },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId,
              },
            };

            let response2 = dispatch(
              updateNotificationTask(childData[1].id, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              if (success) {
                setEditModalTask(false);
                setLoading(false);
                setError("");
                fetchKeyResults();
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
  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    },
  };
  const addNewKrfunction = () => {
    setAddNewKr(true);
    setShowAttachment(true);
    setKeyResultsText({});
  };
  const fetchKeyResults = () => {
    try {
      setLoading(true);
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          let filteredData = result.filter(
            (item) => item.objectiveId === okrdetails.objectiveId
          );

          setData(filteredData);
          setLoading(false);
          setError("");
          if (okrdetails.viewkr) {
            window.scrollTo(0, 1050);
          } else {
            window.scrollTo(0, 100);
          }
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
          window.scrollTo(0, 100);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const getTask = () => {
    try {
      setLoading(true);
      let response = dispatch(getTasks());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((task) => {
            return {
              priority: task.priority,
              dueDate: task.dueDate,
              title: task.title,
              linkToKR: task.linkToKR,
              attachments: task.attachments,
              comments: task.comments,
              actualCompletionDate: task.actualCompletionDate,
              assignTo: task.assignTo,
              description: task.description,
              krReferenceId: task.krReferenceId,
              startDate: task.startDate,
              id: task._id,
              status: task.status,
              estimationEffort: task.estimationEffort,
              actualEffort: task.actualEffort,
              recurrence: task.recurrence ? task.recurrence : false,
              recurrenceDetails: task.recurrenceDetails
                ? task.recurrenceDetails
                : null,
            };
          });
          setTasks(updatedData);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          setTasks([]);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchKeyResults();
    getTask();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (okrdetails.keyResultName !== undefined) {
      handleEditData();
    } else {
      window.scrollTo(0, 100);
    }
    //eslint-disable-next-line
  }, [okrdetails]);
  const handleAddTask = (row) => {
    setOrderModalShow(true);
    setSelectedKR(row._id);
  };
  const filterData = (data) => {
    return data.filter((item) => {
      return (
        item.keyResultName
          .toLowerCase()
          .indexOf(searchKey || frequency.toLowerCase()) !== -1 ||
        item.frequency
          .toLowerCase()
          .indexOf(searchKey || frequency.toLowerCase()) !== -1
      );
    });
  };
  const handleChangeSearch = ({ target: { name, value } }) => {
    if (name === 'kpi') {
      const kpiObject = listOfKpis?.data?.find(kpi => kpi._id === value);
      testQueryMutation.mutate(kpiObject?.query, {
        onSuccess: (data) => {
          const count = data.data?.totalSize || 0;

          if (update) {
            setUpdateData(prev => ({
              ...prev,
              keyResultName: kpiObject?.name,
              actual: count
            }));
          } else {
            setKeyResultsText(prev => ({
              ...prev,
              keyResultName: kpiObject?.name,
              actual: count
            }));
          }
        },
        onError: (error) => {
          console.error('Query failed:', error);
          Toast({ message: 'Failed to fetch KPI count', type: 'error' });
        }
      });

    }
    if (update) {
      let updatedData1 = { ...updateData };
      updatedData1[name] = value;
      setUpdateData(updatedData1);
      setError("");
    } else {
      let updatedData = { ...keyResultsText };
      updatedData[name] = value;
      setKeyResultsText(updatedData);
      setError("");
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      // Function to execute every 5 seconds
      setButtonLoading(false);
    }, 10000);
  }, [buttonLoading]);
  const handleComments = (row) => {
    setOrderModalShow3(true);
    setKRReferenceId(row._id || row.keyId);
    setemployeeReferenceId(okrdetails.employeeReferenceId);
    setEmployeeName(okrdetails.employeeName);
  };
  const handleOpenViewComments = (row) => {
    setModelHanldeView(true);
    setKRReferenceId(row._id || row.keyId);
    setemployeeReferenceId(okrdetails.employeeReferenceId);
    setEmployeeName(okrdetails.employeeName);
  };
  const handlenavigate = () => {
    history.push("/admin/Objectives");
  };
  const clearAll = () => {
    setClearSelectInputs(true);
    setKeyResultsText({
      ...emptyData,
      targetDate: null,
      actualDate: null,
    });
    setUpdateData({
      targetDate: null,
      actualDate: null,
    });
    setIsAlignedToCompany(false);
    setUpdateCheckBox(false);
    setIsEdit(false);
    setAddNewKr(false);
  };
  const handleChangeCheckBox = () => {
    if (update) {
      setUpdateCheckBox(!updateCheckBox);
    } else {
      setIsAlignedToCompany(!isAlignedToCompany);
    }
  };

  const handleUpdate = () => {
    if (validator.current.allValid()) {
      try {
        if (update) {
          setLoading(true);
          const finalCheckBox = {
            isAlignedToCompany: updateCheckBox ? "Yes" : "No",
          };
          const finalData = {
            ...updateData,
            ...finalCheckBox,
            companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
          };
          let response = dispatch(updatekeyResult(updateRowId, finalData));
          response.then(({ success, message, data }) => {
            Toast({ message: 'Key result updated successfully', type: 'success' });
            const responseCascaded = dispatch(
              updatekeyResultCascaded(updateRowId, finalData)
            );
            setIsEdit(false);
            if (success) {
              if (data.rewardPoints > 0) {
                setRewardPoints(data.rewardPoints);
                setApprovalRequired(data.approvalRequired);
                checkCelebration();
              }
              let employeeReferenceId =
                localStorage.getItem("userData") !== null
                  ? JSON.parse(localStorage.getItem("userData")).ownerId
                  : null;
              const objectiveStatus = {
                objectiveStatus: "Update",
                row: {
                  ...finalData,
                  employeeReferenceId: okrdetails.employeeReferenceId
                    ? okrdetails.employeeReferenceId
                    : employeeReferenceId,
                },
                companyInfo: {
                  ...okrdetails,
                  employeeReferenceId: okrdetails.employeeReferenceId
                    ? okrdetails.employeeReferenceId
                    : employeeReferenceId,
                },
              };
              if (props.refresher) {
                props.refresher();
              }
              let response2 = dispatch(
                updateNotificationKR(updateRowId, objectiveStatus)
              );
              response2.then(({ success, message }) => {
                setIsEdit(false);
                if (success) {
                  setKeyResultsText(emptyData);
                  setLoading(false);
                  setError("");
                  clearAll();
                  fetchKeyResults();
                  queryClient.invalidateQueries("keyresults", "tasks");
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
        }
      } catch (error) {
        setLoading(false);
        setError(error.toString());
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const handleSave = () => {
    if (validator.current.allValid()) {
      try {
        // Find the selected KPI details
        const kpiObject = listOfKpis?.data?.find(kpi => kpi._id === keyResultsText.kpi);

        var finalData = {
          okrName: okrdetails.objective,
          dimension: keyResultsText.dimension,
          isAlignedToCompany: isAlignedToCompany ? "Yes" : "No",
          keyResultName: keyResultsText.keyResultName,
          frequency: keyResultsText.frequency,
          uom: keyResultsText.uom,
          polarity: keyResultsText.polarity,
          msc: keyResultsText.msc,
          targetDate: keyResultsText.targetDate,
          actualDate: keyResultsText.actualDate,
          target: keyResultsText.target,
          actual: keyResultsText.actual || null,
          basevalue: keyResultsText.basevalue,
          feedAttachment: keyResultsText.feedAttachment,
          objectiveId: okrdetails.objectiveId,
          userId: AuthUserId,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null,
          // Add KPI related fields
          source: keyResultsText.source,
          kpiId: keyResultsText.kpi,
          query: kpiObject?.query || null,
          kpiName: kpiObject?.name || null,
        };
        var finalData2 = { ...finalData, ...comment };
        let response = dispatch(createkeyResult(finalData2));
        setButtonLoading(true);
        response.then(({ success, message, data }) => {
          setLoading(true);
          setButtonLoading(false);
          if (success) {
            if (data.rewardPoints > 0) {
              setRewardPoints(data.rewardPoints);
              setApprovalRequired(data.approvalRequired);
              checkCelebration();
            }
            const objectiveStatus = {
              objectiveStatus: "Create",
              row: {
                ...finalData2,
                employeeReferenceId: okrdetails.employeeReferenceId
                  ? okrdetails.employeeReferenceId
                  : employeeReferenceId,
              },
              companyInfo: {
                ...okrdetails,
                employeeReferenceId: okrdetails.employeeReferenceId
                  ? okrdetails.employeeReferenceId
                  : employeeReferenceId,
              },
            };
            let response2 = dispatch(
              updateNotificationKR(data._id, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              setLoading(true);
              if (success) {
                setKeyResultsText(emptyData);
                setCreatedData(response);
                fetchKeyResults();
                setLoading(false);
                setError("");
                clearAll();
                queryClient.invalidateQueries("keyresults", "tasks");
              } else {
                setLoading(false);
                setError(message);
              }
            });
          } else {
            setLoading(false);
            setButtonLoading(false);
            setError(message);
          }
        });
      } catch (error) {
        setLoading(false);
        setButtonLoading(false);
        setError(error.toString());
      }
    } else {
      validator.current.showMessages();
      setButtonLoading(false);
      forceUpdate(true);
    }
  };
  const handleDelete = (id, row) => {
    try {
      let user =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row: {
          ...row,
          employeeReferenceId: user.ownerId,
        },
        companyInfo: {
          ...okrdetails,
          employeeReferenceId: user.ownerId,
        },
      };
      let response2 = dispatch(updateNotificationKR(id, objectiveStatus));
      response2.then(({ success, message }) => {
        if (success) {
          let response = dispatch(deletekeyResult(id));
          response.then(({ success, message }) => {
            if (success) {
              fetchKeyResults();
              setError("");
              queryClient.invalidateQueries("keyresults", "tasks");
            } else {
              setError(message);
            }
          });
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCascade = () => {
    setOrderModalShow4(true);
  };
  const handleEditData = () => {
    setUpdateCheckBox(
      okrdetails.isAlignedToCompany ? okrdetails.isAlignedToCompany : false
    );
    setUpdate(true);
    setIsEdit(false);
    setTimeout(() => {
      setIsEdit(true);
    }, 500);
    const data = {
      dimension: okrdetails.dimension || "",
      okrName: okrdetails.objective || "",
      keyResultName: okrdetails.keyResultName || "",
      frequency: okrdetails.frequency || "",
      uom: okrdetails.uom || "",
      polarity: okrdetails.polarity || "Positive",
      msc: okrdetails.msc || "",
      targetDate:
        window.moment(okrdetails.targetDate).format("YYYY-MM-DD") || null,
      actualDate: okrdetails.actualDate
        ? window.moment(okrdetails.actualDate).format("YYYY-MM-DD")
        : null,
      target: okrdetails.target || "",
      actual:
        okrdetails.actual || okrdetails.actual === 0 ? okrdetails.actual : null,
      basevalue: okrdetails.basevalue || 0,
      feedAttachment: okrdetails.feedAttachment || "",
      objectiveId: okrdetails.objectiveId || "",
      weight: okrdetails.weight || "",
      objectiveStatus: okrdetails.objectiveStatus || "",
      userId: AuthUserId,
      percent: okrdetails.percent || 0,
      createdAt: okrdetails.createdAt || "",
      updatedAt: okrdetails.updatedAt || "",
      keyId: okrdetails.keyId || "",
      _id: okrdetails.keyId || "",
    };
    setUpdateRowId(okrdetails.keyId);
    setUpdateData(data);
    setAddNewKr(true);
  };
  const handleEdit = (row) => {
    setUpdateCheckBox(row.isAlignedToCompany);
    setUpdate(true);
    setIsEdit(false);
    setTimeout(() => {
      setIsEdit(true);
    }, 500);
    const data = {
      dimension: row?.dimension || "",
      okrName: row?.okrName || "",
      keyResultName: row?.keyResultName || "",
      frequency: row?.frequency || "",
      uom: row.uom || "",
      polarity: row.polarity || "Positive",
      msc: row.msc || "",
      targetDate: window.moment(row.targetDate).format("YYYY-MM-DD") || null,
      actualDate: row.actualDate
        ? window.moment(row.actualDate).format("YYYY-MM-DD")
        : null,
      target: row.target || "",
      actual: row?.actual || row.actual == 0 ? row?.actual : null,
      basevalue: row?.basevalue || 0,
      feedAttachment: row.feedAttachment || "",
      objectiveId: okrdetails.objectiveId || "",
      weight: okrdetails.weight || "",
      objectiveStatus: okrdetails.objectiveStatus,
      _id: row._id || "",
      userId: AuthUserId,
      percent: row.progress || 0,
      createdAt: row.createdAt || "",
      updatedAt: row.updatedAt || "",
      keyId: row._id || "",
    };
    setUpdateRowId(row._id);
    setUpdateData(data);
    setAddNewKr(true);
    setKeyResultsText({});
    setShowAttachment(
      row.feedAttachment && row.feedAttachment.length > 0 ? false : true
    );
    window.scrollTo(0, 100);
    handleScroll();
  };
  const handleCallback2 = (childData, callback) => {
    try {
      setLoading(true);
      const data = {
        title: childData.title,
        description: childData.description,
        startDate: childData.startDate,
        dueDate: childData.dueDate,
        actualCompletionDate: childData.actualCompletionDate,
        linkToKR: childData.linkToKr,
        assignTo: childData.assignTo,
        priority: childData.priority,
        comments: childData.comments,
        attachments: childData.attachments,
        krReferenceId: childData.krReferenceId,
        owner: childData.owner,
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
          const objectiveStatus = {
            objectiveStatus: "Create",
            row: { ...data, employeeReferenceId: user.ownerId },
            companyInfo: {
              employeeReferenceId: user.ownerId,
              ...okrdetails,
            },
          };
          let response2 = dispatch(
            updateNotificationTask(data._id, objectiveStatus)
          );
          response2.then(({ success, message }) => {
            if (success) {
              setOrderModalShow(false);
              setLoading(false);
              setError("");
              fetchKeyResults();
              queryClient.invalidateQueries("keyresults", "tasks");
              if (typeof callback === "function") {
                callback(); // Ensure callback is called only if it's a function
              }
            }
          });
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCallback3 = (childData) => {
    setComment(childData);
    setOrderModalShow2(false);
  };
  const handleScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 100);
    }, 1000);
  };
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
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
        Toast({ message: "No Data Found!", type: "warning" });
      } else {
        setError(message);
      }
    });
  };

  const { checkboxOptions } = Options(
    displayOptions,
    onChangeText,
    displayOptions2,
    onChangeText2
  );

  const { t } = useTranslation();
  const [kpis, setKpis] = useState([]);

  const { data: listOfKpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => getKPIs(true),
  })


  // Mutation for testing query
  const testQueryMutation = useMutation({
    mutationFn: (query) => querySalesforce({ query }),
    onSuccess: (data) => {
      console.log("data", data);
      if (data.data.length > 0 && data.data[0].message === "INVALID_JWT_FORMAT") {
        Toast({ message: 'Your Salesforce session has expired. Please sign in again.', type: 'error' });
        localStorage.removeItem('sf_access_token');
        localStorage.removeItem('sf_refresh_token');
        localStorage.removeItem('salesforce_user');
        history.push('/admin/previlages/integrationManagement/salesforce/setup');
      }
    },
    onError: (error) => {
      // Handle error (show error message)
      console.error('Query test failed:', error);
    }
  });
  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"}
          alt="LottieConfettie"
        />
        <br />
        <RewardPointsComponent
          rewardPoints={rewardPoints}
          approvalRequired={approvalRequired}
        />
      </div>
      <TitleHeader name={t("OKR Details.Employee Portal OKR")} />
      <div
        className={
          isMobile ? "p-3 m-2" : "bg-light-primary rounded mh-100 p-4 m-4"
        }
      >
        <div
          className={isMobile ? "col-12 company-form-mobile" : "company-form"}
        >
          <div className={isMobile ? "pt-3 header" : "header"}>
            <div>
              <p className="text-header">{t("OKR Details.OKR Details")}</p>
            </div>
            <div className="d-flex">
              {(okrdetails.objectiveStatus === "Unlock" ||
                okrdetails.objectiveStatus === "Reject" ||
                okrdetails.objectiveStatus === "Create" ||
                okrdetails.objectiveStatus === "Update") &&
                privileges &&
                privileges.length > 0 &&
                privileges.filter(
                  (privilege) => privilege.page === "Cascade Objectives"
                ).length > 0 &&
                privileges.filter(
                  (privilege) => privilege.page === "Cascade Objectives"
                )[0].view && (
                  <div
                    className={isMobile ? "" : "cascade"}
                    style={{ cursor: "pointer" }}
                    onClick={handleCascade}
                  >
                    {isMobile ? (
                      <img
                        src={cascadeIcon}
                        alt="cascade icon"
                        style={{ height: 40 }}
                      />
                    ) : (
                      "Cascade"
                    )}
                  </div>
                )}
              <div className="ml-2">
                <img src={download} alt="downloadd" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className={isMobile ? "col-10" : "col-6"}>
              <div className={isMobile ? "d-flex" : "row"}>
                <div className={`col-md-4 ml-0 ${isMobile ? "m-0 p-0" : ""}`}>
                  <p className="fs-14">{t("OKR Details.OKR Name")}</p>
                </div>
                <div
                  className={`col-md-7 okr-name ml-2 ${isMobile ? "m-0 p-0" : ""
                    }`}
                >
                  {okrdetails.objective}
                </div>
              </div>
            </div>
            {updateData && isEdit && !loading && (
              <div className={isMobile ? "col-12" : "col-5"}>
                <PredictionChart
                  krId={updateData ? updateData.keyId : ""}
                  okrdetails={updateData}
                />
              </div>
            )}
          </div>
          <div className="header mt-3">
            <div>
              <CheckboxInput
                label={t("OKR Details.Aligned To Company Objective")}
                name="alignedObjective"
                value={updateCheckBox ? updateCheckBox : isAlignedToCompany}
                onChangeText={handleChangeCheckBox}
              />
            </div>
            <div></div>
          </div>
        </div>
        <div
          className={
            isMobile ? "col-12 company-form-mobile mt-3" : "company-form mt-3"
          }
          style={{
            marginBottom: !krForm ? "0px" : "200px",
          }}
        >
          <div className={isMobile ? "pt-3 header" : "header"}>
            <div>
              <p className="text-header">
                {update ? "Update" : "Add"} {t("OKR Details.KR Details")}
              </p>
            </div>
            <div>
              {(okrdetails.objectiveStatus === "Unlock" ||
                okrdetails.objectiveStatus === "Reject" ||
                okrdetails.objectiveStatus === "Create" ||
                okrdetails.objectiveStatus === "Update") &&
                !isEdit &&
                !addNewKr &&
                (isMobile ? (
                  <img
                    src={plusIcon}
                    alt="plusIcon"
                    style={{ height: 40 }}
                    onClick={addNewKrfunction}
                  />
                ) : (
                  <Button
                    text="Add New KR"
                    className="bg-green border text-white"
                    handleClick={addNewKrfunction}
                  />
                ))}
            </div>
          </div>
          <div className={isMobile ? "kr-form" : ""}>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <div>
                {!addNewKr && (
                  <div>
                    <Row className="mt-3 p-2">
                      <Col lg="8">
                        <Row className="mt-2">
                          <Col lg="3">
                            <label htmlFor="keyResult" className="m-1 fs14">
                              {t("OKR Details.Key Result Name")}
                            </label>
                          </Col>
                          <Col lg="9">
                            <input
                              type="text"
                              id="keyResult"
                              className="form-control bg-light searchBox text-dark fs14"
                              value={searchKey}
                              onChange={(e) => setSearchKey(e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg="4" className={isMobile ? "" : "pt-2"}>
                        <SelectInput
                          label={t("FREQUENCY.FREQUENCY")}
                          placeholder="--Select--"
                          name="frequency"
                          options={Frequencies}
                          value={frequency}
                          onChangeText={(e) => setFrequency(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
                {addNewKr && (
                  <div>
                    <Row>  <Col className="" lg={'10'}>
                      <SelectInput
                        label={'Source'}
                        placeholder="--Select--"
                        name="source"
                        options={[{ key: 'Salesforce', label: 'Salesforce', value: 'Salesforce' }]}
                        value={
                          updateData.source
                            ? updateData.source
                            : keyResultsText.source
                        }
                        onChangeText={handleChangeSearch}

                      />
                    </Col></Row>
                    <Row>
                      <Col className="mt-2" lg={'10'} >
                        <SelectInput
                          label={'KPIs'}
                          placeholder="--Select--"
                          name="kpi"
                          options={listOfKpis?.data?.map(kpi => ({ key: kpi.name, label: kpi.name, value: kpi._id }))}
                          value={updateData.kpi
                            ? updateData.kpi
                            : keyResultsText.kpi}
                          onChangeText={handleChangeSearch}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3 p-2">
                      <Col lg="3">
                        <label htmlFor="keyResult" className="m-1 fs14">
                          {t("OKR Details.Key Result Name")}
                        </label>
                      </Col>
                      <Col lg="9">
                        <input
                          type="text"
                          placeholder=""
                          name="keyResultName"
                          id="keyResult"
                          className="form-control bg-light searchBox text-dark fs14"
                          value={
                            updateData.keyResultName
                              ? updateData.keyResultName
                              : keyResultsText.keyResultName
                          }
                          onChange={handleChangeSearch}
                        />
                      </Col>
                    </Row>
                    <Row className={isMobile ? "p-2" : "mt-3"}>
                      <Col className="" lg={isMobile ? "10" : "6"}>
                        <SelectInput
                          label={t("OKR Details.Unit Of Measurement")}
                          placeholder="--Select--"
                          name="uom"
                          options={UOMs}
                          value={
                            updateData.uom ? updateData.uom : keyResultsText.uom
                          }
                          onChangeText={handleChangeSearch}
                          readonly={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Actual, comments update once locked"
                                )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Target update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                      <Col className="" lg={isMobile ? "10" : "6"}>
                        <SelectInput
                          label={t("OKR Details.Polarity")}
                          placeholder="--Select--"
                          name="polarity"
                          value={
                            updateData.polarity
                              ? updateData.polarity
                              : keyResultsText.polarity
                          }
                          onChangeText={handleChangeSearch}
                          options={Polarities}
                          readonly={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Actual, comments update once locked"
                                )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Target update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                    </Row>
                    <Row className={isMobile ? "p-2" : "mt-3"}>
                      <Col className="" lg={isMobile ? "10" : "6"}>
                        <TextInput
                          dateType="number"
                          label={t("OKR Details.Target Result")}
                          name="target"
                          value={
                            updateData.target
                              ? updateData.target
                              : keyResultsText.target
                          }
                          onChangeText={handleChangeSearch}
                        />
                      </Col>
                      <Col className="" lg={isMobile ? "10" : "6"}>
                        <TextInput
                          // dateType="number"
                          label={t("OKR Details.Actual Result")}
                          name="actual"
                          value={
                            updateData.actual || updateData.actual === 0
                              ? updateData.actual
                              : keyResultsText.actual
                          }
                          onChange={handleChangeSearch}
                        />
                      </Col>
                    </Row>

                    <Row className={isMobile ? "p-2" : "mt-3"}>
                      <Col lg={isMobile ? "10" : "6"} className="">
                        <TextInput
                          label={t("OKR Details.Target Date")}
                          dateType="date"
                          name="targetDate"
                          value={
                            updateData.targetDate
                              ? updateData.targetDate
                              : keyResultsText.targetDate
                          }
                          onChangeText={handleChangeSearch}
                        />
                      </Col>
                      <Col lg={isMobile ? "10" : "6"} className="">
                        <TextInput
                          label={t("OKR Details.Completion Date")}
                          dateType="date"
                          name="actualDate"
                          value={
                            updateData.actualDate
                              ? updateData.actualDate
                              : keyResultsText.actualDate
                          }
                          onChangeText={handleChangeSearch}
                        />
                      </Col>
                    </Row>

                    <div className={isMobile ? "mt-4 m-2" : "mt-3 mb-3 p-3"}>
                      {addNewKr &&
                        (showAttachment ? (
                          <BrowseFilesNormal
                            className="col-12"
                            setData={({ url }) => {
                              handleChangeSearch({
                                target: { name: "feedAttachment", value: url },
                              });
                              setShowAttachment(!showAttachment);
                            }}
                          />
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <a
                              href={
                                keyResultsText.feedAttachment
                                  ? keyResultsText.feedAttachment
                                  : updateData.feedAttachment
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Attachment
                            </a>
                            <button
                              className="btn btn-primary"
                              onClick={() => setShowAttachment(!showAttachment)}
                            >
                              Reupload Attachment
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className={isMobile ? "d-none" : "row mt-3"}>
                      <Button
                        text={t("OKR Details.Clear")}
                        className="bg-green border-0 text-white"
                        handleClick={clearAll}
                      />
                      {!isEdit ? (
                        <Button
                          handleClick={handleSave}
                          loading={buttonLoading}
                          text={t("OKR Details.Save")}
                          className="bg-green border text-white"
                        />
                      ) : (
                        <Button
                          text={t("OKR Details.Update")}
                          className="bg-green border text-white"
                          handleClick={handleUpdate}
                        />
                      )}
                      <Button
                        handleClick={() => handleComments(updateData)}
                        text={t("OKR Details.Comment")}
                        className="bg-green border text-white"
                      />
                      {Object.keys(updateData).length > 0 && (
                        <Button
                          handleClick={() => {
                            handleAddTask(updateData);
                          }}
                          text={t("OKR Details.Add New Task")}
                          className={`bg-${updateData.target === updateData.actual ||
                            !(
                              updateData.objectiveStatus === "Unlock" ||
                              updateData.objectiveStatus === "Reject" ||
                              updateData.objectiveStatus === "Create" ||
                              updateData.objectiveStatus === "Update" ||
                              updateData.objectiveStatus === "Approve"
                            )
                            ? "green text-white"
                            : "green text-white"
                            } border text-${updateData.target === updateData.actual ||
                              !(
                                updateData.objectiveStatus === "Unlock" ||
                                updateData.objectiveStatus === "Reject" ||
                                updateData.objectiveStatus === "Create" ||
                                updateData.objectiveStatus === "Update" ||
                                updateData.objectiveStatus === "Approve"
                              )
                              ? "black"
                              : "white"
                            }`}
                        />
                      )}
                      <Button
                        handleClick={() => handlenavigate()}
                        text={t("OKR Details.Return")}
                        className="bg-green border text-white"
                      />
                    </div>
                  </div>
                )}
                <div>
                  {loading ? (
                    <div className="text-center">
                      <LoadingIndicator size={3} />
                    </div>
                  ) : isMobile ? (
                    <KeyResultsMobileTable
                      privileges={privileges}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleAddTask={handleAddTask}
                      handleComments={handleComments}
                      title="keyresults"
                      data={data}
                      columns={columnsKr}
                      paginationFactory={paginationFactory}
                      searchKey={searchKey}
                    />
                  ) : (
                    <Table
                      title={t("OKR Details.OKR Details")}
                      data={filterData(data).filter((item) => {
                        return (
                          item.keyResultName
                            .toLowerCase()
                            .indexOf(item.keyResultName.toLowerCase()) !== -1 ||
                          item.frequency
                            .toLowerCase()
                            .indexOf(
                              item.frequency.toString().toLowerCase()
                            ) !== -1
                        );
                      })}
                      columns={columnsKr(
                        privileges,
                        handleAddTask,
                        handleComments,
                        handleEdit,
                        handleDelete,
                        handleScroll,
                        handleAuditHistory,
                        handleOpenViewComments
                      )}
                      paginationFactory={paginationFactory}
                      searchKey={searchKey || frequency}
                      selectRow={selectRow}
                      childData={{
                        data,
                        columnsChild: columnsTasks(
                          privileges,
                          setUpdateObj,
                          handleEditViewTask,
                          setViewModalTask,
                          setEditModalTask,
                          handleDeleteTasks
                        ),
                        columnsTasks,
                        searchKey,
                        checkboxOptions,
                      }}
                    />
                  )}
                  <p className="m-0 fs14 text-center text-danger">
                    {error.length > 0 ? error : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {krForm && isMobile && (
          <>
            <div className="new-task d-flex justify-content-center">
              {!isEdit ? (
                <Button
                  handleClick={handleSave}
                  text={t("Tasks.Task Title")}
                  className="bg-green mt-0 border text-white"
                />
              ) : (
                <Button
                  text={t("Tasks.Task Title")}
                  className="bg-green border text-white"
                  handleClick={handleUpdate}
                />
              )}
            </div>
            <div className="okr-footer">
              <div className="d-flex justify-content-center">
                <Button
                  text={t("objectives.Clear")}
                  className="bg-light border border-dark text-dark"
                  handleClick={clearAll}
                />
                {!isEdit ? (
                  <Button
                    handleClick={handleSave}
                    text="Save"
                    className="bg-green border text-white"
                  />
                ) : (
                  <Button
                    text="Update"
                    className="bg-green border text-white"
                    handleClick={handleUpdate}
                  />
                )}
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  handleClick={() => handleComments(updateData)}
                  text="Comment"
                  className="bg-green border text-white"
                />
              </div>
            </div>
          </>
        )}
        {isMobile && (
          <div
            className={`${!krForm ? "d-flex justify-content-center okr-footer" : "d-none"
              }`}
          >
            <Button
              text={`${update ? "Update" : "Add"} KR Details`}
              handleClick={() => setKrForm((prev) => !prev)}
              className="bg-green border text-white"
            />
          </div>
        )}
      </div>
      {orderModalShow && (
        <SubTask
          show={orderModalShow}
          onHide={() => setOrderModalShow(false)}
          handlecallback={(data, callback) => handleCallback2(data, callback)}
          tasks={tasks}
          selectedKR={selectedKR}
        />
      )}
      {orderModalShow2 && (
        <CommentPopup
          show={orderModalShow2}
          onHide={() => setOrderModalShow2(false)}
          handlecallback={(data) => handleCallback3(data)}
        />
      )}
      {orderModalShow3 && (
        <EditCommentPopup
          show={orderModalShow3}
          onHide={() => setOrderModalShow3(false)}
          krReferenceId={krReferenceId}
          employeeName={employeeName}
          employeeReferenceId={employeeReferenceId}
        />
      )}
      {modelCommentView && (
        <ViewCommentPopup
          show={modelCommentView}
          onHide={() => setModelHanldeView(false)}
          krReferenceId={krReferenceId}
          employeeName={employeeName}
          employeeReferenceId={employeeReferenceId}
        />
      )}
      {orderModalShow4 && (
        <CascadedPopup
          show={orderModalShow4}
          onHide={() => setOrderModalShow4(false)}
          selectedObjective={[
            { objectiveId: okrdetails.objectiveId, weight: okrdetails.weight },
          ]}
          handleCallback={() => { }}
        />
      )}
      {editTaskModal && (
        <TasksEditPopup
          show={editTaskModal}
          onHide={() => setEditModalTask(false)}
          data={updateObj}
          owner={okrdetails}
          handlecallbackeditTask={handleCallbackEditTask}
        />
      )}
      {viewTaskModal && (
        <TasksView
          show={viewTaskModal}
          onHide={() => setViewModalTask(false)}
          data={updateObj}
          owner={okrdetails}
        />
      )}

      {showAuditHistory && (
        <ShowAuditHistory
          data={auditHistory}
          show={showAuditHistory}
          onHide={() => setShowAuditHistory(false)}
        />
      )}
    </div>
  );
}
