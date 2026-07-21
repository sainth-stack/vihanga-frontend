import React, { useEffect, useState, useRef } from "react";
import Add from "assets/svg/Rectangle.svg";
import Taskpercent from "components/DashboardComponents/Taskpercent";
import { useLocation, Link } from "react-router-dom";
import calendaricon from "assets/svg/calendaricon.svg";
import Accountdepartment from 'components/DashboardComponents/Accountdepartment';
import Birthdayevent from 'components/DashboardComponents/Birthdayevent';
import Anniversaryevent from 'components/DashboardComponents/Anniversaryevent';
import SelectInput from "components/Company/SelectInput";
import PieChart from "components/DashboardComponents/PieChart";
import StackChart from "components/DashboardComponents/StackChart";
import CustomLegend from "components/DashboardComponents/CustomLegend";
import { getTasks } from "action/TasksAct";
import { useDispatch } from "react-redux";
import { history } from "service/helpers";
import { AuthUser, data1, data2, data3, data4, LoadingIndicator, OKRperiod, OKRperiodMonths, removeDuplicates, ShowCup } from "utilities";
import useWindowSize from "components/UseWindowSize";
import MobileFooter from "components/MobileFooter";
import { createObjective, getObjectivesDashboard, getObjectivesOCR, getObjectivesRewardPoints, getObjectives } from "action/UserAct";
import { empWithRewards } from 'action/UserAct'
import { Toast } from "service/toast";
import UserOnboarding from "react-user-onboarding";
import ScheduleCalendar from "./ScheduleCalendar";
import SliderBarReviews from "components/DashboardComponents/SliderBarReviews";
import { totalQuartersData } from "pages/Objectives/ObjectivesTable/getMonthsData";
import PerformancePieChart from "./PieChart";
import { getReviewChartData } from "action/ReviewFormAct";
import ObjectivesCreatePopup from "pages/Objectives/ObjectivesCreatePopup";
import useGetEmployees from "pages/Objectives/hooks/useGetEmployees";
import { updateNotification } from "action/NotificationAct";
import { getAllRewards } from "action/RewardsAct";
import { tableGenerator } from "pages/Rewards";
import * as XLSX from "xlsx";
import "components/DashboardComponents/styles.scss";
import "./styles.scss";
import cup from "assets/svg/bronzeCup.svg";
import { getEmployees } from "action/EmployeeAct";
import StackChartEmployee from "components/DashboardComponents/employeePerformanceChart";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { useDispatch as useReduxDispatch } from "react-redux";
import { loadAndApplyTheme } from "reducer/themeSlice";

function Card2({ children, isMobile, graph }) {
  return (
    <div className={isMobile ? "card shadow rounded m-1 mt-3" : `col-md-6 m-0 p-0`}>
      <div className={`gradient-color card shadow rounded m-1 p-1 ${graph !== undefined && "graphCardHeight"}`}>
        {children}
      </div>
    </div>
  );
}
function CardChat({ children, isMobile, graph }) {
  return (
    <div className={isMobile ? "card shadow rounded m-1 mt-3" : `gradient-color card shadow rounded col-md-12 m-1 p-1 ${graph !== undefined && "graphCardHeight"}`}>
      {children}
    </div>
  );
}
function Heading(props) {
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  const downloadSheet2 = () => {
    const exportData = props.data.map((item => {
      const filterData = props.employees.filter((item1) => item.employeeReferenceId.toString() === item1._id.toString());

      return {
        _id: item._id,
        objective: item.objective,
        empname: filterData.length > 0 && filterData[0].personalInformation ? filterData[0].personalInformation.firstName + filterData[0].personalInformation.lastName : "",
        employeeReferenceId: item.employeeReferenceId,
        employeeNumber: item.employeeNumber,
        remaining: item.remaining,
        completed: item.completed,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    }))
    const data = [...exportData];
    if (data) {
      if (props.title === 'OKR Progress' && user.role === 'HR Admin') {
        downloadExcelTotalData(props.data)
      } else {
        downloadExcel(data)
      }
    } else {
      console.log("No data");
    }
  }
  const downloadExcel = (data) => {
    if (data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "OKRDATA" + Date.now() + ".xlsx");
    }
    else {
      Toast({ message: "No Data Found!", type: "warning", time: 4000 })
    }
  }
  const downloadExcelTotalData = (data) => {
    if (data.length > 0) {
      let allObjectives = [];
      data.forEach((item) => {
        let objj = {
          ...item,
          dueDate: item.dueDate !== "Invalid date" ? window.moment(item.dueDate).format("YYYY-MM-DD") : ""
        };
        objj.keyResults = item.children.map((keyResult) => ({
          ...keyResult,
          objective: item.name,
          okrFunction: item.okrFunction,
          okrCategory: item.okrCategory,
        }));
        allObjectives = [...allObjectives, objj];
      });
      let updatedObjectives = allObjectives;
      let okrResults = [];
      updatedObjectives.forEach((objective) => {
        objective.children.forEach((keyResult) => {
          okrResults.push(keyResult);
        });
      });
      let finalObjandKRs = [...updatedObjectives, ...okrResults];
      let finalData = finalObjandKRs.map((item) => {
        let newObj = { ...item };
        delete newObj.objective;
        delete newObj.keyResults;
        return newObj;
      });
      const finData = finalData.map((item) => {
        return {
          employeeNumber: item.employeeNumber,
          employeeName: item.employeeName,
          designation: item.designation || '',
          okrPeriod: item.okrPeriod,
          okrYear: item.okrYear,
          weight: item?.weight,
          cascaded: item?.cascaded,
          cascadeByName: item?.cascadeByName,
          okrName: item?.okrName,
          progressStatus: item?.progressStatus,
          keyResultName: item?.keyResultName,
          polarity: item?.polarity,
          targetDate: window.moment(item?.targetDate).format("YYYY-MM-DD"),
          actualDate: window.moment(item?.targetDate).format("YYYY-MM-DD"),
          target: item.target,
          actual: item.actual,
          percent: item.percent,
          rewardPoints: item.rewardPoints,
          status: item.status,
          objectiveStatus: item.objectiveStatus,
          approvalRequired: item.approvalRequired,
          isAlignedToCompany: item.isAlignedToCompany,
          objectiveID: item.objectiveID,
          krID: item.krID
        }
      })
      const worksheet = XLSX.utils.json_to_sheet(finData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
    } else {
      Toast({ message: "No Data Found!", type: "warning", time: 4000 })
    }
  };
  return (
    <div className="d-flex justify-content-between align-items-center p-2">
      <h6>{props.title}</h6>
      {props.title === "OKR Progress" && <button
        className="text-left justify-content-start bg-green text-light"
        style={{ borderRadius: "4px", textTransform: "uppercase" }}
        onClick={() => {
          props.setOrderModalShow3(true)
        }}
      >
        {t("Dashboard.addKR")}
      </button>}
      <div className="dropdown actionDropdown">
        <button
          className="btn btn-light dropdown-hide align-items-center"
          id="dropdownMenuButton"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-h pe-auto" />
        </button>
        <div
          className="dropdown-menu dropdown-menu-right text-left "
          aria-labelledby="dropdownMenuButton"
        >
          <button
            className="dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              downloadSheet2()
            }}
          >
            {t("Dashboard.excel")}
          </button>

        </div>
      </div>
    </div>
  );
}


