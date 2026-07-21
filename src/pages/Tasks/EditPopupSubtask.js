import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import { Col, Row } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import { getKeyResults } from "action/keyResultAct";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "action/EmployeeAct";
import { getTasksById } from "action/TasksAct";
import useWindowSize from "components/UseWindowSize";
import {
  AuthUserId,
  priority,
  removeDuplicates,
  taskStatus,
  Validator,
} from "utilities";
import SliderLarge from "components/SliderLarge";
import { useTranslation } from "react-i18next";

const EditPopupSubtask = (props) => {
  let threshold = useSelector((store) => store.user.threshold);
  const [data, setData] = useState(props.data);
  const dispatch = useDispatch();
  const [change, setChange] = useState(false);
  const [linkChange, setLinkChange] = useState(false);
  const [, setLoading] = useState(false);
  const [getKeyResult, setGetKeyResult] = useState();
  const [, setError] = useState(false);
  const [keyResultw, setKeyResultw] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAttachment, setShowAttachment] = useState(
    props.data.attachments ? false : true
  );
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();
  const validator = Validator();
  const empID = JSON.parse(localStorage.getItem("userData"));
  const empID2 = JSON.parse(localStorage.getItem("user"));
  const clearData = () => {
    console.log("clear");
    setData({
      title: "",
      description: "",
      startDate: null,
      dueDate: null,
      actualCompletionDate: null,
      linkToKR: "",
      assignTo: "",
      priority: "",
      comments: "",
      attachments: "",
      krReferenceId: "",
      estimationEffort: "",
      actualEffort: "",
      progressStatus: 0,
      mainTask: "",
      userId: AuthUserId,
    });
  };

  const fetchEntities = () => {
    try {
      setLoading(true);
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((item) => {
            return { key: item.keyResultName, value: item._id };
          });
          setKeyResultw(updatedData);
          setGetKeyResult(data);
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
      let response = dispatch(getTasksById(empID ? empID.ownerId : empID2._id));
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
              mainTask: task.mainTask ? task.mainTask : "",
              companyId: task.companyId ? task.companyId : "",
              userId: AuthUserId,
            };
          });
          let updatedDataOpt = [];
          updatedDataOpt = updatedData.map((item) => {
            return {
              key: item.title,
              value: item.id,
            };
          });
          updatedDataOpt.unshift({ key: "--Default--", value: "" });
          setTasks(updatedDataOpt);
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

  const fetchEmployees = () => {
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
  const handleSave = () => {
    if (validator.current.allValid()) {
      var keyName = [];
      if (data.linkToKR !== "" && data.linkToKR !== null) {
        keyName = getKeyResult.filter((item) =>
          item._id === linkChange ? data.linkToKR : data.krReferenceId
        );
      } else {
        keyName = [];
      }
      // var keyName = getKeyResult.filter((item) => item._id === linkChange ? data.linkToKR : data.krReferenceId);
      props.handlecallback(
        [
          {
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            dueDate: data.dueDate,
            actualCompletionDate: data.actualCompletionDate
              ? data.actualCompletionDate
              : null,
            linkToKR: keyName.length > 0 ? keyName[0].keyResultName || "" : "",
            assignTo: change ? [data.assignTo] : [...data.assignTo],
            priority: data.priority,
            status: data.status,
            comments: data.comments,
            attachments: data.attachments,
            krReferenceId: linkChange ? data.linkToKR : data.krReferenceId,
            estimationEffort: data.estimationEffort,
            actualEffort: data.actualEffort ? data.actualEffort : 0,
            progressStatus: data.progressStatus ? data.progressStatus : 0,
            mainTask: data.mainTask ? data.mainTask : "",
            userId: AuthUserId,
          },
          {
            id: data.id,
          },
        ],
        clearData
      );
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
  const handleChange = ({ target: { name, value } }) => {
    if (name === "assignTo") {
      setChange(true);
    }
    if (name === "linkToKR") {
      setLinkChange(true);
    }
    let updatedData = { ...data };
    updatedData[name] = value;
    setData(updatedData);
  };
  const variantColor = () => {
    let color = "danger";
    if (threshold) {
      if (
        Number(data.progressStatus) >=
          Number(threshold[0].lowValueRange[0].min) &&
        Number(data.progressStatus) <= Number(threshold[0].lowValueRange[0].max)
      ) {
        color = "danger";
      } else if (
        Number(data.progressStatus) >=
          Number(threshold[0].midValueRange[0].min) &&
        Number(data.progressStatus) <= Number(threshold[0].midValueRange[0].max)
      ) {
        color = "warning";
      } else if (
        Number(data.progressStatus) >=
          Number(threshold[0].highValueRange[0].min) &&
        Number(data.progressStatus) <=
          Number(threshold[0].highValueRange[0].max)
      ) {
        color = "success";
      }
    }
    return color;
  };
  useEffect(() => {
    fetchEntities();
    fetchEmployees();
    // fetchTasks();
    getTask();
    //eslint-disable-next-line
  }, []);

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
          {t("Tasks.Edit New Task")}
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={() => {
            props.onHide();
            clearData();
          }}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div
          className={`rounded-6 mh-100  ${
            isMobile ? "p-1 m-1" : "bg-light-primary p-4 m-1"
          }`}
        >
          <div
            className={
              isMobile
                ? "form-group d-flex justify-content-between "
                : "form-group d-flex justify-content-between"
            }
          >
            <label
              htmlFor="taskTitle"
              className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
            >
              {t("Tasks.Task Title")}
            </label>
            <input
              type="text"
              placeholder=""
              id="title"
              className={`form-control searchBox text-dark fs14 ${
                isMobile ? "mr-1" : "col-10"
              }`}
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </div>
          {/* {validator.current.message("Task Title", data.title, "required")} */}
          <div className="form-group d-flex justify-content-between">
            <label
              htmlFor="taskDescription"
              className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
            >
              {t("Tasks.Task Description")}
            </label>
            <textarea
              id="description"
              className={`form-control p-2 ${isMobile ? "mr-1" : "col-10"}`}
              rows="5"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
          </div>
          {/* {validator.current.message("Task Description", data.description, "required")} */}
          <div>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <TextInput
                  label={t("Tasks.Start Date")}
                  dateType="date"
                  name="startDate"
                  value={window.moment(data.startDate).format("YYYY-MM-DD")}
                  onChangeText={handleChange}
                  min={
                    data.mainTask !== ""
                      ? window.moment(data.startDate).format("YYYY-MM-DD")
                      : null
                  }
                  max={
                    data.mainTask !== ""
                      ? window.moment(data.dueDate).format("YYYY-MM-DD")
                      : null
                  }
                />
                {/* {validator.current.message(
                  "Start Date",
                  data.startDate,
                  "required"
                )} */}
              </Col>
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <TextInput
                  label={t("Tasks.Due Date")}
                  dateType="date"
                  name="dueDate"
                  value={window.moment(data.dueDate).format("YYYY-MM-DD")}
                  onChangeText={handleChange}
                  min={
                    data.mainTask !== ""
                      ? window.moment(data.startDate).format("YYYY-MM-DD")
                      : null
                  }
                  max={
                    data.mainTask !== ""
                      ? window.moment(data.dueDate).format("YYYY-MM-DD")
                      : null
                  }
                />
                {/* {validator.current.message(
                  "Due Date",
                  data.dueDate,
                  "required"
                )} */}
              </Col>
              <Col className={isMobile ? "mt-2" : "mt-3 p-0"}>
                <TextInput
                  label={t("Tasks.Actual Completion Date")}
                  dateType="date"
                  name="actualCompletionDate"
                  value={window
                    .moment(data.actualCompletionDate)
                    .format("YYYY-MM-DD")}
                  onChangeText={handleChange}
                />
                {/* {data.status === "completed" &&
                  validator.current.message(
                    "Actual Completion Date",
                    data.actualCompletionDate,
                    "required"
                  )} */}
              </Col>
            </Row>
          </div>
          <div className={isMobile ? "form-group mt-2" : "form-group mt-3"}>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <SelectInput
                  label={t("Tasks.Link To KR")}
                  placeholder=""
                  name="linkToKR"
                  options={keyResultw}
                  value={linkChange ? data.linkToKR : data.krReferenceId}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message("Link To KR", data.linkToKR, "required")} */}
              </Col>
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <SelectInput
                  label={t("Tasks.Assign To")}
                  placeholder=""
                  name="assignTo"
                  // style={style3}
                  options={employees}
                  value={change ? data.assignTo : data.assignTo[0]}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Assign To",
                  data.assignTo,
                  "required"
                )} */}
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <SelectInput
                  label={t("Tasks.Priority")}
                  placeholder=""
                  name="priority"
                  // style={style3}
                  options={priority}
                  value={data.priority}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Priority",
                  data.priority,
                  "required"
                )} */}
              </Col>
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <SelectInput
                  Recurrence
                  placeholder=""
                  name="status"
                  // style={style3}
                  options={taskStatus}
                  value={data.status}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message("Status", data.status, "required")} */}
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            {isMobile ? (
              <div>
                <Col className="p-0">
                  <div
                    className={
                      isMobile
                        ? "form-group d-flex justify-content-between "
                        : "form-group d-flex justify-content-between"
                    }
                  >
                    <label
                      htmlFor="Estimation Effort (hrs)"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {t("OKR Details.Estimation Efforts")}
                    </label>
                    <input
                      type="number"
                      placeholder=""
                      id="title"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="estimationEffort"
                      value={data.estimationEffort}
                      onChange={handleChange}
                    />
                  </div>
                  {/* {validator.current.message("Estimation Effort", data.estimationEffort, "required")} */}
                </Col>
                <Col className="p-0">
                  <div
                    className={
                      isMobile
                        ? "form-group d-flex justify-content-between "
                        : "form-group d-flex justify-content-between"
                    }
                  >
                    <label
                      htmlFor="Actual Effort (hrs)"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {t("OKR Details.Estimation Efforts")}
                    </label>
                    <input
                      type="number"
                      placeholder=""
                      id="title"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="actualEffort"
                      value={data.actualEffort}
                      onChange={handleChange}
                    />
                  </div>
                  {/*{validator.current.message("Actual Effort", data.actualEffort, "required")}*/}
                </Col>
              </div>
            ) : (
              <Row>
                <Col className="p-0">
                  <TextInput
                    label={t("Tasks.Estimation Effort")}
                    dateType="number"
                    name="estimationEffort"
                    value={data.estimationEffort}
                    onChangeText={handleChange}
                  />
                  {/* {validator.current.message("Estimation Effort", data.estimationEffort, "required")} */}
                </Col>
                <Col className="p-0">
                  <TextInput
                    label={t("Tasks.Actual Effort")}
                    dateType="number"
                    name="actualEffort"
                    value={data.actualEffort}
                    onChangeText={handleChange}
                  />
                  {/*{validator.current.message("Actual Effort", data.actualEffort, "required")}*/}
                </Col>
              </Row>
            )}
          </div>
          <div>
            <SelectInput
              label={t("OKR Details.Main Task")}
              placeholder=""
              name="mainTask"
              options={tasks}
              value={data.mainTask}
              onChangeText={handleChange}
            />
          </div>
          <div className="mt-3 m-3">
            <p>{t("OKR Details.Select your Progress status Percentage")}</p>
            <div className="">
              <span className={`text-${variantColor()}`}>
                {data.progressStatus}
              </span>
              <SliderLarge
                progressStatus={data.progressStatus}
                onChange={(value) => {
                  handleChange({ target: { name: "progressStatus", value } });
                }}
              />
            </div>
          </div>
          {showAttachment ? (
            <div
              div
              className={isMobile ? "d-flex justify-content-between" : ""}
            >
              <label htmlFor="comment">{t("Tasks.Upload Files")}</label>
              <BrowseFilesNormal
                className="col-12"
                setData={({ url }) => {
                  handleChange({
                    target: {
                      name: "attachments",
                      value: data.attachments ? data.attachments : url,
                    },
                  });
                  setShowAttachment(!showAttachment);
                }}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <a
                href={data.attachments ? data.attachments : ""}
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
        <div>
          <div className="buttons">
            <Button
              text={t("objectives.Clear")}
              className="bg-white border-grey"
              handleClick={clearData}
            />
            <Button
              text="Update"
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditPopupSubtask;
