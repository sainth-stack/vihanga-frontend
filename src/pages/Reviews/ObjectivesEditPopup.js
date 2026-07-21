/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import { Dimensions, LoadingIndicator, Polarities, UOMs } from "utilities";
import { Toast } from "service/toast";
import useWindowSize from "components/UseWindowSize";
import SliderLarge from "components/SliderLarge";
import { useSelector } from "react-redux";
import EditCommentObjectivePopup from "./OkrDetails/EditCommentObjective";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const ObjectivesEditPopup = (props) => {
  let threshold = useSelector((store) => store.user.threshold);
  const {
    _id,
    objective: objectExisting,
    successMetrics: succesExist,
    weight: weightExist,
    owner: ownerExist,
    dimension: dimensionExist,
    dueDate: dueDateExist,
    progressStatus: progressStatusExist,
    comments: commentExist,
    feedAttachment: feedAttachExist,
    employeeName: employeeNameExist,
    employeeReferenceId: employeeReferenceIdExist,
    okrYear: okrYearExist,
    okrPeriod: okrPeriodExist,
    uom: uomExist,
    polarity: polarityExist,
    target: targetExist,
    actual: actualExist,
    targetDate: targetDateExist,
    actualDate: actualDateExist,
    children: childData,
    hideColumns = false,
  } = props.updata;
  const [value, setValue] = useState(progressStatusExist);
  const [existWeight] = useState(props.updata.weight);
  const [showAttachment, setShowAttachment] = useState(false);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [krReferenceId, setKRReferenceId] = useState("");
  const [employeeReferenceId, setemployeeReferenceId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [privileges] = useState(props.privileges);
  const [comment] = useState("");
  const [objective, setObjective] = useState({
    objective: "",
    dueDate: null,
    weight: "",
    owner: "",
    successMetrics: "",
    progressStatus: "",
    comments: "",
    feedAttachment: "",
    employeeReferenceId: props.employeeReferenceId,
    employeeName: "",
    dimension: "",
    uom: "",
    polarity: "",
    target: "",
    actual: "",
    targetDate: null,
    actualDate: null,
  });
  const isMobile = useWindowSize();
  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...objective };
    updatedData[name] = value;
    props.updata[name] = "";
    setObjective(updatedData);
  };
  const handleSave = () => {
    const sum = props.updata.data
      .map((datum) => datum.weight)
      .reduce((a, b) => a + b);
    const totalWeight = sum - existWeight + Number(objective.weight);
    let det = {
      _id,
      objective: objective.objective ? objective.objective : objectExisting,
      dueDate:
        objective.dueDate !== null && objective.dueDate !== "Invalid date"
          ? objective.dueDate
          : dueDateExist,
      weight: objective.weight ? objective.weight : weightExist,
      totalWeight: totalWeight ? totalWeight : "",
      owner: objective.owner ? objective.owner : ownerExist,
      successMetrics: objective.successMetrics
        ? objective.successMetrics
        : succesExist,
      progressStatus: value ? value : progressStatusExist,
      comments: comment ? comment : commentExist,
      feedAttachment: objective.feedAttachment
        ? objective.feedAttachment
        : feedAttachExist,
      employeeReferenceId: objective.owner
        ? objective.owner
        : employeeReferenceIdExist,
      employeeName: employeeName ? employeeName : employeeNameExist,
      okrYear: okrYearExist,
      okrPeriod: okrPeriodExist,
      uom: objective.uom ? objective.uom : uomExist,
      polarity: objective.polarity ? objective.polarity : polarityExist,
      target: objective.target ? objective.target : targetExist,
      actual: objective.actual ? objective.actual : actualExist,
      targetDate: objective.targetDate ? objective.targetDate : targetDateExist,
      actualDate: objective.actualDate ? objective.actualDate : actualDateExist,
      children: childData,
      dimension: objective.dimension ? objective.dimension : dimensionExist,
    };

    if (!det.objective || !det.weight || !det.dimension) {
      let message = "Please fill required fields";
      Toast({ type: "error", message, time: 5000 });
    } else if (det.totalWeight > 100) {
      let message = "Total Weight must be not greater than 100";
      Toast({ type: "warning", message, time: 5000 });
    } else {
      if (det.weight >= 1 && det.weight <= 100) {
        props.handlecallbackedit(det);
      } else {
        let message = "Weight must be in between 1 To 100";
        Toast({ type: "warning", message, time: 5000 });
      }
    }
  };

  useEffect(() => {
    setObjective((prevdata) => {
      return {
        ...prevdata,
        employeeReferenceId: props.updata.employeeReferenceId,
      };
    });
    setShowAttachment(feedAttachExist ? false : true);
  }, [props.updata.employeeReferenceId]);

  const variantColor = () => {
    let color = "danger";
    let progressValue = value;
    if (threshold) {
      if (
        Number(progressValue) >= Number(threshold[0].lowValueRange[0].min) &&
        Number(progressValue) <= Number(threshold[0].lowValueRange[0].max)
      ) {
        color = "danger";
      } else if (
        Number(progressValue) >= Number(threshold[0].midValueRange[0].min) &&
        Number(progressValue) <= Number(threshold[0].midValueRange[0].max)
      ) {
        color = "warning";
      } else if (
        Number(progressValue) >= Number(threshold[0].highValueRange[0].min) &&
        Number(progressValue) <= Number(threshold[0].highValueRange[0].max)
      ) {
        color = "success";
      }
    }
    return color;
  };
  const handleComments = () => {
    setOrderModalShow3(true);
    setKRReferenceId(_id);
    setemployeeReferenceId(employeeReferenceIdExist);
    setEmployeeName(employeeNameExist);
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
          Update Goal
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div
          className={`bg-light-white rounded-12 ${isMobile ? "" : "p-1 m-1"}`}
        >
          <div>
            <TextInput
              label="Goal*"
              placeholder="Goal Name"
              name="objective"
              value={objective.objective ? objective.objective : objectExisting}
              onChangeText={handleChangeSearch}
              readonly={hideColumns}
            />
          </div>
          <div className="mt-2">
            <TextInput
              dateType="Number"
              label="Weight*"
              placeholder="Enter between 1 to 100"
              name="weight"
              value={objective.weight ? objective.weight : weightExist}
              onChangeText={handleChangeSearch}
              readonly={hideColumns}
            />
          </div>
          <div
            className={`mt-3 ${
              isMobile
                ? ""
                : "d-flex justify-content-between align-items-center"
            }`}
          >
            <SelectInput
              label="Owner*"
              placeholder="--Select--"
              name="employeeReferenceId"
              options={props.owner}
              value={objective.employeeReferenceId}
              onChangeText={handleChangeSearch}
              isDisabled={true}
            />
            <TextInput
              label={t("Tasks.Due Date")}
              dateType="date"
              name="dueDate"
              value={
                objective.dueDate
                  ? objective.dueDate
                  : window
                      .moment(dueDateExist, "DD MMM YYYY")
                      .format("YYYY-MM-DD")
              }
              onChangeText={handleChangeSearch}
              readonly={hideColumns}
            />
          </div>
          <div className="mt-3 m-3">
            <div className="" style={{ zIndex: 1 }}>
              <SelectInput
                label="Dimension*"
                placeholder="--Select--"
                name="dimension"
                options={Dimensions}
                value={
                  objective.dimension ? objective.dimension : dimensionExist
                }
                onChangeText={handleChangeSearch}
                labelStyle={{ marginLeft: -15 }}
                isDisabled={hideColumns}
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
                value={objective.uom ? objective.uom : uomExist}
                onChangeText={handleChangeSearch}
                isDisabled={hideColumns}
              />
            </Col>
            <Col className="" lg={isMobile ? "10" : "6"}>
              <SelectInput
                label="Polarity*"
                placeholder="--Select--"
                name="polarity"
                value={objective.polarity ? objective.polarity : polarityExist}
                onChangeText={handleChangeSearch}
                options={Polarities}
                isDisabled={hideColumns}
              />
            </Col>
          </Row>
          <Row className={isMobile ? "p-2" : "mt-3"}>
            <Col className="" lg={isMobile ? "10" : "6"}>
              <TextInput
                dateType="number"
                label="Target Result*"
                name="target"
                value={objective.target ? objective.target : targetExist}
                onChangeText={handleChangeSearch}
                readonly={hideColumns}
              />
            </Col>
            <Col className="" lg={isMobile ? "10" : "6"}>
              <TextInput
                dateType="number"
                label="Actual Result"
                name="actual"
                value={objective.actual ? objective.actual : actualExist}
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
                value={
                  objective.targetDate ? objective.targetDate : targetDateExist
                }
                onChangeText={handleChangeSearch}
                readonly={hideColumns}
              />
            </Col>
            <Col lg={isMobile ? "10" : "6"} className="">
              <TextInput
                label="Completion Date"
                dateType="date"
                name="actualDate"
                value={
                  objective.actualDate ? objective.actualDate : actualDateExist
                }
                onChangeText={handleChangeSearch}
                readonly={hideColumns}
              />
            </Col>
          </Row>
          <div className="mt-3 m-3">
            <p>{t("OKR Details.Select your Progress status Percentage")}</p>
            <div className="">
              <span className={`text-${variantColor()}`}>{value}</span>

              <SliderLarge
                disabled={hideColumns}
                progressStatus={value}
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
                    setValue(value);
                  } else {
                    Toast({
                      type: "warning",
                      message: "You don't have permission to update progress.",
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
                  href={
                    objective.feedAttachment
                      ? objective.feedAttachment
                      : feedAttachExist
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
            )}
          </div>
        </div>
        {props.loading ? (
          <LoadingIndicator />
        ) : (
          <div
            className={`${
              isMobile
                ? "d-flex justify-content-center flex-wrap"
                : "d-flex justify-content-end"
            } `}
          >
            <Button
              text={t("Tasks.Comments")}
              className="bg-green border text-white"
              handleClick={() => handleComments()}
            />
            <Button
              text="Update"
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        )}
      </Modal.Body>
      {orderModalShow3 && (
        <EditCommentObjectivePopup
          show={orderModalShow3}
          onHide={() => setOrderModalShow3(false)}
          krReferenceId={krReferenceId}
          employeeName={employeeName}
          employeeReferenceId={employeeReferenceId}
        />
      )}
    </Modal>
  );
};

export default ObjectivesEditPopup;
