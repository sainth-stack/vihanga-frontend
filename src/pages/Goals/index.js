/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { Cards } from "./Cards";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import SelectInput from "components/Company/SelectInput";
import {
  AuthRole,
  AuthUser,
  OKRperiod,
  OKRYear,
  removeDuplicates,
} from "utilities";
import "./styles.scss";
import ObjectivesCreatePopup from "./ObjectivesCreatePopup";
import UserOnboarding from "react-user-onboarding";
import ObjectivesTable from "./ObjectivesTable";
import { useDispatch } from "react-redux";
import { updateNotificationGoal } from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import ObjectivesFooter from "components/DashboardComponents/ObjectivesFooter";
import download from "assets/svg/download.svg";
import cascadeIcon from "assets/svg/cascadeIcon.svg";
import { setThreshold } from "reducer/userSlice";
import useGetEmployees, { useGetThresholds } from "./hooks/useGetEmployees";
import KRPopup from "./KRPopup";
import { createObjective } from "action/GoalsAct";
import { useQueryClient } from '@tanstack/react-query';
export default function Goals() {
  let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  let selectedTab = localStorage.getItem("selectedTab") !== null ? JSON.parse(localStorage.getItem("selectedTab")) : null;
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
    create: false
  })
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false)
  const [openKRPopup, setOpenKRPopup] = useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const isMobile = useWindowSize();
  const [, setGif] = useState(false);
  const [, setGifLoad] = useState("");
  const [, setObjectives] = useState([])
  const [btn,] = useState(false)

  const queryClient = useQueryClient();
  const tour = localStorage.getItem("showObjTour")
  const { data: employeeResponse, isLoading: employeeLoading } = useGetEmployees();
  const { data: okrTabResponse, isLoading: okrTabLoading, error: okrTabError } = useGetThresholds();
  const [data1, setData1] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );
  const elem1 = useRef();
  const elem2 = useRef();
  const elem3 = useRef();
  const elem4 = useRef();
  const elem5 = useRef()
  const elem6 = useRef()
  let story = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem1,
      children: (
        <div>
          <p>Click here to add objectives</p>
        </div>
      )
    },
  ];
  let story1 = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem1,
      children: (
        <div>
          <p>Click here and select edit option to update the objective</p>
        </div>
      )
    },
  ];
  let story2 = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem1,
      children: (
        <div>
          <p>Here we can get the submit option for approval once you complete the objectives and keyresults 100%.</p>
        </div>
      )
    }
  ];
  let story3 = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem1,
      children: (
        <div>
          <p>Click here and select addkr option to add kr to the objective</p>
        </div>
      )
    }
  ];
  let story4 = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem4,
      children: (
        <div>
          <p>Click here and select addkr option to add kr to the objective</p>
        </div>
      )
    }
  ];
  let story5 = [
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem5,
      children: (
        <div>
          <p>Click here and create non-library objective</p>
        </div>
      )
    },
    {
      component: "tooltip",
      className: 'tooltip1',
      ref: elem6,
      children: (
        <div>
          <p>Click here and create non-library objective</p>
        </div>
      )
    },
  ];
  const [data2, setData2] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );
  const [data3, setData3] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );
  const [data4, setData4] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );
  useEffect(() => {
    if (elem1.current) {
      setTimeout(() => {
        setIsVisible(location.state ? location.state.isVisible : false)
        window.history.replaceState({ isVisible: false }, document.title)
      }, 500)
    }
  }, [location.state, elem1.current])

  const [data5, setData5] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );
  const handleCallback4 = () => {
    setIsVisible(false)
  }
  const [data6, setData6] = useState(
    {
      datasets: [{
        label: 'My First Dataset',
        data: [0, 0],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'white',
        ],
        hoverOffset: 4,
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }]
    }
  );

  const sortAlpha2 = (x, y) => {
    if (x.key < y.key) { return -1; }
    if (x.key > y.key) { return 1; }
    return 0;

  }
  const fetchEmployees = () => {
    try {
      setLoading(employeeLoading);
      const { data = [], message, success } = employeeResponse;
      if (data !== undefined && data.length > 0) {
        let updatedData = data.filter(item => {
          if (selectedTab !== null && selectedTab.tab === "me") {
            if (user !== null && item._id === user._id) {
              return item;
            }
          } else if (selectedTab !== null && selectedTab.tab === "myteam" && (AuthRole === "HR Admin" || AuthRole === "Super Admin")) {
            if (user !== null && item.employmentInformation) {
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
        setEmpData(nonduplicates.sort(sortAlpha2))
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
  // console.log(companyInfo);
  useEffect(() => {
    fetchEmployees();
    getOkrTab();
    //eslint-disable-next-line
  }, [employeeResponse, okrTabResponse]);

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
          okrPeriod: value
        })
      );
    }
    if (name === "okrYear") {
      localStorage.setItem(
        "okrYear",
        JSON.stringify({
          okrYear: value
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
    response.then(({ success, message, data }) => {
      if (success) {
        if (data.rewardPoints > 0) {
          setRewardPoints(data.rewardPoints);
          checkCelebration()
        }
        const objectiveStatus = { objectiveStatus: "Create", row: data, companyInfo }
        let response2 = dispatch(updateNotificationGoal(data._id, objectiveStatus));
        response2.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setRefresh(true);
            setDataLoad({ ...dataLoad, create: true });
            setOrderModalShow3(false);
            setError("");
            queryClient.invalidateQueries("goals");
          } else {
            setDataLoad({ ...dataLoad, create: true });
            setLoading(false);
            setError(message);
          }
        }).catch((e) => {
          setLoading(false);
          setDataLoad({ ...dataLoad, update: true });
          setOrderModalShow3(false);
        });
      } else {
        setDataLoad({ ...dataLoad, create: true });
        setLoading(false);
        setError(message);
      }
    }).catch((e) => {
      setLoading(false);
      setDataLoad({ ...dataLoad, update: true });
    });
  };
  const getData = (data) => {
    if (data.length > 0) {
      const completeProgress = data.filter((ele, index) => {
        if (ele.progressStatus === 100) {
          return ele.children.filter((child, ind) => {
            return Number(child.percent) === 100;
          })
        }
      });
      if ((data.length - completeProgress.length) === 0) {
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
  }
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  }
  const handleCallback1 = (childData) => {
    setObjectives(childData)
  }
  const getStory = () => {
    if (location.state.story === 'story') {
      story2 = story1 = []
      return story
    }
    else if (location.state.story === 'story1') {
      story = story2 = []
      return story1
    }
    else if (location.state.story === 'story2') {
      story = story3 = []
      return story2
    }
    else if (location.state.story === 'story3') {
      story = story2 = []
      return story3
    }
    else if (location.state.story === 'story4') {
      story = story2 = []
      return story4
    }
  }
  const getOkrTab = () => {
    try {
      setLoading(okrTabLoading);
      let { data = [] } = okrTabResponse;
      if (data !== undefined && data.length > 0) {
        let updatedThreshold = [{
          highValueRange: data[0].highValueRange,
          midValueRange: data[0].midValueRange,
          lowValueRange: data[0].lowValueRange,
        }]
        setLoading(okrTabLoading);
        dispatch(setThreshold(updatedThreshold))
      } else {
        console.log("Error", okrTabError)
        setLoading(okrTabLoading);
        setError(okrTabError);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleOpenPopup = (state) => {
    setOpenKRPopup(true);
    setUpdateObj(state.data);
    setOrderModalShow3(false);
  }

  let trackingStatus = "";
  let progressValue2 = data2 && data2.datasets.length > 0 && data2.datasets[0].data.length > 0 && data2?.datasets[0]?.data[0];
  if (progressValue2 > 0 && progressValue2 <= 60) {
    trackingStatus = "off track"
  } else if (progressValue2 > 60 && progressValue2 <= 80) {
    trackingStatus = "at risk"
  } else if (progressValue2 > 80) {
    trackingStatus = "on track"
  }

  return (
    <>
      <div className={showGif ? "gif" : "dgif"}>
        <img src={LottieConfettie} className={isMobile ? "mob-lottie-img col-12 h-50" : "lottie-img"} alt="LottieConfettie" />
        <br />
        <h3>You have earned {rewardPoints} reward points</h3>
      </div>
      <TitleHeader name="Objectives" />
      <div className={`rounded-12 mh-100 ${isMobile ? 'p-1 m-1' : 'bg-light-primary p-4 m-4'}`}>
        <div className={`d-flex justify-content-between align-items-center ${isMobile ? '' : 'pb20'}`}>
          {!isMobile && <p className={`title text-dark font-weight-bold`}>Hello {AuthUser.name}!, Your goals are {trackingStatus} to be completed by the due date!</p>}
        </div>
        <div className={isMobile ? "" : "company-form"}>
          <div className="container">
            <div className={isMobile ? "company-form-mobile" : "row"} id="okrSummary">
              {isMobile &&
                <div className='d-flex justify-content-between'>
                  <p className={`title text-dark font-weight-bold ${isMobile ? '' : 'pb20'}`}>Hello {AuthUser.name}!, Your objectives are {trackingStatus} to be completed by the due date!</p>
                  <div>
                    <img src={cascadeIcon} className="pr-2" alt="cascadeIcon" height="40" />
                    <img src={download} alt="download" />
                  </div>
                </div>
              }
              <div className={`${isMobile ? 'm-0 p-0' : 'col-lg'}`}>
                <SelectInput
                  label="Employee Name"
                  placeholder="--Select--"
                  name="employeeName"
                  options={empData}
                  value={companyInfo.employeeName}
                  onChangeText={(e) => {
                    handleChange(e);
                    localStorage.setItem(
                      "userData",
                      JSON.stringify({
                        ownerName: e.target.label,
                        ownerId: e.target.value,
                      })
                    );
                  }}
                  disabled={isAvailable}
                />
              </div>
              <div className={`${isMobile ? 'm-0 p-0' : 'col-lg'}`}>

                <SelectInput
                  label="OKR Period"
                  placeholder="--Select--"
                  name="okrPeriod"
                  options={OKRperiod}
                  value={companyInfo.okrPeriod}
                  onChangeText={handleChange}
                  disabled={isAvailable}
                />
              </div>
              <div className={`${isMobile ? 'm-0 p-0' : 'col-lg'}`}>

                <SelectInput
                  label="OKR Year"
                  placeholder="--Select--"
                  name="okrYear"
                  options={OKRYear}
                  value={companyInfo.okrYear}
                  onChangeText={handleChange}
                  disabled={isAvailable}
                />
              </div>
            </div>
            <div className={isMobile ? "company-form-mobile mt-4" : ""}>
              <Cards data1={data1} data2={data2} data3={data3} data4={data4} data5={data5} data6={data6} companyInfo={companyInfo} />
            </div>
            <div id="report">
              {companyInfo.employeeName.length > 0 && (
                <ObjectivesTable
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
            </div>
          </div>
          <ObjectivesCreatePopup show={orderModalShow3} onHide={() => setOrderModalShow3(false)} handlecallback={handleCallback} refresh={dataLoad} ownerDet={empData} employeeName={companyInfo.employeeName} okrYear={Number(companyInfo.okrYear)} okrPeriod={companyInfo.okrPeriod} loading={loading} show1={tour ? 1 : 0} handleOpenPopup={handleOpenPopup} />
        </div>
        {isMobile && <div>
          <ObjectivesFooter />
        </div>}
        {openKRPopup && (
          <KRPopup
            show={openKRPopup}
            onHide={() => setOpenKRPopup(false)}
            data={updateObj}
          />
        )}
        <UserOnboarding
          story={btn ? story5 : (location.state ? getStory() : [])}
          isVisible={isVisible}
          onClose={() => {
            setIsVisible(false);
            localStorage.setItem("showObjTour", false);
          }
          }
        />
      </div>
    </>
  );
}