function Heading2(props) {
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  const downloadSheet2 = () => {
    const exportData = props.data?.reviews?.map((item => {
      const filterData = props?.employees?.filter((item1) => item?.employeeId?.toString() === item1?._id?.toString());
      return {
        _id: item._id,
        "Employee Number": filterData[0]?.employmentInformation?.employeeNumber,
        "Employee Name": filterData.length > 0 && filterData[0].personalInformation ? filterData[0].personalInformation.firstName + filterData[0].personalInformation.lastName : "",
        "Department Name": filterData[0]?.employmentInformation?.department,
        "Position": filterData[0]?.employmentInformation.designation,
        "Manager": user?.name,
        "Review Period StartDate": item?.startDate || '',
        'Review Period EndDate': item?.endDate || '',
        'Overall Rating': item.overallRating || '',
        "Overal Comments": item?.overalComments || '',
        'Total Achievement Percentage': item.totalAchievement
      }
    }))

    const data = [...exportData];
    if (data) {
      downloadExcel55(data)
    } else {
      console.log("No data");
    }
  }

  const downloadSheet3 = () => {
    const data3 = []
    const exportData = props.data?.reviews?.map((itemc => {
      const filterData = props?.employees?.filter((item1) => itemc?.employeeId?.toString() === item1?._id?.toString());
      const objectiveData = props.objectives.filter((item) => item.employeeReferenceId === filterData[0]?._id)
      if (itemc?.goals.length > 0) {
        const exportData = itemc?.goals?.map((item) => {
          data3.push({
            _id: item._id,
            "Employee Number": filterData[0]?.employmentInformation?.employeeNumber,
            "Employee Name": filterData.length > 0 && filterData[0].personalInformation ? filterData[0].personalInformation.firstName + filterData[0].personalInformation.lastName : "",
            "Department Name": filterData[0]?.employmentInformation?.department,
            "Position": filterData[0]?.employmentInformation.designation,
            "Manager": user?.name,
            "Review Period StartDate": itemc?.startDate || '',
            'Review Period EndDate': itemc?.endDate || '',
            'Overall Rating': itemc.overallRating || '',
            'Total Achievement Percentage': item.totalAchievement,
            "Objective Name": item.objective,
            'Rating': item.managerRating
          })
        })
      } else if (objectiveData.length > 0) {
        const exportData = objectiveData?.map((item) => {
          data3.push({
            _id: item._id,
            "Employee Number": filterData[0]?.employmentInformation?.employeeNumber,
            "Employee Name": filterData.length > 0 && filterData[0].personalInformation ? filterData[0].personalInformation.firstName + filterData[0].personalInformation.lastName : "",
            "Department Name": filterData[0]?.employmentInformation?.department,
            "Position": filterData[0]?.employmentInformation.designation,
            "Manager": user?.name,
            "Review Period StartDate": itemc?.startDate || '',
            'Review Period EndDate': itemc?.endDate || '',
            'Overall Rating': itemc.overallRating || 0,
            'Total Achievement Percentage': item.totalAchievement || 0,
            "Objective Name": item.objective,
            'Rating': 0
          })
        })
      }
      else {
        data3.push({
          _id: itemc._id,
          "Employee Number": filterData[0]?.employmentInformation?.employeeNumber,
          "Employee Name": filterData.length > 0 && filterData[0].personalInformation ? filterData[0].personalInformation.firstName + filterData[0].personalInformation.lastName : "",
          "Department Name": filterData[0]?.employmentInformation?.department,
          "Position": filterData[0]?.employmentInformation.designation,
          "Manager": user?.name,
          "Review Period StartDate": itemc?.startDate || '',
          'Review Period EndDate': itemc?.endDate || '',
          'Overall Rating': itemc.overallRating || '',
          'Total Achievement Percentage': itemc.totalAchievement,
          "Overal Comments": itemc?.overalComments || '',
          "Objective Name": '',
          'Rating': ''
        })
      }
    }))

    const data = [...data3];
    if (data) {
      downloadExcel55(data)
    } else {
      console.log("No data");
    }
  }

  return (
    <div className="d-flex justify-content-between align-items-center p-2">
      <h6>{props.title}</h6>
      <div className="dropdown actionDropdown">
        <button
          className="btn btn-light dropdown-hide align-items-center"
          id="dropdownMenuButton"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-h pe-auto" />
        </button>
        <div
          className="dropdown-menu dropdown-menu-right text-left "
          aria-labelledby="dropdownMenuButton"
        >
          <button
            className="dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              downloadSheet2()
            }}
          >
           {t("Dashboard.summ")}
          </button>
          <hr style={{ padding: '0px', margin: '0px' }} />
          <button
            className="dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              downloadSheet3()
            }}
          >
           {t("Dashboard.deta")}
           </button>
        </div>
      </div>
    </div>
  );
}

