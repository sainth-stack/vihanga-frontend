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
import { Toast } from "service/toast";
import { Dimensions, LoadingIndicator, Polarities, UOMs } from "utilities";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getObjectives } from "action/UserAct";
import useWindowSize from "components/UseWindowSize";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { useScrollTo } from "react-use-window-scroll";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  const [rewardPoints] = useState(0);
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
    uom: "",
    polarity: "Positive",
    target: 0,
    actual: 0,
    targetDate: null,
    actualDate: null,
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
  const { t } = useTranslation();
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
          Create Goal
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
          <h3>You have earned {rewardPoints} reward points</h3>
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
                label="Goal*"
                placeholder="Goal Name"
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
                label="Weight*"
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
                    label="Owner*"
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
                    label={t("Tasks.Due Date")}
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
                  label="Dimension*"
                  placeholder="--Select--"
                  name="dimension"
                  options={Dimensions}
                  value={objective.dimension}
                  onChangeText={handleChangeSearch}
                  labelStyle={{ marginLeft: -15 }}
                />
              </div>
            </div>

            <Row className={isMobile ? "p-2" : "mt-3"}>
              <Col className="" lg={isMobile ? "10" : "6"}>
                <SelectInput
                  label="Unit Of Measurement"
                  placeholder="--Select--"
                  name="uom"
                  options={UOMs}
                  value={objective.uom}
                  onChangeText={handleChangeSearch}
                />
              </Col>
              <Col className="" lg={isMobile ? "10" : "6"}>
                <SelectInput
                  label="Polarity*"
                  placeholder="--Select--"
                  name="polarity"
                  value={objective.polarity}
                  onChangeText={handleChangeSearch}
                  options={Polarities}
                />
              </Col>
            </Row>
            <Row className={isMobile ? "p-2" : "mt-3"}>
              <Col className="" lg={isMobile ? "10" : "6"}>
                <TextInput
                  dateType="number"
                  label="Target Result*"
                  name="target"
                  value={objective.target}
                  onChangeText={handleChangeSearch}
                />
              </Col>
              <Col className="" lg={isMobile ? "10" : "6"}>
                <TextInput
                  dateType="number"
                  label="Actual Result"
                  name="actual"
                  value={objective.actual}
                  onChange={handleChangeSearch}
                />
              </Col>
            </Row>

            <Row className={isMobile ? "p-2" : "mt-3"}>
              <Col lg={isMobile ? "10" : "6"} className="">
                <TextInput
                  label="Target Date*"
                  dateType="date"
                  name="targetDate"
                  value={objective.targetDate}
                  onChangeText={handleChangeSearch}
                />
              </Col>
              <Col lg={isMobile ? "10" : "6"} className="">
                <TextInput
                  label="Completion Date"
                  dateType="date"
                  name="actualDate"
                  value={objective.actualDate}
                  onChangeText={handleChangeSearch}
                />
              </Col>
            </Row>

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
                text="Save"
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
