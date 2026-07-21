/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
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
import {
  AuthUserId,
  priority,
  removeDuplicates,
  taskStatus,
  Validator,
} from "utilities";
import useWindowSize from "components/UseWindowSize";
import RecurrenceModal from "./RecurrenceModal";
import SliderLarge from "components/SliderLarge";
import { useTranslation } from "react-i18next";

const SubTask = (props) => {
  let threshold = useSelector((store) => store.user.threshold);
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    status: "notstarted",
    linkToKr: props.selectedKR ? props.selectedKR : "",
  });
  const [, setLoading] = useState(false);
  const [getKeyResult, setGetKeyResult] = useState();
  const [, setError] = useState(false);
  const [keyResultw, setKeyResultw] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAttachment, setShowAttachment] = useState(true);
  const [openRecurrenceModal, setOpenRecurrenceModal] = useState(null);
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();
  const [task2, setTask2] = useState(0);
  useEffect(() => {
    let tour = localStorage.getItem("showObjTour");
    if (tour === "true") {
      setTask2(1);
    }
  }, []);
  const validator = Validator();
  const clearData = () => {
    setTask({
      title: "",
      description: "",
      startDate: "",
      dueDate: "",
      actualCompletionDate: "",
      linkToKR: "",
      assignTo: "",
      priority: "",
      comments: "",
      attachments: "",
      krReferenceId: "",
      estimationEffort: "",
      actualEffort: "",
      recurrence: false,
      recurrenceDetails: null,
      progressStatus: 0,
      mainTask: "",
      userId: AuthUserId,
    });
  };

  const fetchTasks = () => {
    if (props.tasks !== undefined && props.tasks.length > 0) {
      let updatedData = [];
      updatedData = props.tasks.map((item) => {
        return {
          key: item.title,
          value: item.id,
        };
      });
      updatedData.unshift({ key: "--Default--", value: "" });
      setTasks(updatedData);
    }
  };

  const fetchKeyResults = () => {
    try {
      setLoading(true);
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          const userData = JSON.parse(localStorage.getItem("userData"));
          const finalData = data.filter(
            (item) => item.userId === userData.ownerId
          );
          let updatedData = finalData.map((item) => {
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
  const nextButton = () => {
    localStorage.setItem("showObjTour", false);
    setTask2(task2 + 1);
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
          let nonduplicate = removeDuplicates(updatedData, "key");
          setEmployees(nonduplicate);
          const userData = JSON.parse(localStorage.getItem("userData"));
          if (userData !== null) {
            setTask({ ...task, assignTo: userData.ownerId });
          }
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
      if (task.linkToKr !== "" && task.linkToKr !== null) {
        keyName = getKeyResult.filter((item) => item._id === task.linkToKr);
      } else {
        keyName = [];
      }
      props.handlecallback({
        title: task.title,
        description: task.taskDescription,
        startDate: task.startDate,
        dueDate: task.dueDate,
        actualCompletionDate: task.actualCompletionDate
          ? task.actualCompletionDate
          : null,
        linkToKr:
          keyName.length > 0
            ? keyName[0].keyResultName
              ? keyName[0].keyResultName
              : ""
            : "",
        assignTo: [task.assignTo],
        priority: task.priority,
        status: task.status,
        comments: task.comments,
        attachments: task.attachments,
        krReferenceId: task.linkToKr,
        estimationEffort: task.estimationEffort,
        actualEffort: task.actualEffort ? task.actualEffort : 0,
        recurrence: task.recurrence ? task.recurrence : false,
        recurrenceDetails: task.recurrence ? task.recurrenceDetails : null,
        progressStatus: task.progressStatus,
        mainTask: task.mainTask ? task.mainTask : "",
        userId: AuthUserId,
      });
      setTask({});
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...task };
    updatedData[name] = value;
    setTask(updatedData);
  };
  const handleRecurrence = (recurrence) => {
    setTask((prev) => {
      return {
        ...prev,
        recurrenceDetails: task.recurrence ? recurrence : null,
      };
    });
    setOpenRecurrenceModal(null);
  };
  const variantColor = () => {
    let color = "danger";
    if (threshold) {
      if (
        Number(task.progressStatus) >=
          Number(threshold[0].lowValueRange[0].min) &&
        Number(task.progressStatus) <= Number(threshold[0].lowValueRange[0].max)
      ) {
        color = "danger";
      } else if (
        Number(task.progressStatus) >=
          Number(threshold[0].midValueRange[0].min) &&
        Number(task.progressStatus) <= Number(threshold[0].midValueRange[0].max)
      ) {
        color = "warning";
      } else if (
        Number(task.progressStatus) >=
          Number(threshold[0].highValueRange[0].min) &&
        Number(task.progressStatus) <=
          Number(threshold[0].highValueRange[0].max)
      ) {
        color = "success";
      }
    }
    return color;
  };
  useEffect(() => {
    fetchKeyResults();
    fetchEmployees();
    fetchTasks();
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
      style={{ background: "#000", opacity: 1 }}
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
          {t("OKR Details.Add New Task")}
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
              {t("OKR Details.Task Title")}
            </label>
            <input
              type="text"
              placeholder=""
              id="title"
              className={`form-control searchBox text-dark fs14 ${
                isMobile ? "mr-1" : "col-10"
              }`}
              name="title"
              value={task.title}
              onChange={handleChange}
            />
          </div>
          {task2 === 1 && (
            <div className="_2hASn _Kl1rb p11" data-testid="tooltip-content">
              <div className="_1RyPu">
                <img
                  src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                  alt="cancel"
                  onClick={() => {
                    setTask2(0);
                    localStorage.setItem("showObjTour", false);
                  }}
                />
              </div>
              <span className="_33nJ1"></span>
              <div>
                <p>Enter the Task narration.</p>
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
          {/* {validator.current.message("Task Title", task.title, "required")} */}
          <div className="form-group d-flex justify-content-between">
            <label
              htmlFor="taskDescription"
              className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
            >
              {t("OKR Details.Task Description")}
            </label>
            <textarea
              id="taskDescription"
              className={`form-control p-2 ${isMobile ? "mr-1" : "col-10"}`}
              rows="5"
              name="taskDescription"
              value={task.taskDescription}
              onChange={handleChange}
            />
          </div>
          {/* {validator.current.message("Task Description", task.taskDescription, "required")} */}
          <div>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <TextInput
                  label={t("OKR Details.Start Date")}
                  dateType="date"
                  name="startDate"
                  value={task.startDate}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Start Date",
                  task.startDate,
                  "required"
                )} */}
              </Col>
              {task2 === 2 && (
                <div
                  className="_2hASn _Kl1rb p12"
                  data-testid="tooltip-content"
                >
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setTask2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Select the Start Date.</p>
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
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <TextInput
                  label={t("OKR Details.Due Date")}
                  dateType="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Due Date",
                  task.dueDate,
                  "required"
                )} */}
              </Col>
              {task2 === 3 && (
                <div
                  className="_2hASn _Kl1rb p13"
                  data-testid="tooltip-content"
                >
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setTask2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Select the Due Date.</p>
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
              <Col className={isMobile ? "mt-2" : "mt-3 p-0"}>
                <TextInput
                  label={t("OKR Details.Actual Completion Date")}
                  dateType="date"
                  name="actualCompletionDate"
                  value={task.actualCompletionDate}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message("Actual Completion Date", task.actualCompletionDate, "required")} */}
              </Col>
            </Row>
          </div>
          <div className={isMobile ? "form-group mt-2" : "form-group mt-3"}>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <SelectInput
                  label={t("OKR Details.Link To KR")}
                  placeholder=""
                  name="linkToKr"
                  options={keyResultw}
                  value={task.linkToKr}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message("Link To KR", task.linkToKr, "required")} */}
              </Col>
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <SelectInput
                  label={t("OKR Details.Assign To")}
                  placeholder=""
                  name="assignTo"
                  // style={style3}
                  options={employees}
                  value={task.assignTo}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Assign To",
                  task.assignTo,
                  "required"
                )} */}
              </Col>
              {task2 === 4 && (
                <div
                  className="_2hASn _Kl1rb p14"
                  data-testid="tooltip-content"
                >
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setTask2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Select the Assignee.</p>
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
            </Row>
          </div>
          <div>
            <Row>
              <Col className={isMobile ? "" : "p-0"} lg={isMobile ? "10" : ""}>
                <SelectInput
                  label={t("OKR Details.Priority")}
                  placeholder=""
                  name="priority"
                  // style={style3}
                  options={priority}
                  value={task.priority}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message(
                  "Priority",
                  task.priority,
                  "required"
                )} */}
              </Col>
              {task2 === 5 && (
                <div
                  className="_2hASn _Kl1rb p15"
                  data-testid="tooltip-content"
                >
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setTask2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Select the Priority.</p>
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
              <Col
                className={isMobile ? "mt-2" : "p-0"}
                lg={isMobile ? "10" : ""}
              >
                <SelectInput
                  label={t("OKR Details.Status")}
                  placeholder=""
                  name="status"
                  // style={style3}
                  options={taskStatus}
                  value={task.status}
                  onChangeText={handleChange}
                />
                {/* {validator.current.message("Status", task.status, "required")} */}
              </Col>
              {task2 === 6 && (
                <div
                  className="_2hASn _Kl1rb p16"
                  data-testid="tooltip-content"
                >
                  <div className="_1RyPu">
                    <img
                      src="/static/media/cancel~JNochEUg.5e7d8443.svg"
                      alt="cancel"
                      onClick={() => {
                        setTask2(0);
                        localStorage.setItem("showObjTour", false);
                      }}
                    />
                  </div>
                  <span className="_33nJ1"></span>
                  <div>
                    <p>Select the Status.</p>
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
                      label={t("OKR Details.Estimation Efforts")}
                    </label>
                    <input
                      type="number"
                      placeholder=""
                      id="title"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="estimationEffort"
                      value={task.estimationEffort}
                      onChange={handleChange}
                    />
                  </div>
                  {/* {validator.current.message("Estimation Effort", task.estimationEffort, "required")} */}
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
                      label={t("OKR Details.Actual Efforts")}
                    </label>
                    <input
                      type="number"
                      placeholder=""
                      id="title"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="actualEffort"
                      value={task.actualEffort}
                      onChange={handleChange}
                    />
                  </div>
                  {/*{validator.current.message("Actual Effort", task.actualEffort, "required")}*/}
                </Col>
              </div>
            ) : (
              <Row>
                <Col className="p-0">
                  <TextInput
                    label={t("OKR Details.Estimation Efforts")}
                    dateType="number"
                    name="estimationEffort"
                    value={task.estimationEffort}
                    onChangeText={handleChange}
                  />
                  {/* {validator.current.message("Estimation Effort", task.estimationEffort, "required")} */}
                </Col>
                <Col className="p-0">
                  <TextInput
                    label={t("OKR Details.Actual Efforts")}
                    dateType="number"
                    name="actualEffort"
                    value={task.actualEffort}
                    onChangeText={handleChange}
                  />
                  {/*{validator.current.message("Actual Effort", task.actualEffort, "required")}*/}
                </Col>
              </Row>
            )}
          </div>
          <div className="ml-5 pl-5">
            <input
              type="checkbox"
              className="ml-4 mb-4"
              placeholder=""
              id="recurrence"
              name="recurrence"
              checked={task.recurrence}
              value={task.recurrence}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "recurrence",
                    value: e.target.checked ? true : false,
                  },
                });
                setOpenRecurrenceModal(task);
              }}
            />
            <label htmlFor="recurrence" className="m-1 mb-1">
              {" "}
              {t("OKR Details.Reccurance")}
            </label>
          </div>
          <div>
            <SelectInput
              label={t("OKR Details.Main Task")}
              placeholder=""
              name="mainTask"
              options={tasks}
              value={task.mainTask}
              onChangeText={handleChange}
            />
          </div>
          <div className="mt-3 m-3">
            <p>{t("OKR Details.Select your Progress status Percentage")}</p>
            <div className="">
              <span className={`text-${variantColor()}`}>
                {task.progressStatus}
              </span>
              <SliderLarge
                // progressStatus={40}
                progressStatus={task.progressStatus}
                onChange={(value) => {
                  handleChange({ target: { name: "progressStatus", value } });
                }}
              />
            </div>
          </div>
          {showAttachment ? (
            <div className={isMobile ? "d-flex justify-content-between" : ""}>
              <label
                htmlFor="comment"
                className={isMobile ? "col-2 p-0 m-0" : ""}
              >
                {t("OKR Details.Upload Files")}
              </label>
              <BrowseFilesNormal
                className="col-12"
                setData={({ url }) => {
                  handleChange({ target: { name: "attachments", value: url } });
                  setShowAttachment(!showAttachment);
                }}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <a
                href={task.attachments ? task.attachments : ""}
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
              text={t("Tasks.Add")}
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
        {openRecurrenceModal !== null && (
          <RecurrenceModal
            task={task}
            show={openRecurrenceModal !== null}
            onHide={() => {
              handleChange({ target: { name: "recurrence", value: false } });
              setOpenRecurrenceModal(null);
            }}
            handleRecurrence={handleRecurrence}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SubTask;
