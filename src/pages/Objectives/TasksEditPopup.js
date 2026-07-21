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
import { removeDuplicates, Validator } from "utilities";
import { t } from "i18next";
const TasksEditPopup = (props) => {
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

  const validator = Validator();
  const priority = [
    { key: "High Level", value: "High Level" },
    { key: "Medium Level", value: "Medium Level" },
    { key: "Low Level", value: "Low Level" },
  ];
  const clearData = () => {
    console.log("clear");
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
      var keyName = getKeyResult.filter((item) =>
        item._id === linkChange ? data.linkToKR : data.krReferenceId
      );
      props.handlecallbackeditTask([
        {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          dueDate: data.dueDate,
          actualCompletionDate: data.actualCompletionDate
            ? data.actualCompletionDate
            : null,
          linkToKR: keyName[0].keyResultName || "",
          assignTo: [data.assignTo],
          priority: data.priority,
          comments: data.comments,
          attachments: data.attachments,
          krReferenceId: linkChange ? data.linkToKR : data.krReferenceId,
        },
        {
          id: data._id,
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
        <div className="bg-light-white rounded-12 mh-100 p-4 m-1">
          <div className="form-group d-flex justify-content-between">
            <label htmlFor="taskTitle">{t("Tasks.Task Title")}</label>
            <input
              type="text"
              placeholder=""
              id="title"
              className="form-control col-10 bg-light searchBox text-dark fs14"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <label htmlFor="description">
              {" "}
              361: {t("Tasks.Task Description")}
            </label>
            <textarea
              id="description"
              className="form-control col-10 p-3"
              rows="5"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Row>
              <Col>
                <TextInput
                  label={t("Tasks.Start Date")}
                  dateType="date"
                  name="startDate"
                  value={window.moment(data.startDate).format("YYYY-MM-DD")}
                  onChangeText={handleChange}
                />
              </Col>
              <Col>
                <TextInput
                  label={t("Tasks.Due Date")}
                  dateType="date"
                  name="dueDate"
                  value={window.moment(data.dueDate).format("YYYY-MM-DD")}
                  onChangeText={handleChange}
                />
              </Col>
              <Col className="mt-3">
                <TextInput
                  label="Actual Completion Date*"
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
          <div className="form-group mt-3">
            <SelectInput
              label="link To Kr*"
              placeholder=""
              name="linkToKR"
              options={keyResultw}
              value={linkChange ? data.linkToKR : data.krReferenceId}
              onChangeText={handleChange}
            />
          </div>
          <div>
            <Row>
              <Col>
                <SelectInput
                  label={t("Tasks.Assign To")}
                  placeholder=""
                  name="assignTo"
                  options={employees}
                  value={change ? data.assignTo : data.assignTo[0]}
                  onChangeText={handleChange}
                />
              </Col>
              <Col>
                <SelectInput
                  label={t("Tasks.Priority")}
                  placeholder=""
                  name="priority"
                  options={priority}
                  value={data.priority}
                  onChangeText={handleChange}
                />
              </Col>
            </Row>
          </div>
          <div className="form-group d-flex mt-3 justify-content-between">
            <label htmlFor="comment">Comments</label>
            <textarea
              id="comments"
              className="form-control col-10 p-3"
              rows="5"
              name="comments"
              value={data.comments}
              onChange={handleChange}
            ></textarea>
          </div>
          {showAttachment ? (
            <>
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
            </>
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
              text={t("Tasks.Edit")}
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TasksEditPopup;
