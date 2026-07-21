import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./styles.scss";
import Popup from "./Popup";
import ParentCard from "./parentCard";
import TitleHeader from "components/TitleHeader";
import { Col, Row } from "react-bootstrap";
import search from "assets/svg/search.svg";
import SelectInput from "components/Company/SelectInput";
import Date from "components/Company/Date";
import Add from "assets/svg/Rectangle.svg";
import eyeIcon from "assets/svg/eyeIcon.svg";
import moreIcon from "assets/svg/moreIcon.svg";
import {
  createTask,
  updateTask,
  getTasks,
  getTasksByRole,
  updateMultipleTasks,
  deleteTasks,
  exportSheet,
  getAllTasksSheet,
} from "action/TasksAct";
import { useDispatch, useSelector } from "react-redux";
import SelectInputIcon from "components/Company/SelectInputIcon";
import filter from "assets/svg/filternew.svg";
import {
  AuthRole,
  AuthTab,
  LoadingIndicator,
  removeDuplicates,
  statuses,
} from "utilities";
import Objectives from "pages/TasksTableView";

import { DragDropContext } from "react-beautiful-dnd";
import { getEmployees } from "action/EmployeeAct";
import { Toast } from "service/toast";
import { updateNotificationTask } from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import CreateAndExport from "./CreateAndExport";
import TasksFooter from "components/DashboardComponents/TaskFooter";
import trashIcon from "assets/svg/trashIcon.svg";
import HandleBulk from "./handleBulk";
import UserOnboarding from "react-user-onboarding";
import DatePicker, { getAllDatesInRange } from "react-multi-date-picker";
import { multiStatus } from "reducer";
import SelectInputIconStatus from "components/Company/SelectInputIconStatus";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import Calendar from "components/calendar/Calendar";
import SubTask from "./Subtask";
import { setSelectedTaskUser } from "reducer/userSlice";
import { setHandleClick } from "rdx/store";
import { getI18n, useTranslation } from "react-i18next";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

