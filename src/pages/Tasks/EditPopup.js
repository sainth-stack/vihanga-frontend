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
import { useDispatch } from "react-redux";
import { getEmployees } from "action/EmployeeAct";
import useWindowSize from "components/UseWindowSize";
import { priority, removeDuplicates, taskStatus, Validator } from "utilities";
import { useTranslation } from "react-i18next";
const EditPopup = (props) => {
  const [data, setData] = useState(props.data);
  const dispatch = useDispatch();
  const [change, setChange] = useState(false);
  const [linkChange, setLinkChange] = useState(false);
  const [, setLoading] = useState(false);
  const [getKeyResult, setGetKeyResult] = useState();
  const [, setError] = useState(false);
  const [keyResultw, setKeyResultw] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAttachment, setShowAttachment] = useState(
    props.data.attachments ? false : true
  );
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();
  const validator = Validator();
  const clearData = () => {
    console.log("clear");
    setData({
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
      props.handlecallback([
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
        },
        {
          id: data.id,
        },
      ]);
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
  useEffect(() => {
    fetchEntities();
    fetchEmployees();
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
                    label={t("OKR Details.Estimation Efforts")}
                    dateType="number"
                    name="estimationEffort"
                    value={data.estimationEffort}
                    onChangeText={handleChange}
                  />
                  {/* {validator.current.message("Estimation Effort", data.estimationEffort, "required")} */}
                </Col>
                <Col className="p-0">
                  <TextInput
                    label={t("OKR Details.Estimation Efforts")}
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
          <div className="form-group d-flex justify-content-between">
            <label
              htmlFor="comment"
              className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
            >
              Comments
            </label>
            <textarea
              id="comments"
              className={`form-control p-2 ${isMobile ? "mr-1" : "col-10"}`}
              rows="5"
              name="comments"
              value={data.comments}
              onChange={handleChange}
            ></textarea>
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

export default EditPopup;
