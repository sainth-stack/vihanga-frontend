/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import SliderLarge from "components/SliderLarge";
import { Toast } from "../../service/toast";
import { Dimensions, LoadingIndicator } from "utilities";
import { useDispatch, useSelector } from "react-redux";
import { createObjective, getObjectives } from "action/UserAct";
import { updateNotification } from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { useScrollTo } from "react-use-window-scroll";
import RewardPointsComponent from "components/RewardPoints";
import { t } from "i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      firstName: data[i].personalInformation.firstName || "",
      lastName: data[i].personalInformation.lastName || "",
      designation: data[i].employmentInformation.designation || null,
      email: data[i].contactInformation.email || "",
      department: data[i].employmentInformation.department || "",
      grade: data[i].employmentInformation.grade || "",
      personalInformation: data[i].personalInformation || "",
      employmentInformation: data[i].employmentInformation || "",
      contactInformation: data[i].contactInformation || "",
      status: data[i].employmentInformation.status,
    });
  }
  return items;
};

export default function ObjectivesCreatePopup(props) {
  let threshold = useSelector((store) => store.user.threshold);
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [showGif, setShowGif] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showAttachment, setShowAttachment] = useState(true);
  const scrollTo = useScrollTo();
  const el = useRef();
  const [objective, setObjective] = useState({
    objective: "",
    dueDate: null,
    weight: "",
    owner: props.employeeName,
    successMetrics: "",
    progressStatus: 0,
    comments: "",
    feedAttachment: "",
    employeeReferenceId: null,
    employeeName: "",
    dimension: "",
  });
  const [objective2, setObjective2] = useState(0);
  const [refresh, setRefresh] = useState(true);
  if (refresh) {
    setObjective({
      employeeReferenceId: props.employeeName,
    });
    setRefresh(false);
  }
  useEffect(() => {
    let tour = localStorage.getItem("showObjTour");
    if (tour === "true") {
      setObjective2(1);
    }
  });
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState(false);
  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...objective };
    updatedData[name] = value;
    setObjective(updatedData);
    setError("");
  };
  const nextButton = () => {
    localStorage.setItem("showObjTour", false);
    if (objective2 === 3) {
      el.current.scrollIntoView({ behavior: "auto", block: "end" });
      scrollTo(1000, 0);
    }
    setObjective2(objective2 + 1);
  };
  const prevButton = () => {
    localStorage.setItem("showObjTour", false);
    setObjective2(objective2 - 1);
  };
  const handleSave = () => {
    let det = {
      ...objective,
      owner: props.ownerDet.filter(
        (item) => item.value === props.employeeName
      )[0].key,
      employeeReferenceId: props.employeeName,
      totalWeight: data + Number(objective.weight),
      employeeName: props.ownerDet.filter(
        (item) => item.value === props.employeeName
      )[0].key,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    if (!det.objective || !det.weight || !det.dimension) {
      let message = "Please fill required fields";
      Toast({ type: "error", message, time: 5000 });
    } else if (det.weight >= 1 && det.weight <= 100) {
      props.handlecallback(det);
    } else {
      let message = "Total Weight must not exceed 100";
      Toast({ type: "error", message, time: 5000 });
    }
  };

  const fetchObjectives = () => {
    try {
      setLoading(true);
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      if (user !== null) {
        let response = dispatch(getObjectives(user.role));
        response.then(({ data, privileges, message }) => {
          if (privileges && privileges.length > 0) {
            setPrivileges(privileges[0].privileges);
          }
          if (data !== undefined && data.length > 0) {
            let existingUser =
              localStorage.getItem("userData") !== null
                ? JSON.parse(localStorage.getItem("userData"))
                : null;
            let filteredData = data.filter(
              (item) =>
                item.employeeName ===
                (existingUser !== null
                  ? existingUser.ownerName
                  : props.companyInfo.employeeNames)
            );
            let result = filteredData.map((item) => {
              return item.weight;
            });
            const sum =
              result.length > 0
                ? result.map((datum) => datum).reduce((a, b) => a + b)
                : 0;
            setData(sum);
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
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleSaveKr = () => {
    window.scrollTo(0, 100);
    let det = {
      ...objective,
      owner: props.ownerDet.filter(
        (item) => item.value === props.employeeName
      )[0].key,
      employeeReferenceId: props.employeeName,
      employeeName: props.ownerDet.filter(
        (item) => item.value === props.employeeName
      )[0].key,
      okrYear: props.okrYear,
      okrPeriod: props.okrPeriod,
    };
    if (!det.objective || !det.weight || !det.dimension) {
      let message = "Please fill required fields";
      Toast({ type: "error", message, time: 5000 });
    } else if (det.weight >= 1 && det.weight <= 100) {
      props.setLoading(true);
      let response = dispatch(createObjective(det));
      response.then(({ data, success, message }) => {
        if (success) {
          props.setLoading(false);
          if (data.rewardPoints > 0) {
            setRewardPoints(data.rewardPoints);
            setApprovalRequired(data.approvalRequired);
            checkCelebration();
          }
          const objectiveStatus = {
            objectiveStatus: "Create",
            row: data,
            companyInfo: props.companyInfo,
          };
          let response2 = dispatch(
            updateNotification(data._id, objectiveStatus)
          );
          response2.then(({ data, success, message }) => {
            if (success) {
              setLoading(false);
              let user =
                localStorage.getItem("user") !== null
                  ? JSON.parse(localStorage.getItem("user"))
                  : null;
              if (user !== null) {
                let finData = objectiveStatus.row;
                if (finData !== undefined && Object.keys(finData).length > 0) {
                  props.handleOpenPopup({
                    data: {
                      ...finData,
                      objectiveId: finData._id,
                      privileges: privileges[0].privileges,
                      polarity: finData.polarity
                        ? finData.polarity
                        : "Positive",
                    },
                  });
                } else if (data.length === 0) {
                  setLoading(false);
                  setError("No Data Found!");
                } else {
                  setLoading(false);
                  setError(message);
                }
                // let response3 = dispatch(getObjectives(user.role));
                // response3.then(({ data, privileges, message }) => {
                //   console.log(data,objectiveStatus)
                //   if (data !== undefined && data.length > 0) {
                //     props.handleOpenPopup({
                //       data: {
                //         ...data[0],
                //         objectiveId: data[0]._id,
                //         privileges: privileges[0].privileges,
                //         polarity: data[0].polarity ? data[0].polarity : 'Positive',
                //       },
                //     })
                //   } else if (data.length === 0) {
                //     setLoading(false);
                //     setError("No Data Found!");
                //   } else {
                //     setLoading(false);
                //     setError(message);
                //   }
                // });
                setError("");
              }
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
      let message = "Weight must be in between 1 To 100";
      Toast({ type: "error", message, time: 5000 });
    }
  };

  useEffect(() => {
    setObjective((prevdata) => {
      return { ...prevdata, employeeReferenceId: props.employeeName };
    });
    setRefresh(true);
    fetchObjectives();
  }, [props.employeeName, props.refresh]);

  const variantColor = () => {
    let color = "danger";
    if (threshold) {
      if (
        Number(objective.progressStatus) >=
          Number(threshold[0].lowValueRange[0].min) &&
        Number(objective.progressStatus) <=
          Number(threshold[0].lowValueRange[0].max)
      ) {
        color = "danger";
      } else if (
        Number(objective.progressStatus) >=
          Number(threshold[0].midValueRange[0].min) &&
        Number(objective.progressStatus) <=
          Number(threshold[0].midValueRange[0].max)
      ) {
        color = "warning";
      } else if (
        Number(objective.progressStatus) >=
          Number(threshold[0].highValueRange[0].min) &&
        Number(objective.progressStatus) <=
          Number(threshold[0].highValueRange[0].max)
      ) {
        color = "success";
      }
    }
    return color;
  };
  const checkCelebration = () => {
    setShowGif(true);
    setTimeout(() => {
      setShowGif(false);
    }, 5000);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          background: "#F5F5F6",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.17)",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ paddingTop: "10px", paddingLeft: "20px" }}
        >
          {t("objectives.Create_objective")}
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
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
        {loading ? (
          <LoadingIndicator size="3" />
        ) : (
          <div
            className={`bg-light-white rounded-12 ${
              isMobile ? "" : "p-1 m-1 col-lg"
            }`}
          >
            <div>
              <TextInput
                label={t("OKR Details.Objective")}
                placeholder="Objective"
                name="objective"
                value={objective.objective}
                onChangeText={handleChangeSearch}
              />
              {objective2 === 1 && (
                <div className="_2hASn _Kl1rb p1" data-testid="tooltip-content">
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setObjective2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Enter the objective narration.</p>
                  </div>
                  <div className="_2Q31f">
                    <button className="_2rcQQ" disabled>
                      Prev
                    </button>
                    <button className="" onClick={nextButton}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2">
              <TextInput
                dateType="Number"
                label={t("OKR Details.Weight")}
                placeholder="Enter between 1 to 100"
                name="weight"
                value={objective.weight}
                onChangeText={handleChangeSearch}
              />
              {objective2 === 2 && (
                <div className="_2hASn _Kl1rb p2" data-testid="tooltip-content">
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setObjective2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Enter the weight.</p>
                  </div>
                  <div className="_2Q31f">
                    <button className="_2rcQQ" onClick={prevButton}>
                      Prev
                    </button>
                    <button className="" onClick={nextButton}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 ">
              <div className="row">
                <div className="col-lg ">
                  <SelectInput
                    label={t("OKR Details.Owner")}
                    placeholder="--Select--"
                    name="employeeReferenceId"
                    options={props.ownerDet}
                    value={objective.employeeReferenceId}
                    onChangeText={handleChangeSearch}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg ">
                  <TextInput
                    label={t("OKR Details.Due Date")}
                    dateType="date"
                    name="dueDate"
                    value={objective.dueDate}
                    onChangeText={handleChangeSearch}
                  />
                  {objective2 === 3 && (
                    <div
                      className="_2hASn _Kl1rb p3"
                      data-testid="tooltip-content"
                    >
                      <div className="_1RyPu">
                        <img
                          src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                          alt="cancel"
                          onClick={() => {
                            setObjective2(0);
                            localStorage.setItem("showObjTour", false);
                          }}
                        />
                      </div>
                      <span className="_33nJ1"></span>
                      <div>
                        <p>Select the Due Date</p>
                      </div>
                      <div className="_2Q31f">
                        <button className="_2rcQQ" onClick={prevButton}>
                          Prev
                        </button>
                        <button className="" onClick={nextButton}>
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 m-3">
              <div className="" style={{ zIndex: 1 }}>
                <SelectInput
                  label={t("OKR Details.Dimension")}
                  placeholder="--Select--"
                  name="dimension"
                  options={Dimensions}
                  value={objective.dimension}
                  onChangeText={handleChangeSearch}
                  labelStyle={{ marginLeft: -15 }}
                />
              </div>
            </div>
            <div className="mt-3 m-3">
              <p>{t("OKR Details.Select your Progress status Percentage")}</p>
              <div className="">
                <span className={`text-${variantColor()}`}>
                  {objective.progressStatus}
                </span>
                <SliderLarge
                  progressStatus={objective.progressStatus}
                  onChange={(value) => {
                    if (
                      privileges &&
                      privileges.length > 0 &&
                      privileges.filter(
                        (privilege) =>
                          privilege.page === "Update progress on Objectives"
                      ).length > 0 &&
                      privileges.filter(
                        (privilege) =>
                          privilege.page === "Update progress on Objectives"
                      )[0].edit
                    ) {
                      handleChangeSearch({
                        target: { name: "progressStatus", value },
                      });
                    } else {
                      Toast({
                        type: "warning",
                        message:
                          "You don't have permission to update progress.",
                        time: 5000,
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-12 m-0 p-0">
              {showAttachment ? (
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
                    href={objective.feedAttachment}
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
              )}
            </div>
          </div>
        )}
        <div>
          {props.loading ? (
            <LoadingIndicator />
          ) : (
            <div
              className={`${
                isMobile
                  ? "d-flex justify-content-center"
                  : "d-flex justify-content-end"
              } `}
            >
              <Button
                text={t("objectives.Add_kr")}
                handleClick={handleSaveKr}
                className="bg-green border text-white"
              />
              {objective2 === 4 && (
                <div className="_2hASn _Kl1rb p5" data-testid="tooltip-content">
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setObjective2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Click on Add KR button to add Key Result.</p>
                  </div>
                  <div className="_2Q31f">
                    <button className="_2rcQQ" onClick={prevButton}>
                      Prev
                    </button>
                    <button className="" onClick={nextButton}>
                      Next
                    </button>
                  </div>
                </div>
              )}
              <Button
                text={t("objectives.Save_kr")}
                className="bg-green border text-white"
                handleClick={handleSave}
              />
            </div>
          )}
          <div ref={el}></div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