export default function Tasks() {
  const multiTasks = useSelector((state) => state.data.multiStatus);
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [, setNotStarted] = useState([]);
  const [, setInprogress] = useState([]);
  const [, setCompleted] = useState([]);
  const [status, setStatus] = useState([]);
  const [sample, setSample] = useState([]);
  const [search1, setSearch] = useState(false);
  const [move, setMove] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const [dates, setDates] = useState("");
  const [showView, setShowView] = useState("Table");
  const displayOpts = {
    startDate: "",
    endDate: "",
    CompletionDate: "",
  };
  const displayOpts2 = {
    notstarted: true,
    inprogress: true,
    completed: true,
  };
  const empID = JSON.parse(localStorage.getItem("userData"));
  const empID2 = JSON.parse(localStorage.getItem("user"));
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab"));
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [operator, setOperator] = useState("");
  const [myTeam, setMyTeam] = useState([]);
  const [selectedUser3, setSelectedUser3] = useState("all");
  const [tableView, setTableView] = useState(true);
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
                setOrderModalShow(false);
                getTask();
                setLoading(false);
                setError("");
                callback();
              }
            });
          }
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
  const elem1 = useRef(),
    elem2 = useRef();
  const story = [
    {
      component: "tooltip",
      ref: elem1,
      children: (
        <div>
          <p>Click here to add task</p>
        </div>
      ),
    },
  ];
  const story1 = [
    {
      component: "tooltip",
      ref: elem2,
      children: (
        <div>
          <p>Click here to edit task</p>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (
      localStorage.getItem("showObjTour") !== null &&
      localStorage.getItem("showObjTour") === "true"
    ) {
      setIsVisible(false);
    }
    if (
      localStorage.getItem("selectedTaskUser") !== null &&
      JSON.parse(localStorage.getItem("selectedTaskUser")) !== "all"
    ) {
      setSelectedUser3(JSON.parse(localStorage.getItem("selectedTaskUser")));
    }
    if (localStorage.getItem("selectedTaskUser") === null && AuthTab !== "me") {
      dispatch(setSelectedTaskUser("all"));
      window.location.reload();
    }
  }, []);
  useEffect(() => {
    if (tasks.length > 0) {
      setTimeout(() => {
        setIsVisible(location.state ? location.state.isVisible : false);
        window.history.replaceState({ isVisible: false }, document.title);
        //localStorage.setItem("showObjTour", "true");
      }, 400);
    } else if (
      tasks.length === 0 &&
      location.state &&
      location.state.story === "story"
    ) {
      setIsVisible(location.state ? location.state.isVisible : false);
      window.history.replaceState({ isVisible: false }, document.title);
    }
  }, [tasks, location, elem2, elem1]);

  const getStory = () => {
    if (location.state.story === "story") {
      return story;
    } else if (location.state.story === "story1") {
      return story1;
    }
  };
  const getAllTask = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllTasksSheet());
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
              _id: task._id,
              status: task.status,
              estimationEffort: task.estimationEffort,
              actualEffort: task.actualEffort,
              recurrence: task.recurrence ? task.recurrence : false,
              recurrenceDetails: task.recurrenceDetails
                ? task.recurrenceDetails
                : null,
              targetDate: task.dueDate
                ? window.moment(task.dueDate).format("D MMM YYYY")
                : "No Date",
              profilePicture: task.profilePicture,
              mainTask: task.mainTask ? task.mainTask : "",
              progressStatus: task.progressStatus ? task.progressStatus : 0,
              owner: task.owner,
              userId: task.userId,
              companyId: task.companyId,
              employeeName: task.employeeName,
              dueMessage: task.dueMessage,
              rewardPoints: task.rewardPoints ? task.rewardPoints : 0,
              children: task.children,
            };
          });
          setAllTasks(updatedData);
          setLoading(false);
          setError("");
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
              _id: task._id,
              status: task.status,
              estimationEffort: task.estimationEffort,
              actualEffort: task.actualEffort,
              recurrence: task.recurrence ? task.recurrence : false,
              recurrenceDetails: task.recurrenceDetails
                ? task.recurrenceDetails
                : null,
              targetDate: task.dueDate
                ? window.moment(task.dueDate).format("D MMM YYYY")
                : "No Date",
              profilePicture: task.profilePicture,
              mainTask: task.mainTask ? task.mainTask : "",
              progressStatus: task.progressStatus ? task.progressStatus : 0,
              owner: task.owner,
              userId: task.userId,
              companyId: task.companyId,
              employeeName: task.employeeName,
              dueMessage: task.dueMessage,
              rewardPoints: task.rewardPoints ? task.rewardPoints : 0,
              children: task.children,
            };
          });
          setTasks(updatedData);
          setLoading(false);
          setError("");

          let notStartedTasks = updatedData.filter((task, index) => {
            return task.status === "notstarted";
          });
          let inProgressTasks = updatedData.filter((task, index) => {
            return task.status === "inprogress";
          });
          let completedTasks = updatedData.filter((task, index) => {
            return task.status === "completed";
          });
          setNotStarted(notStartedTasks);
          setInprogress(inProgressTasks);
          setCompleted(completedTasks);
          setStatus(["Not Started", "InProgress", "Completed"]);
          setSample([
            { "Not Started": { tasks: notStartedTasks, lineColor: "#FA5453" } },
            { InProgress: { tasks: inProgressTasks, lineColor: "#FFBF00" } },
            { Completed: { tasks: completedTasks, lineColor: "#3FC429" } },
          ]);
          getEmployes();
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          setTasks([]);
          setSample([]);
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
  const getEmployes = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((item) => {
            return {
              key:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              value: item._id,
              profilePicture: item.personalInformation.profilePicture,
            };
          });
          let nonduplicate = removeDuplicates(updatedData, "key");
          setEmployees(nonduplicate);
          setLoading(false);
          setError("");
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
  const handleUserchange = (e) => {
    setSelectedUser3(e.target.value);
    const updatedData =
      e.target.value !== "all"
        ? tasks.filter((item) => item.assignTo[0] === e.target.value)
        : tasks;
    let notStartedTasks = updatedData.filter((task, index) => {
      return task.status === "notstarted";
    });
    let inProgressTasks = updatedData.filter((task, index) => {
      return task.status === "inprogress";
    });
    let completedTasks = updatedData.filter((task, index) => {
      return task.status === "completed";
    });
    setNotStarted(notStartedTasks);
    setInprogress(inProgressTasks);
    setCompleted(completedTasks);
    setStatus(["Not Started", "InProgress", "Completed"]);
    setSample([
      { "Not Started": { tasks: notStartedTasks, lineColor: "#FA5453" } },
      { InProgress: { tasks: inProgressTasks, lineColor: "#FFBF00" } },
      { Completed: { tasks: completedTasks, lineColor: "#3FC429" } },
    ]);
    dispatch(setSelectedTaskUser(e.target.value));
    window.location.reload();
  };
  const getDataForMyTeam = () => {
    try {
      setLoading(true);
      let response = dispatch(
        getTasksByRole(empID ? empID.ownerId : empID2._id)
      );
      response.then(({ data, message }) => {
        if (data !== undefined) {
          let updatedData = data.myteamTasks.map((task) => {
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
          let notStartedTasks = updatedData.filter((task, index) => {
            return task.status === "notstarted";
          });
          let inProgressTasks = updatedData.filter((task, index) => {
            return task.status === "inprogress";
          });
          let completedTasks = updatedData.filter((task, index) => {
            return task.status === "completed";
          });
          setNotStarted(notStartedTasks);
          setInprogress(inProgressTasks);
          setCompleted(completedTasks);
          setStatus(["Not Started", "InProgress", "Completed"]);
          setSample([
            { "Not Started": { tasks: notStartedTasks, lineColor: "#FA5453" } },
            { InProgress: { tasks: inProgressTasks, lineColor: "#FFBF00" } },
            { Completed: { tasks: completedTasks, lineColor: "#3FC429" } },
          ]);
          const empData = data.myTeam.map((item) => {
            return {
              key:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              label:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              value: item._id,
            };
          });
          setMyTeam([{ key: "All", value: "all", label: "All" }, ...empData]);
          getEmployes();
          setLoading(false);
          setError("");
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
  const fetchPrivileges = () => {
    try {
      setLoading(true);
      let privileges =getItemFromLocalStorage("privileges");
      setPrivileges(privileges);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCreate = () => {
    setOrderModalShow(true);
  };

  // React.useEffect(() => {
  dispatch(setHandleClick(handleCreate));
  // }, [dispatch, handleCreate]);

  const handleChange = ({ target: { name, value } }) => {
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
  const filterOptions = [
    {
      label: "Not Started ",
      name: "notstarted",
      value: displayOptions2.notstarted,
      onChangeText: onChangeText2,
    },
    {
      label: "InProgress",
      name: "inprogress",
      value: displayOptions2.inprogress,
      onChangeText: onChangeText2,
    },
    {
      label: "Completed",
      name: "completed",
      value: displayOptions2.completed,
      onChangeText: onChangeText2,
    },
  ];

  const handleCallback = (childData) => {
    getTask();
  };
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  };
  useEffect(() => {
    if (selectedTab.tab == "me") {
      getTask();
    } else {
      getDataForMyTeam();
    }
    if (!AuthRole.includes("Employee")) {
      getAllTask();
    }
    fetchPrivileges();
    //eslint-disable-next-line
  }, []);
  const onDragEnd = (result) => {
    if (
      privileges &&
      privileges.length > 0 &&
      privileges.filter((privilege) => privilege.page === "Tasks Drag and Drop")
        .length > 0 &&
      privileges.filter(
        (privilege) => privilege.page === "Tasks Drag and Drop"
      )[0].edit
    ) {
      let status = result.destination.droppableId;
      if (!result.destination) {
        return;
      }
      let dragTask = tasks.filter((task, index) => {
        return task.id === result.draggableId;
      });

      if (!dragTask[0].actualCompletionDate && status === "completed") {
        Toast({
          type: "error",
          message: "Actual completion date not found",
          time: 4000,
        });
      } else {
        let response = dispatch(
          updateTask(result.draggableId, { ...dragTask[0], status })
        );
        response.then(({ data, message, success }) => {
          if (success) {
            if (status === "completed") {
              checkCelebration();
            }
            let user =
              localStorage.getItem("userData") !== null
                ? JSON.parse(localStorage.getItem("userData"))
                : null;
            if (user !== null) {
              const objectiveStatus = {
                objectiveStatus: "Update",
                row: { ...dragTask[0], employeeReferenceId: user.ownerId },
                companyInfo: {
                  employeeName: user.ownerName,
                  employeeReferenceId: user.ownerId,
                },
              };
              let response2 = dispatch(
                updateNotificationTask(result.draggableId, objectiveStatus)
              );
              response2.then(({ success, message }) => {
                if (success) {
                  setLoading(false);
                  getTask();
                  setError("");
                }
              });
            }
          } else if (data.length === 0) {
            setLoading(false);
            setError("No Data Found!");
          }
        });
      }
    } else {
      Toast({
        type: "warning",
        message: "You don't have permission to drag and drop tasks.",
        time: 5000,
      });
    }
  };
  const filterData = (data) => {
    let result = data.filter((item) => {
      if (
        displayOptions2.notstarted &&
        !displayOptions2.inprogress &&
        !displayOptions2.completed
      ) {
        if (item.status === "notstarted" && item.title) {
          return (
            item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
        }
        return null;
      } else if (
        !displayOptions2.notstarted &&
        displayOptions2.inprogress &&
        !displayOptions2.completed
      ) {
        if (item.status === "inprogress" && item.title) {
          return (
            item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
        }
        return null;
      } else if (
        !displayOptions2.notstarted &&
        !displayOptions2.inprogress &&
        displayOptions2.completed
      ) {
        if (item.status === "completed" && item.title) {
          return item;
        }
        return item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1;
      } else if (
        displayOptions2.notstarted &&
        displayOptions2.inprogress &&
        displayOptions2.completed &&
        item.title
      ) {
        return item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1;
      } else if (
        !displayOptions2.notstarted &&
        displayOptions2.inprogress &&
        displayOptions2.completed &&
        item.title
      ) {
        if (item.status === "inprogress" || item.status === "completed") {
          return (
            item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
        }
        return null;
      } else if (
        displayOptions2.notstarted &&
        !displayOptions2.inprogress &&
        displayOptions2.completed &&
        item.title
      ) {
        if (item.status === "notstarted" || item.status === "completed") {
          return (
            item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
        }
        return null;
      } else if (
        displayOptions2.notstarted &&
        displayOptions2.inprogress &&
        !displayOptions2.completed &&
        item.title
      ) {
        if (item.status === "inprogress" || item.status === "notstarted") {
          return (
            item.title.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1
          );
        }
        return null;
      } else {
        return item;
      }
    });
    return result;
  };
  const filterData2 = (data) => {
    var finalData = [];
    var finalData2 = [];
    if (
      displayOptions.startDate === "" &&
      operator === "" &&
      displayOptions.CompletionDate === ""
    ) {
      return data;
    } else if (
      operator &&
      operator === "lt" &&
      displayOptions.startDate !== "" &&
      displayOptions.CompletionDate === ""
    ) {
      return data.filter(
        (item) =>
          window.moment(item.startDate).format("YYYY-MM-DD") >=
          displayOptions.startDate
      );
    } else if (
      operator &&
      operator === "gt" &&
      displayOptions.startDate !== "" &&
      // displayOptions.endDate !== "" &&
      displayOptions.CompletionDate === ""
    ) {
      return data.filter(
        (item) =>
          window.moment(item.dueDate).format("YYYY-MM-DD") >=
          displayOptions.startDate
      );
    } else if (
      operator &&
      operator === "bet" &&
      dates[0] !== "" &&
      dates[dates.length - 1] !== "" &&
      // displayOptions.startDate !== "" &&
      // displayOptions.endDate !== "" &&
      displayOptions.CompletionDate === ""
    ) {
      data.map((item) => {
        if (
          window.moment(item.startDate).format("YYYY-MM-DD") >=
            window.moment(dates[0]).format("YYYY-MM-DD") &&
          // displayOptions.startDate
          window.moment(item.dueDate).format("YYYY-MM-DD") <=
            window.moment(dates[dates.length - 1]).format("YYYY-MM-DD")
        ) {
          finalData.push(item);
        }
        return finalData;
      });
      return finalData;
    } else if (
      (operator && operator === "lt") ||
      ("gt" &&
        displayOptions.startDate !== "" &&
        // displayOptions.endDate !== "" &&
        displayOptions.CompletionDate !== "")
    ) {
      data.map((item) => {
        if (
          window.moment(item.startDate).format("YYYY-MM-DD") >=
            displayOptions.startDate &&
          // window.moment(item.dueDate).format("YYYY-MM-DD") <= displayOptions.endDate &&
          window.moment(item.actualCompletionDate).format("YYYY-MM-DD") ===
            displayOptions.CompletionDate
        ) {
          finalData2.push(item);
        }
        return finalData2;
      });
      return finalData2;
    }
    if (displayOptions.startDate === "") {
      return data;
    }
  };

  const handleBulkMove = (child) => {
    let checkedTasks = multiTasks
      .filter((task) => task.checked)
      .map((task) => {
        let _id = task.id;
        let status = task.status;
        return { _id, status };
      });
    let update = [...checkedTasks];
    let final = update.map((task) => {
      return { ...task, status: child };
    });
    let response = dispatch(updateMultipleTasks({ data: final }));
    response.then(({ data, success, message }) => {
      if (success) {
        dispatch(multiStatus([]));
        setMove(false);
        getTask();
        setLoading(false);
        setError("");
      }
    });
  };

  const handleBulkDelete = () => {
    let checkedTasks = multiTasks
      .filter((task) => task.checked)
      .map((task) => task.id);
    let response = dispatch(deleteTasks({ data: checkedTasks }));
    response.then(({ data, success, message }) => {
      if (success) {
        getTask();
        setLoading(false);
        setError("");
      }
    });
  };

  const getSpreadSheet = async () => {
    // Call the server to create the spreadsheet
    let response = dispatch(
      exportSheet({ data: AuthRole.includes("Employee") ? tasks : allTasks })
    );
    response.then(({ data, success, message }) => {
      window.open(data);
    });
  };

  const { t } = useTranslation();
  return (
    <>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"}
          alt="LottieConfettie"
        />
      </div>
      <TitleHeader name={t("Tasks.Tasks")} />
      <div
        className={`bg-light-primary rounded-12 mh-100  ${
          isMobile ? "" : "p-4 m-4"
        }`}
        style={{
          padding: isMobile ? "11px" : "0px",
          margin: "0px",
        }}
      >
        <div
          className={isMobile ? "d-flex justify-content-between" : ""}
          style={{ flexWrap: "wrap", gap: "5px" }}
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "100%", marginBottom: isMobile ? "5px" : "0px" }}
          >
            <p
              className={`title text-dark font-weight-bold mb-0 ${
                isMobile ? "" : "pb20"
              }`}
            >
              {AuthRole} {t("Tasks.Board")}
            </p>

            {selectedTab.tab !== "me" && (
              <div className={`m-0 p-0 dropt ${isMobile ? "" : "pb20"}`}>
                <SelectInput
                  options={myTeam}
                  value={selectedUser3}
                  onChangeText={(e) => handleUserchange(e)}
                />
              </div>
            )}
            <div className="d-flex justify-content-between">
              <div
                className="cursor-pointer mr-2 listicon2 pl-2 pr-2"
                onClick={() => {
                  getSpreadSheet();
                }}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {t("Tasks.Google Sheet")}
              </div>
              <div
                className="cursor-pointer mr-2 listicon2 pl-2 pr-2"
                onClick={() => {
                  setTableView(true);
                  setShowView("Table");
                }}
                style={{
                  backgroundColor: showView == "Table" ? "white" : "",
                  borderRadius: "10px",
                  color: showView == "Table" ? "#379088" : "",
                }}
              >
                <i className="fa fa-table" aria-hidden="true" title="Table"></i>
              </div>
              <div
                className=" cursor-pointer mr-2 listicon2 pl-2 "
                onClick={() => {
                  setTableView(false);
                  setShowView("List");
                }}
                style={{
                  backgroundColor: showView == "List" ? "white" : "",
                  borderRadius: "10px",
                  color: showView == "List" ? "#379088" : "",
                }}
              >
                <i className="fa fa-list" aria-hidden="true" title="List"></i>
              </div>
              <div
                className="cursor-pointer ml-2 pl-2 pr-2"
                onClick={() => {
                  setShowView("Weekly");
                  setShowView("Monthly");
                }}
                style={{
                  backgroundColor: showView == "Monthly" ? "white" : "",
                  borderRadius: "10px",
                  color: showView == "Monthly" ? "#379088" : "",
                }}
              >
                <i className="fa fa-calendar" title="Monthly"></i>
              </div>
            </div>
          </div>
          {isMobile ? (
            <div
              className="d-flex justify-content-between"
              style={{ width: "100%" }}
            >
              <div className="d-flex justify-content-between mt-1 mr-2">
                <img
                  src={search}
                  alt="search-icon"
                  className=" searchIcon searchIconMobile2"
                  onClick={(e) => setSearch(!search1)}
                />
                <div className="ml-2 searchIconMobile2 border-seperate" />
              </div>
              <SelectInputIcon
                className="filter"
                label=""
                icon={moreIcon}
                placeholder="Filter"
                name="status"
                options={statuses}
                checkboxOptions={filterOptions}
                onChangeText={(e) => onChangeText2(e)}
              />
              <SelectInputIcon
                className="filter"
                label=""
                icon={eyeIcon}
                placeholder="Filter"
                name="status"
                options={statuses}
                checkboxOptions={filterOptions}
                onChangeText={(e) => onChangeText2(e)}
              />
              <div className="">
                <SelectInputIcon
                  className="filter"
                  label=""
                  icon={filter}
                  style={{
                    backgroundImage: "none",
                    textAlign: "center",
                    backgroundColor: "white",
                  }}
                  placeholder="Filter"
                  name="status"
                  options={statuses}
                  checkboxOptions={filterOptions}
                  onChangeText={(e) => onChangeText2(e)}
                />
              </div>
              <div className="dropdown actionDropdown">
                <span
                  className="dropdown-hide align-items-center"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src={Add}
                    alt="add form"
                    className={isMobile ? "curser-pointer" : ""}
                    height="32"
                  />
                </span>
                <div
                  className="dropdown-menu dropdown-menu-right text-left "
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    className="dropdown-item text-capitalize text-left justify-content-start"
                    onClick={() => window.print()}
                  >
                    {t("Tasks.Export as PDF")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {!tableView ? (
          <div>
            {search1 && (
              <Col md="3" className={`${isMobile ? "" : "mt-4 pt-2 pr-5"}`}>
                <div className="input-group p-0 nav-item search-bar2">
                  <div className="input-group-append searchInput2-icon ">
                    {/* <i className="fa fa-search" /> */}
                    <img
                      src={search}
                      alt="search-icon"
                      className="searchIcon "
                    />
                  </div>
                  <input
                    type="text"
                    className="bg-white outline-none searchInput2 text-dark fs14 "
                    placeholder="Searc Here"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  hi
                </div>
              </Col>
            )}
            {!isMobile && (
              <Row className="align-items-center">
                <Col md="3" className={`${isMobile ? "" : "mt-4 pt-2 pr-5"}`}>
                  <div className="input-group p-0 nav-item search-bar2">
                    <div className="input-group-append searchInput2-icon ">
                      {/* <i className="fa fa-search" /> */}
                      <img
                        src={search}
                        alt="search-icon"
                        className="searchIcon "
                      />
                    </div>
                    <input
                      type="text"
                      className="bg-white outline-none searchInput2 text-dark fs14 "
                      placeholder="Search Here"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                </Col>
                <Col className="">
                  <button
                    className="btn dropdown-hide bg-green text-white text-capitalize circle border mt-4 pl-5 pr-5 fs16"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {t("Tasks.Operation")}
                  </button>
                  <div
                    className="dropdown-menu m-1 col-sm-1"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <button
                      className="dropdown-item text-capitalize fs16"
                      onClick={() => setOperator("lt")}
                    >
                      &nbsp;
                      {t("Tasks.LessThan")}
                    </button>
                    <button
                      className="dropdown-item text-capitalize fs16"
                      onClick={() => setOperator("gt")}
                    >
                      &nbsp;
                      {t("Tasks.GreaterThan")}
                    </button>
                    <button
                      className="dropdown-item text-capitalize fs16"
                      onClick={() => setOperator("bet")}
                    >
                      &nbsp;
                      {t("Tasks.Between")}
                    </button>
                  </div>
                </Col>
                {operator && operator === "bet" && (
                  <Col className="mt-4">
                    <DatePicker
                      range
                      eachDaysInRange
                      onChange={(dateObjects) => {
                        let allDates = getAllDatesInRange(dateObjects, true);
                        setDates(allDates);
                      }}
                      style={{
                        border: "1px solid gray",
                        borderRadius: "20px",
                        padding: "19px 11px",
                      }}
                      placeholder="dd/mm/yyyy - dd/mm/yyyy"
                    />
                  </Col>
                )}
                {operator && operator !== "bet" && (
                  <Col className="">
                    <Date
                      label={operator === "lt" ? "Start Date" : "End Date"}
                      dateType="date"
                      name="startDate"
                      value={displayOptions.startDate}
                      placeholder="dd/mm/yyyy"
                      onChangeText={(e) => handleChange(e)}
                    />
                  </Col>
                )}
                <Col className="">
                  <Date
                    label={t("Tasks.Completion Date")}
                    dateType="date"
                    name="CompletionDate"
                    value={displayOptions.CompletionDate}
                    placeholder="dd/mm/yyyy"
                    onChangeText={handleChange}
                  />
                </Col>
                <Col className="mt-4">
                  <SelectInputIconStatus
                    className="filter"
                    label=""
                    icon={filter}
                    style={{
                      backgroundImage: "none",
                      textAlign: "center",
                      backgroundColor: "white",
                    }}
                    placeholder={t("Tasks.Status")}
                    name="status"
                    options={statuses}
                    checkboxOptions={filterOptions}
                    onChangeText={(e) => onChangeText2(e)}
                  />
                </Col>
                {multiTasks.length > 0 &&
                  multiTasks.filter((task) => task.checked).length > 0 && (
                    <Col
                      lg="9"
                      className={`d-flex justify-content-${
                        isMobile ? "center" : "end"
                      } align-items-center`}
                    >
                      <button
                        className="btn dropdown-hide text-capitalize circle border pl-5 pr-5 fs16"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {t("Tasks.Action")}
                      </button>
                      <div
                        className="dropdown-menu m-1 col-sm-1"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <button
                          className="dropdown-item text-capitalize fs16"
                          onClick={() => setMove(true)}
                        >
                          {/* <img src={trashIcon} alt="delete table icon" /> */}
                          &nbsp;Move
                        </button>
                        <button
                          className="dropdown-item text-capitalize fs16"
                          onClick={() => handleBulkDelete()}
                        >
                          <img src={trashIcon} alt="delete table icon" />
                          &nbsp;Delete
                        </button>
                      </div>
                    </Col>
                  )}
                <CreateAndExport
                  isMobile={isMobile}
                  handleCreate={handleCreate}
                  forwardRef={elem1}
                />
              </Row>
            )}
            {loading ? (
              <div className="text-center">
                <LoadingIndicator size={"10"} />
              </div>
            ) : sample.length > 0 ? (
              <div className="printonly">
                {showView === "Weekly" && (
                  <Calendar
                    tasks={tasks}
                    viewType={showView}
                    showEditPopup={(id) => setShowEditPopup(id)}
                    setOrderModalShow={(status) => setOrderModalShow(status)}
                    employees={employees}
                  />
                )}
                {showView === "Monthly" && (
                  <Calendar
                    tasks={tasks}
                    viewType={showView}
                    showEditPopup={(id) => setShowEditPopup(id)}
                    setOrderModalShow={(status) => setOrderModalShow(status)}
                    employees={employees}
                  />
                )}
                {
                  <div className="row">
                    <DragDropContext onDragEnd={onDragEnd}>
                      {status &&
                        status.map((status, index) => {
                          return (
                            sample &&
                            sample
                              .filter((obj, index) => {
                                return obj[status];
                              })
                              .map((task, index) => {
                                return (
                                  <div
                                    className={`col-lg-4 col-md-12 col-sm-12 col-xs-12 ${
                                      showView === "List" ? "" : "d-none"
                                    }`}
                                    key={index}
                                    id={status.toLowerCase().replace(/ /g, "")}
                                  >
                                    <ParentCard
                                      status={status}
                                      lineColor={task[status].lineColor}
                                      tasks={filterData2(
                                        filterData(task[status].tasks)
                                      )}
                                      allTasks={tasks}
                                      setTasks={setTasks}
                                      setOrderModalShow={(status) =>
                                        setOrderModalShow(status)
                                      }
                                      handlecallback={(data) =>
                                        handleCallback(data)
                                      }
                                      employees={employees}
                                      privileges={privileges}
                                      forwardRef={elem2}
                                      showEditPopup={showEditPopup}
                                    />
                                  </div>
                                );
                              })
                          );
                        })}
                    </DragDropContext>
                  </div>
                }
              </div>
            ) : (
              <div className="text-center">
                <h5 className="text-danger mt-4 mb-4">
                  {t("Tasks.no_tasks_found")}
                </h5>
              </div>
            )}
          </div>
        ) : (
          <Objectives />
        )}
        {orderModalShow && (
          <SubTask
            show={orderModalShow}
            onHide={() => setOrderModalShow(false)}
            handlecallback={(data, callback) => handleCallback2(data, callback)}
            tasks={tasks}
          />
        )}
        {move && (
          <HandleBulk
            show={move}
            onHide={() => setMove(false)}
            handleBulkMove={handleBulkMove}
            tasks={multiTasks}
          />
        )}
        {isMobile ? (
          <div className="bg-white text-center fixed-task">
            <button
              className="dropdown-hide create-btn bg-green  mt-2 m-2  text-white border  p-1"
              style={{ borderRadius: "30px" }}
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdownMenuButton"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={handleCreate}
            >
              label={t("Tasks.Create Task")}
            </button>
          </div>
        ) : (
          ""
        )}
        {isMobile ? <TasksFooter /> : ""}
      </div>
      <UserOnboarding
        story={location.state ? getStory() : []}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
          localStorage.setItem("showObjTour", true);
        }}
      />
    </>
  );
}