const downloadExcel55 = (data) => {
  if (data.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "REVIEWSDATA" + Date.now() + ".xlsx");
  }
  else {
    Toast({ message: "No Data Found!", type: "warning", time: 4000 })
  }
}


const downloadExcel = (data) => {
  if (data.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DashboardActivities" + Date.now() + ".xlsx");
  }
  else {
    Toast({ message: "No Data Found!", type: "warning", time: 4000 })
  }
}

export default function Dashboard() {
  const themeDispatch = useReduxDispatch();
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
  const { t } = useTranslation()
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [, setError] = useState("");
  const [totalTasks, setTotalTasks] = useState()
  const [completeTasks, setCompleteTasks] = useState()
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const [data, setData] = useState([])
  const [dataTasks, setDataTasks] = useState([])
  const [objectives, setObjectives] = useState([])
  const [rewardPoints, setRewardPoints] = useState(0)
  const [rewardPoints1, setRewardPoints1] = useState(0)
  const [rewardPoints2, setRewardPoints2] = useState(0)
  const [remainingObjectives, setObjectivesRemaining] = useState(0)
  const [, setRewardPoints3] = useState(0)
  const [empwithRewards, setEmpWithRewards] = useState([])
  const [finalemp, setFinalEmp] = useState([])
  const [period, setPeriod] = useState("Yearly")
  const [, setPeriodData] = useState([])
  const [employees, setEmployees] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()
  const [selectTab, setSelectTab] = useState('company')
  const [finalObj, setFinalObj] = useState([])
  const [totalEmp, setTotalEmp] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [reviewsData, setReviewDownloadData] = useState({ employees: {}, reviews: [] })
  const [taskPercent, setTaskPercentage] = useState(0);
  const [taskPercentAchieved, setTaskPercentageAchieved] = useState(0);
  const [rewardPointsAchieved, setRewardPointsAchieved] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [, setShowGif] = useState(false);
  const [rewardsData, setRewardsData] = useState([]);
  const [dataLoad, setDataLoad] = useState({
    update: false,
    create: false
  })
  let companyObj = {
    companyEntityName: "",
    employeeName: "",
    employeeNames: "",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
    okrPeriod: "",
    okrYear: "2022",
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const { data: employeeResponse, isLoading: employeeLoading } = useGetEmployees();

  const getRewardsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "rewardName");
          nonduplicate = tableGenerator(data, data.length);
          setRewardsData(nonduplicate);
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

  const getFinObjectives = () => {
    try {
      setLoading(true);

      let response = dispatch(getObjectives(user?.role));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setFinalObj(data)
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

  const fetchEmployees = async () => {
    try {
      setLoading(employeeLoading);
      const response = await dispatch(getEmployees())
      const { data, message } = response;

      if (data !== undefined && data.length > 0) {
        let updatedData = data.filter(item => {
          if (selectedTab !== null && selectedTab.tab === "me") {
            if (user !== null && item._id === user._id) {
              return item;
            }
          } else {
            if (user !== null && item.employmentInformation && item.employmentInformation.lineManager && item.employmentInformation.lineManager === user._id || item._id === user._id) {
              return item;
            }
          }
        }).map((item) => {
          return {
            key:
              item.personalInformation.firstName +
              " " +
              item.personalInformation.lastName,
            value: item._id,
          };
        });
        let nonduplicates = removeDuplicates(updatedData, "key");
        let updatedData2 = { ...companyInfo };
        updatedData2["employeeName"] = nonduplicates[0].value;
        updatedData2["employeeNames"] = nonduplicates[0].key;
        updatedData2["okrPeriod"] = OKRperiod[0].value;
        updatedData2["okrYear"] = window.moment(new Date()).format('YYYY');

        if (localStorage.getItem("okrPeriod") === null) {
          localStorage.setItem(
            "okrPeriod",
            JSON.stringify({
              okrPeriod: "Q1"
            })
          );
        }
        if (localStorage.getItem("okrYear") === null) {
          localStorage.setItem(
            "okrYear",
            JSON.stringify({
              okrYear: "2021"
            })
          );
        }
        if (localStorage.getItem("userData") === null) {
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ownerName: updatedData.filter(
                (item) => item.value === updatedData2.employeeName
              )[0].key,
              ownerId: updatedData2.employeeName,
            })
          );
        } else {
          let existingUser =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          if (existingUser !== null) {
            updatedData2["employeeName"] = existingUser.ownerId;
            updatedData2["employeeNames"] = existingUser.ownerName;
          }
        }
        setCompanyInfo(updatedData2);
        setEmpData(nonduplicates.sort(sortAlpha2));
        const finalData = data?.filter((item) => item.employmentInformation.lineManager !== undefined && user._id === item.employmentInformation.lineManager)
        setTotalEmp(data)
        setEmployees(finalData)
        getTask(finalData);

        setLoading(false);
        setError("");
      } else if (data.length === 0) {
        setLoading(employeeLoading);
        setError("No Data Found!");
      } else {
        setLoading(employeeLoading);
        setError(message);
      }
    } catch (error) {
      setLoading(employeeLoading);
      setError(error.toString());
    }
  };
  const sortAlpha2 = (x, y) => {
    if (x.key < y.key) { return -1; }
    if (x.key > y.key) { return 1; }
    return 0;

  }
  const fetchPrivileges = () => {
    try {
      setLoading(true);
      let privileges = getItemFromLocalStorage("privileges");
      setPrivileges(privileges);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const elem1 = useRef()
  const story = [
    {
      component: "tooltip",
      ref: elem1,
      children: (
        <div>
          <p>Here we can check your company activities</p>
        </div>
      )
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <div>
          <p>Thanks {user.name}!</p>

          <p>You have completed The Onboarding Process.</p>
        </div>
      )
    }
  ];
  const getUser = () => {
    let selectedTab =
      localStorage.getItem("selectedTab") !== null
        ? JSON.parse(localStorage.getItem("selectedTab"))
        : null;
    if (selectedTab !== null && selectedTab.tab === "me") {
      history.push("/admin/dashboard/me");
    } else if (selectedTab !== null && selectedTab.tab === "myteam") {
      history.push("/admin/dashboard/myteam");
    }
  };
  useEffect(() => {
    if (elem1.current) {
      setTimeout(() => {
        setIsVisible(location.state ? location.state.isVisible : false)
        window.history.replaceState({ isVisible: false }, document.title)
      }, 200)
    }
  }, [location, elem1])

  const getObjectivesData = () => {
    try {
      setLoading2(true);
      let response = dispatch(getObjectivesDashboard(user._id));
      response.then(({ data, message }) => {
        console.log('data', data)
        setLoading2(false);
        const { totalWeightsPercent } = totalQuartersData(data, { okrYear: 2023 });
        setTotalPercentage(totalWeightsPercent)
      });
    } catch (error) {
      setLoading2(false);
      setError(error.toString());
    }
  };
  const getPerformanceStatus = () => {
    try {
      setLoading2(true);
      let response = dispatch(getReviewChartData());
      response.then(({ data, message }) => {
        setLoading2(false);
        let reducedData = data?.finalData?.length > 0 ? data?.finalData?.map(item => item.count) : []
        setPerformanceData(reducedData)
        setReviewDownloadData((prev) => {
          return {
            ...prev,
            reviews: data?.reviewsData
          }
        })
      });
    } catch (error) {
      setLoading2(false);
      setError(error.toString());
    }
  };

  const getEmpWithRewards = () => {
    try {
      setLoading2(true);
      let response = dispatch(empWithRewards(user._id, user.role, selectTab));
      response.then(({ data, message }) => {
        console.log(data)
        const filterEmpWithRewards = data.filter((emp) => {
          console.log(window.moment().diff(window.moment(emp?.createdAt), 'days'))
          if (period == "Daily") {
            return window.moment().diff(window.moment(emp?.createdAt), 'days') <= 0
          } else if (period == "Weekly") {
            return window.moment().diff(window.moment(emp?.createdAt), 'days') <= 7
          } else if (period == "Monthly") {
            return window.moment().diff(window.moment(emp?.createdAt), 'days') <= 28
          } else {
            // return window.moment().diff(window.moment(emp.createdAt), 'days') <= 365
            return true;
          }
        });
        console.log(filterEmpWithRewards)
        setEmpWithRewards(filterEmpWithRewards)
        if (filterEmpWithRewards?.length > 0) {
          setReviewDownloadData(
            { ...reviewsData, employees: filterEmpWithRewards }
          )
        }
        setLoading2(false);

      });
    } catch (error) {
      setLoading2(false);
      setError(error.toString());
    }
  };

  const handleTab = (tab) => {
    setSelectTab(tab)
    if (tab === 'department') {
      setFinalEmp(empwithRewards)
      const filteredData = empwithRewards.filter((item) => user.department === (item.employmentInformation.department ? item.employmentInformation.department : ''))
      setEmpWithRewards(filteredData)
    } else {
      setEmpWithRewards(finalemp)
    }

  }


  const handleChange = (child) => {
    if (child) {
      setSelectTab('company')
      setPeriod(child.target.value)
    }
  }
  useEffect(() => {
    getTask(employees);
    getEmpWithRewards();
   
  }, [period])
  const getTask = (empData) => {
    if (selectedTab.tab !== "myteam") {
      empData = [user]
    }
    try {
      setLoading(true);
      let response = dispatch(getTasks());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setPeriodData(data)
          let totTasks = 0;
          let completedTasks = 0;
          empData.forEach((item) => {
            data.filter((task) => {
              if (period == "Daily") {
                return window.moment().diff(window.moment(task?.createdAt), 'days') <= 0
              } else if (period == "Weekly") {
                return window.moment().diff(window.moment(task?.createdAt), 'days') <= 7
              } else if (period == "Monthly") {
                return window.moment().diff(window.moment(task?.createdAt), 'days') <= 28
              } else {
                return window.moment().diff(window.moment(task?.createdAt), 'days') <= 365
              }
            }).forEach((itemTask) => {
              itemTask.assignTo.forEach((itemTask2) => {
                if (item._id === itemTask2) {
                  totTasks = totTasks + 1;
                  if (itemTask.status === "completed" || (itemTask.progressStatus && itemTask.progressStatus >= 100)) {
                    completedTasks = completedTasks + 1;
                  }
                }
              });
            });
            const tasksrun = totTasks - completedTasks
            setCompleteTasks(completedTasks);
            setTotalTasks(tasksrun);
          });
        } else if (data.length === 0) {
          setLoading(false);
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
    if (document.getElementById("custom-legend")) {
      document
        .getElementById("custom-legend")
        .addEventListener("mouseout", () => {
          document.getElementsByClassName("custom-legend")[0].style.visibility =
            "hidden";
        });

      document
        .getElementById("custom-legend")
        .addEventListener("mouseover", () => {
          document.getElementsByClassName("custom-legend")[0].style.visibility =
            "visible";
        });
    }
    // Theme: fetch and apply on dashboard load (similar to ThemeSettings fetch flow)
    try {
      const companyId =
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null;
      if (companyId) {
        themeDispatch(loadAndApplyTheme(companyId));
      }
    } catch {}
    getUser();
    fetchPrivileges();
    refreshData();
    getRewards()
    getEmpWithRewards();
    getObjectivesData();
    fetchEmployees();
    getRewardsData();
    if (selectedTab.tab === "myteam") {
      getPerformanceStatus();
      fetchEmployees();
      getFinObjectives();
    }
    //eslint-disable-next-line
  }, []);
  const refreshData = () => {
    try {
      setLoading(true);
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      if (user !== null) {
        let response = dispatch(getObjectivesOCR(user._id));
        response.then(({ data, message }) => {
          if (data.result) {
            setData(data.result);
            setObjectives(data.objectives2);
            let remainingPending = data.objectives2.filter((item) => parseInt(item.percent) !== 100).length;
            console.log("remaing objectives: " + remainingPending)
            setObjectivesRemaining(remainingPending);
            setDataTasks(data.resultTasks);
            setError("");
          
            setLoading(false);
          } else if (data.length === 0) {
            setLoading(false);
          } else {
            setError(message);
            setLoading(false);
          }
        });
        let response2 = dispatch(getObjectivesRewardPoints(user._id, user.role, selectedTab.tab));
        response2.then(({ data, message }) => {
          if (data) {
            let difference = ((Number(data.totalObjectivesPoints) + Number(data.totalKeyResultsPoints) + Number(data.totalTaskPoints) + Number(data.totalSubTaskPoints)) - Number(data.redeemPoints)).toFixed(1);
            setRewardPoints(difference >= 0 ? difference : 0);
            setRewardPoints1(data.rewardPoints);
            setRewardPoints2(data.rewardPoints2);
            setRewardPoints3(data.rewardPoints3);
            setTaskPercentage(data.percentageTask);
            setTaskPercentageAchieved(Number(data.percentageTaskAchieved).toFixed(2));
            setRewardPointsAchieved(data.percentagePointsAchieved);
            setError("");
            setLoading(false);
          } else if (data.length === 0) {
            setLoading(false);
          } else {
            setError(message);
            setLoading(false);
          }
        })
      }
    } catch (error) {
      setError(error.toString());
    }
  };

  const getRewards = () => {
    return { period, empwithRewards, completeTasks, totalTasks, rewardPoints }
  }

  const downloadSheet = () => {
    const data = getRewards();
    if (data) {
      const finalData = data.empwithRewards.map((emp) => {
        let empName = emp.personalInformation.firstName + " " + emp.personalInformation.lastName;
        let email = emp.contactInformation.email;
        return { empName: empName, email, createdAt: emp.createdAt, empRewards: emp.empRewards, status: emp.status, _id: emp._id, completeTasks: data.completeTasks, totalTasks: data.totalTasks, rewardPoints: data.rewardPoints }
      })
      downloadExcel(finalData)
    } else {
      console.log("No data");
    }
  }

  //for csv downloaded data 
  const downloadCSV = () => {
    const data = getRewards();

    if (data) {
      const finalData = data.empwithRewards.map((emp) => {
        let empName =
          emp.personalInformation.firstName +
          " " +
          emp.personalInformation.lastName;
        let email = emp.contactInformation.email;
        return {
          empName,
          email,
          createdAt: emp.createdAt,
          empRewards: emp.empRewards,
          status: emp.status,
          _id: emp._id,
          completeTasks: data.completeTasks,
          totalTasks: data.totalTasks,
          rewardPoints: data.rewardPoints,
        };
      });

      // Convert JSON to CSV
      const csvRows = [];
      const headers = Object.keys(finalData[0]).join(","); // Get CSV headers
      csvRows.push(headers);

      finalData.forEach((row) => {
        const values = Object.values(row)
          .map((value) => `"${value}"`)
          .join(",");
        csvRows.push(values);
      });

      const csvData = csvRows.join("\n");

      // Create CSV file and trigger download
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =  "DashboardActivities" + Date.now() + ".csv"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log("No data");
    }
  };


  const handleCallback = (childData) => {
    setLoading(true);
    let finalDet = {
      ...childData,
      okrYear: Number(companyInfo.okrYear),
      okrPeriod: companyInfo.okrPeriod,
    };
    let response = dispatch(createObjective(finalDet));
    response.then(({ success, message, data }) => {
      if (success) {
        if (data.rewardPoints > 0) {
          setRewardPoints(data.rewardPoints);
          checkCelebration()
        }
        const objectiveStatus = { objectiveStatus: "Create", row: data, companyInfo }
        let response2 = dispatch(updateNotification(data._id, objectiveStatus));
        response2.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setOrderModalShow3(false);
            setError("");
            refreshData();
            setDataLoad({ ...dataLoad, create: true });
          } else {
            setLoading(false);
            setError(message);
            refreshData();
            setDataLoad({ ...dataLoad, create: true });
          }
        }).catch((e) => {
          setLoading(false);
          setOrderModalShow3(false);
          refreshData();
          setDataLoad({ ...dataLoad, update: true });
        });
      } else {
        setLoading(false);
        setError(message);
        refreshData();
        setDataLoad({ ...dataLoad, create: true });
      }
    }).catch((e) => {
      setLoading(false);
      refreshData();
      setDataLoad({ ...dataLoad, update: true });
    });
  };

  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  }
  const remainingTasks = totalTasks > 0 && completeTasks >= 0 ? totalTasks - completeTasks : 0;
  const objectiveSuffix = remainingObjectives > 0 ? 's' : '';

  return (
    <>
      {loading ? <div className="d-flex justify-content-center"><LoadingIndicator /></div> :
        <div className={isMobile ? "dflex" : "d-flex"} >
          <div className={isMobile ? "bg-light-primary rounded-12 mh-100 p-4 col-xs-12 col-sm-12 col-md-12 col-lg-8" : `bg-light-primary rounded-12 mh-100 p-4 col-lg-${privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Leaderboard").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Leaderboard")[0].view ? '8' : '12'}`} >
            <div className="mt-4 d-flex justify-content-between" id="analyticsOverview">
              <div className="">
                <div className="">
                  <p style={{ fontSize: "24px" }}>
                    {t('Dashboard.helloUser', {
                      firstName: AuthUser.firstName,
                      remainingTasks,
                      remainingObjectives,
                      objectiveSuffix
                    })}
                  </p>
                </div>
              </div>
              <div className='d-flex align-items-start'>
                <SelectInput
                  label={t('Dashboard.period')}
                  placeholder="--Select guys--"
                  name="okrPeriod"
                  options={OKRperiodMonths}
                  value={period}
                  onChangeText={handleChange}
                />
                {isMobile && <div className="dropdown actionDropdown">
                  <span
                    className="dropdown-hide align-items-center"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={calendaricon}
                      alt="add form"
                      className="mr-1 mt-1 cursor-pointer"
                    />
                  </span>
                  <div
                    className="dropdown-menu dropdown-menu-right text-left "
                    aria-labelledby="dropdownMenuButton"
                  >
                    <button className="dropdown-item text-capitalize text-left justify-content-start">{t('Dashboard.Monthly')}</button>
                    <button
                      className="dropdown-item text-capitalize text-left justify-content-start"
                    >
                      {t('Dashboard.weekly')}
                    </button>

                    <button
                      className="dropdown-item text-capitalize text-left justify-content-start"
                    >
                      {t('Dashboard.Daily')}
                    </button>

                    <button
                      className="dropdown-item text-capitalize text-left justify-content-start"
                    >
                      {t('Dashboard.Yearly')}
                    </button>
                  </div>
                </div>}
                <div className={isMobile ? "dropdown actionDropdown" : "dropdown ml-4 pt-minus-1"}>
                  <span
                    className="dropdown-hide align-items-center"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={Add}
                      alt="add form"
                      className="mr-1 mt-1 cursor-pointer"
                    />
                  </span>
                  <div
                    className="dropdown-menu dropdown-menu-right text-left "
                    aria-labelledby="dropdownMenuButton"
                  >
                    <button className="dropdown-item text-capitalize text-left justify-content-start" onClick= {downloadCSV}>
                      {t('Dashboard.csv')}
                    </button>
                    <button
                      className="dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => window.print()}
                    >
                      {t('Dashboard.pdf')}
                    </button>
                    <button
                      className="dropdown-item text-capitalize text-left justify-content-start"
                      onClick={downloadSheet}
                    >
                      {t('Dashboard.excel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Taskpercent
              data1={data1}
              data2={data2}
              data3={data3}
              data4={data4}
              rewardPoints={rewardPoints}
              totalTasks={totalTasks}
              completedTasks={completeTasks}
              role={user.role}
              tab={selectedTab.tab}
              privileges={privileges}
              taskPercent={taskPercent}
              taskPercentAchieved={taskPercentAchieved}
              rewardPointsAchieved={rewardPointsAchieved}
            />
            <div id="okrProgress">
              {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - OKR Progress").length > 0 && (privileges.filter(privilege => privilege.page === "Dashboard - OKR Progress")[0].view || privileges.filter(privilege => privilege.page === "Dashboard - Remaining vs Achieved")[0].view) && <div className={isMobile ? 'd-block' : 'd-flex justify-content-between flex-wrap mt-3 mb-3'} >
                {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - OKR Progress").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - OKR Progress")[0].view && <Card2 isMobile={isMobile} className="pie">
                  <Heading title={t("Dashboard.progress")} data={user.role === 'HR Admin' ? objectives : data} employees={totalEmp} setOrderModalShow3={setOrderModalShow3} />
                  <div className="d-flex justify-content-center">
                    <div className="col-md-6 text-center">
                      <div className="d-flex justify-content-center ">
                        <h5 className="chart-heading">{totalPercentage > 0 ? totalPercentage + "%" : "OKR"}</h5>
                        <PieChart />
                      </div>
                    </div>
                  </div>
                </Card2>}
                {selectedTab.tab === "myteam" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Performance Form Review Status").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Performance Form Review Status")[0].view && <Card2 isMobile={isMobile} className="pie">
                  <Heading2 title={t("Dashboard.perfom")} data={reviewsData} employees={totalEmp} objectives={finalObj} />
                  <div className="d-flex justify-content-center">
                    <div className="text-center">
                      <div className="d-flex justify-content-center ">
                        <PerformancePieChart performanceData={performanceData} />
                      </div>
                    </div>
                  </div>
                </Card2>}
                {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Remaining vs Achieved").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Remaining vs Achieved")[0].view && <Card2 isMobile={isMobile} graph={"graph"} height={'600px'}>
                  <Heading title={t("Dashboard.remvsAch")} data={data} employees={employees} />
                  <div style={{ height: '320px' }}>
                    <StackChart data={data} labels={['Remaining', 'Achieved']} /></div>
                </Card2>}
                {selectedTab.tab === "myteam" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Performance Form Review Status").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Performance Form Review Status")[0].view && <Card2 isMobile={isMobile} graph={"graph"} height={'600px'}>
                  <Heading2 title={"Dashboard.employees"} data={reviewsData} employees={totalEmp} objectives={finalObj} />
                  <div style={{ height: '320px' }}>
                    <StackChartEmployee data={reviewsData} employees={totalEmp} labels={['Remaining', 'Achieved']} /></div>
                </Card2>}
              </div>}
            </div>

            {user.role !== "Employee" && selectedTab.tab === "myteam" && <div className={isMobile ? 'd-block' : 'd-flex justify-content-between cards mt-3 mb-3'} id="okrProgress" >
              <CardChat isMobile={isMobile}>
                <Heading title={t("Dashboard.summary")} data={data} employees={employees} />
                <div>
                </div>
                <div className={isMobile ? "d-flex" : "d-flex custom-legend-bottom justify-content-center"}>
                  <CustomLegend title={t("Dashboard.Negative")} color="red" />
                  <CustomLegend title={t("Dashboard.Neutral")} color="orange" />
                  <CustomLegend title={t("Dashboard.Positive")} color="green" />
                </div>
                <SliderBarReviews />
              </CardChat>
            </div>}
            <ScheduleCalendar />
            {loading ? <LoadingIndicator /> : (privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual").length > 0 && (privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual")[0].view || privileges.filter(privilege => privilege.page === "Birthday Widget")[0].view || privileges.filter(privilege => privilege.page === "Anniversary Widget")[0].view) && <div className={isMobile ? 'mt-5' : 'mt-5'} id="celebrationList">
              <div className={isMobile ? 'd-block' : 'd-flex justify-content-between flex-wrap cards mt-3 mb-3'} >
                {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual")[0].view && selectedTab.tab === "myteam" &&
                  <div className={isMobile ? 'col-12 p-0 mt-2' : 'col-6 mt-2'}>
                    <div className="card1 ">
                      <Heading title={t("Dashboard.efforts")} data={dataTasks} employees={employees} />
                      <StackChart data={dataTasks} labels={['Estimated', 'Actual']} />
                      <div className={isMobile ? "d-flex" : "d-flex custom-legend-bottom"}>
                        <CustomLegend title={t("Dashboard.Estimated")} color="orange" />
                        <CustomLegend title={t("Dashboard.Actual")} color="green" />
                      </div>
                    </div>
                  </div>

                }
                {selectedTab.tab === "myteam" && privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Estimated vs Actual")[0].view &&
                  <div className={isMobile ? 'col-12 p-0 mt-2' : 'col-6 mt-2'}>
                    <div className="card1 ml-0">
                      <Heading title={t("Dashboard.objectiveStatus")} data={data} employees={employees} />
                      <StackChart className="mt-4 pt-4" data={data} employees={employees} objectives={objectives} labels={['Objectives Status', 'Employees']} />
                      <div className={isMobile ? "d-flex" : "d-flex custom-legend-bottom "}>
                      </div>
                    </div>
                  </div>
                }
                {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Birthday Widget").length > 0 && privileges.filter(privilege => privilege.page === "Birthday Widget")[0].view && <div className={isMobile ? 'col-12 p-0 mt-2' : 'col-6 mt-2'}>
                  <div className="card2">
                    <p className='event-title'>{t("Dashboard.birthday")}</p>
                    <div className=''>
                      <Birthdayevent />
                    </div>
                  </div>
                </div>}
                {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Anniversary Widget").length > 0 && privileges.filter(privilege => privilege.page === "Anniversary Widget")[0].view &&
                  <div className={isMobile ? 'col-12 mt-2 p-0' : 'col-6 mt-2 '}>
                    <div className="card2">
                      <p className='event-title'>{t("Dashboard.anniversary")}</p>
                      <div className=''>
                        <Anniversaryevent />
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>)}

          </div>
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Leaderboard").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Leaderboard")[0].view &&
            <div className={`right-bar col-xs-12 col-sm-12 col-md-4 col-lg-4 ${isMobile ? 'p-4 col-md-12' : ''}`} id="leaderBoard">
              <div className="area" >
                <p className="mt-4" style={{ fontSize: "20px" }}>{t("Dashboard.leader")}</p>
                {empwithRewards.length > 0 && empwithRewards[0].rewardPoints > 0 && <div className="feed-card mt-4 mb-4">
                  <div className='d-flex'>
                    <div className='pic2 ml-4'>
                      {empwithRewards.length > 0 && <img className="profilelogo2 rewardCup2" src={empwithRewards.length > 0 && empwithRewards[0].personalInformation.profilePicture ? empwithRewards[0].personalInformation.profilePicture : "https://www.clipartmax.com/png/middle/103-1038880_user-rubber-stamp-female-user-icon.png"} alt="profpic" />}
                    </div>
                    <div className=''>
                      <div className="dash-profile ml-3">
                        <h3 className="card-head2 d-flex pb-8">{empwithRewards.length > 0 ? empwithRewards[0].personalInformation.firstName + " " + empwithRewards[0].personalInformation.lastName : "Jason W"}</h3>
                        <h3 className="card-content">{empwithRewards.length > 0 ? empwithRewards[0].employmentInformation.designation : "UX/UI Designer"}</h3>
                      </div>
                    </div>
                    <div className={isMobile ? "cup-mobile" : `${selectTab === 'department' ? 'cup' : 'cup'}`}>
                      <ShowCup empwithRewards={empwithRewards} rewardPoints1={rewardPoints1} rewardPoints2={rewardPoints2} />
                    </div>
                  </div>
                </div>}
                <div className='d-flex'>
                  <p className={`nav1 mb-0 cursor-pointer ${selectTab === 'company' ? 'activeLink' : ''}`} onClick={() => handleTab('company')}>{t("Dashboard.company")}</p>
                  <p className={`nav1 mb-0 cursor-pointer ml-5 ${selectTab === 'department' ? 'activeLink' : ''}`} onClick={() => handleTab('department')}>{user.department}</p>
                </div>

                {loading2 ? <div className="mt-4 text-center"><LoadingIndicator size="2" /></div> : (empwithRewards.length > 0 && empwithRewards[0].rewardPoints > 0 ?
                  <>
                    <div className='d-flex justify-content-between mt-4'>
                      <p className="nav2 m-0">{t("Dashboard.5places")}</p>
                    </div>
                    <div className=''>
                      <Accountdepartment data={empwithRewards} />
                    </div>
                    <ul className="circles">
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
                  </> : <div className="feed-card mt-4 mb-4">
                    <div className='d-flex'>
                      <div className='pic2 ml-4'>
                        {empwithRewards.length > 0 && <img className="profilelogo2 rewardCup2" src={empwithRewards.length > 0 && empwithRewards[0].personalInformation.profilePicture ? empwithRewards[0].personalInformation.profilePicture : "https://www.clipartmax.com/png/middle/103-1038880_user-rubber-stamp-female-user-icon.png"} alt="profpic" />}
                      </div>
                      <div className=''>
                        <div className="dash-profile ml-3">
                          <div className="card-head2 d-flex pb-8"></div>
                          <div className="card-content"></div>
                        </div>
                      </div>
                      <div className={isMobile ? "cup-mobile" : `${selectTab === 'department' ? 'cup' : 'cup'}`} style={{ marginLeft: "60%" }}>
                        <img className="mt-4 rewardCup" src={cup} alt="cup" />
                      </div>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: "16px" }}>{t("Dashboard.placesM")}</p>
                {/* rewards */}

                <div className="" style={{ zIndex: 9 }}>
                  {loading ? <LoadingIndicator /> : (rewardsData.length > 0 && rewardsData.slice(0, 2).map((reward, index) => (
                    <div className={`card2 ml-1  p-2 mt-2 mb-2 bg-light cursor-pointer`} onClick={() => {
                      history.push("/admin/rewards/rewardsRedemption")
                    }}>
                      <div className="d-flex">
                        <div className="d-flex justify-content-center">
                          <img src={reward.rewardIcon} alt="reward logo" className="rewardlogo-dashboard" />
                        </div>
                        <div className="d-flex flex-column">
                          <h3 className="rewardtitle m-0">{reward.rewardName}</h3>
                          <p className="text-dark pb-0 pl-2">{reward.rewardPoints}</p>
                        </div>
                      </div>
                      <hr className="m-0" />
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <p className="text-green font-weight-bold m-0">{reward.rewardCode}</p>
                        <p className="text-default m-0">{reward.rewardType}</p>
                      </div>
                      {reward.status !== "pending" && <p className={`text-uppercase m-0 text-${reward.status === "approved" ? 'success' : 'warning'}`}>{reward.status}</p>}
                    </div>
                  )))}
                  <Link to="/admin/rewards/rewardsRedemption">{t("Dashboard.allRewards")}</Link>
                </div>
              </div >
            </div>}
        </div>}

      {isMobile &&
        <div>
          <MobileFooter />
        </div>
      }
      <UserOnboarding
        story={location.state ? story : []}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />

      <ObjectivesCreatePopup
        show={orderModalShow3}
        onHide={() => setOrderModalShow3(false)}
        handlecallback={handleCallback}
        refresh={dataLoad}
        ownerDet={empData}
        employeeName={companyInfo.employeeName}
        okrYear={Number(companyInfo.okrYear)}
        okrPeriod={companyInfo.okrPeriod}
        loading={loading}
        show1={0}
        handleOpenPopup={() => { }}
      />
    </>
  );
}
