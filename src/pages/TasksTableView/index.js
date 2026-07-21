/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { Cards } from "./Cards";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { OKRperiod, removeDuplicates } from "utilities";
import "./styles.scss";
import ObjectivesCreatePopup from "./ObjectivesCreatePopup";
import TasksTable from "./TasksTable";
import { useDispatch } from "react-redux";
import { getEmployees } from "action/EmployeeAct";
import { createObjective } from "action/UserAct";
import { updateNotification } from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import { getAllOkrTab } from "action/OKRTabAct";
import { setThreshold } from "reducer/userSlice";
import LottieConfettie from "assets/images/LottieConfettie.gif";
export default function Objectives() {
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
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
  const [, setError] = useState(false);
  const [isAvailable] = useState(false);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [orderModalShow5, setOrderModalShow5] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [dataLoad, setDataLoad] = useState({
    update: false,
    create: false,
  });
  const location = useLocation();
  const [, setIsVisible] = useState(false);
  const isMobile = useWindowSize();
  const [, setGif] = useState(false);
  const [, setGifLoad] = useState("");
  const [objectives, setObjectives] = useState([]);
  const tour = localStorage.getItem("showObjTour");
  const [, setData1] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });
  const elem1 = useRef();
  const elem2 = useRef();
  const elem3 = useRef();
  const elem4 = useRef();
  const elem5 = useRef();
  const elem6 = useRef();
  let story = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem1,
      children: (
        <div>
          <p>Click here to add objectives</p>
        </div>
      ),
    },
  ];
  let story1 = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem1,
      children: (
        <div>
          <p>Click here and select edit option to update the objective</p>
        </div>
      ),
    },
  ];
  let story2 = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem1,
      children: (
        <div>
          <p>
            Here we can get the submit option for approval once you complete the
            objectives and keyresults 100%.
          </p>
        </div>
      ),
    },
  ];
  let story3 = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem1,
      children: (
        <div>
          <p>Click here and select addkr option to add kr to the objective</p>
        </div>
      ),
    },
  ];
  let story4 = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem4,
      children: (
        <div>
          <p>Click here and select addkr option to add kr to the objective</p>
        </div>
      ),
    },
  ];
  let story5 = [
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem5,
      children: (
        <div>
          <p>Click here and create non-library objective</p>
        </div>
      ),
    },
    {
      component: "tooltip",
      className: "tooltip1",
      ref: elem6,
      children: (
        <div>
          <p>Click here and create non-library objective</p>
        </div>
      ),
    },
  ];
  const [data2, setData2] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });
  const [data3, setData3] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });
  const [data4, setData4] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });
  useEffect(() => {
    if (elem1.current) {
      setTimeout(() => {
        setIsVisible(location.state ? location.state.isVisible : false);
        window.history.replaceState({ isVisible: false }, document.title);
      }, 500);
    }
  }, [location, objectives, elem1.current]);

  const [data5, setData5] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });
  const handleCallback4 = () => {
    setIsVisible(false);
  };
  const [data6, setData6] = useState({
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 0],
        backgroundColor: ["rgb(255, 99, 132)", "white"],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      },
    ],
  });

  const sortAlpha2 = (x, y) => {
    if (x.key < y.key) {
      return -1;
    }
    if (x.key > y.key) {
      return 1;
    }
    return 0;
  };
  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data
            .filter((item) => {
              if (selectedTab !== null && selectedTab.tab === "me") {
                if (user !== null && item._id === user._id) {
                  return item;
                }
              } else {
                if (
                  (user !== null &&
                    item.employmentInformation &&
                    item.employmentInformation.lineManager &&
                    item.employmentInformation.lineManager === user._id) ||
                  item._id === user._id
                ) {
                  return item;
                }
              }
            })
            .map((item) => {
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
          updatedData2["okrYear"] = window.moment(new Date()).format("YYYY");

          if (localStorage.getItem("okrPeriod") === null) {
            localStorage.setItem(
              "okrPeriod",
              JSON.stringify({
                okrPeriod: "Q1",
              })
            );
          }
          if (localStorage.getItem("okrYear") === null) {
            localStorage.setItem(
              "okrYear",
              JSON.stringify({
                okrYear: "2021",
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
  useEffect(() => {
    fetchEmployees();
    getOkrTab();
    //eslint-disable-next-line
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    const empName = empData.filter((item) => item.value === value);
    let updatedData = { ...companyInfo };
    updatedData[name] = value;
    if (name === "employeeName") {
      updatedData["employeeNames"] = empName[0].key;
    }
    if (name === "okrPeriod") {
      localStorage.setItem(
        "okrPeriod",
        JSON.stringify({
          okrPeriod: value,
        })
      );
    }
    if (name === "okrYear") {
      localStorage.setItem(
        "okrYear",
        JSON.stringify({
          okrYear: value,
        })
      );
    }
    setCompanyInfo(updatedData);
    setError("");
  };

  const handleCallback = (childData) => {
    setLoading(true);
    let finalDet = {
      ...childData,
      okrYear: Number(companyInfo.okrYear),
      okrPeriod: companyInfo.okrPeriod,
    };
    let response = dispatch(createObjective(finalDet));
    response
      .then(({ success, message, data }) => {
        if (success) {
          if (data.rewardPoints > 0) {
            setRewardPoints(data.rewardPoints);
            checkCelebration();
          }
          const objectiveStatus = {
            objectiveStatus: "Create",
            row: data,
            companyInfo,
          };
          let response2 = dispatch(
            updateNotification(data._id, objectiveStatus)
          );
          response2
            .then(({ success, message }) => {
              if (success) {
                setLoading(false);
                setRefresh(true);
                setDataLoad({ ...dataLoad, create: true });
                setOrderModalShow3(false);
                setError("");
              } else {
                setDataLoad({ ...dataLoad, create: true });
                setLoading(false);
                setError(message);
              }
            })
            .catch((e) => {
              setLoading(false);
              setDataLoad({ ...dataLoad, update: true });
              setOrderModalShow3(false);
            });
        } else {
          setDataLoad({ ...dataLoad, create: true });
          setLoading(false);
          setError(message);
        }
      })
      .catch((e) => {
        setLoading(false);
        setDataLoad({ ...dataLoad, update: true });
      });
  };
  const getData = (data) => {
    if (data.length > 0) {
      let totalRewardPoints = data.reduce((prev, current) => {
        let childPoints =
          current.children.length > 0
            ? current.children.reduce((prevv, curr) => {
                return prevv + curr.rewardPoints;
              }, 0)
            : 0;
        return prev + Number(current.rewardPoints) + Number(childPoints);
      }, 0);
      const completeProgress = data.filter((ele, index) => {
        return ele.progressStatus == 100;
      });
      if (data.length - completeProgress.length === 0) {
        setRewardPoints(totalRewardPoints);
        setGif(true);
        setTimeout(() => {
          setGif(false);
          localStorage.setItem("gifLoad", true);
        }, 5000);
        const gifLoad = localStorage.getItem("gifLoad");
        setGifLoad(gifLoad);
      } else {
        setGif(false);
        localStorage.setItem("gifLoad", false);
      }
    }
  };
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  };
  const handleCallback1 = (childData) => {
    setObjectives(childData);
  };
  const getStory = () => {
    if (location.state.story === "story") {
      story2 = story1 = [];
      return story;
    } else if (location.state.story === "story1") {
      story = story2 = [];
      return story1;
    } else if (location.state.story === "story2") {
      story = story3 = [];
      return story2;
    } else if (location.state.story === "story3") {
      story = story2 = [];
      return story3;
    } else if (location.state.story === "story4") {
      story = story2 = [];
      return story4;
    }
  };
  const getOkrTab = () => {
    try {
      let response = dispatch(getAllOkrTab());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedThreshold = [
            {
              highValueRange: data[0].highValueRange,
              midValueRange: data[0].midValueRange,
              lowValueRange: data[0].lowValueRange,
            },
          ];
          dispatch(setThreshold(updatedThreshold));
        }
      });
    } catch (error) {
      console.log(error);
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
      <div className={isMobile ? "" : "company-form2"}>
        {companyInfo.employeeName.length > 0 && (
          <TasksTable
            refresh={refresh}
            refresh2={dataLoad}
            ownerDet={empData}
            orderModalShow3={orderModalShow3}
            orderModalShow5={orderModalShow5}
            setOrderModalShow3={(status) => setOrderModalShow3(status)}
            setOrderModalShow5={(status) => setOrderModalShow5(status)}
            companyInfo={companyInfo}
            setDataWeights={(data) => setData1(data)}
            setDataWeightsPercent={(data) => setData2(data)}
            setDataQ1={(data) => setData3(data)}
            setDataQ2={(data) => setData4(data)}
            setDataQ3={(data) => setData5(data)}
            setDataQ4={(data) => setData6(data)}
            getdatafromtable={getData}
            forwardedRef={elem1}
            forwardedRef2={elem2}
            forwardedRef3={elem3}
            forwardedRef4={elem4}
            forwardedRef5={elem5}
            forwardedRef6={elem6}
            handlecallback={handleCallback1}
            handleCallback2={handleCallback4}
          />
        )}
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
          show1={tour ? 3 : 0}
        />
      </div>
    </>
  );
}
