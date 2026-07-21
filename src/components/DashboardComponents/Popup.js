import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./style2.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import { Validator, LoadingIndicator } from "utilities";
import { useTranslation } from "react-i18next";
const PopupSendWish = (props) => {
  const [task, setTask] = useState({
    name: props.name,
    email: props.email,
    description: props.description,
  });
  const [, forceUpdate] = useState(false);

  const validator = Validator();
  const clearData = () => {
    console.log("clear");
    setTask({
      name: "",
      email: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (validator.current.allValid()) {
      props.handlecallback({
        name: task.name,
        description: task.description,
        email: task.email,
      });
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

  useEffect(() => {
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
          Send {props.title} Wishes
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12 p-4 m-4">
          <div className="form-group d-flex justify-content-between">
            <input
              id="name"
              className="form-control col-12 p-3"
              rows="5"
              name="name"
              value={task.name}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <input
              id="email"
              className="form-control col-12 p-3"
              rows="5"
              name="email"
              value={task.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <textarea
              id="description"
              className="form-control col-12 p-3"
              rows="5"
              name="description"
              value={task.description}
              onChange={handleChange}
            />
          </div>
          {/* {validator.current.message("Description", task.description, "required")} */}
        </div>
        <div>
          {props.loading ? (
            <div className="buttons">
              <LoadingIndicator />
            </div>
          ) : (
            <div className="buttons">
              <Button
                text={t("objectives.Clear")}
                className="bg-white border-grey"
                handleClick={clearData}
              />
              <Button
                text={t("objectives.Send")}
                className="bg-green border text-white"
                handleClick={handleSave}
              />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PopupSendWish;
