import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import { LoadingIndicator } from "utilities";
import { useTranslation } from "react-i18next";
const HandleBulk = (props) => {
  const [loading] = useState(false);
  const { t } = useTranslation();
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="sm"
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
          Bulk Move
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12  p-4 m-4 ">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <div>
              <div className="form-group d-flex justify-content-between">
                <Button
                  text={t("Tasks.Not Started")}
                  className="bg-green border text-white"
                  handleClick={() => props.handleBulkMove("notstarted")}
                />
              </div>
              <div className="form-group d-flex justify-content-between">
                <Button
                  text={t("Tasks.In Progress")}
                  className="bg-green border text-white"
                  handleClick={() => props.handleBulkMove("inprogress")}
                />
              </div>
              <div className="form-group d-flex justify-content-between">
                <Button
                  text={t("Tasks.Completed")}
                  className="bg-green border text-white"
                  handleClick={() => props.handleBulkMove("completed")}
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HandleBulk;
