import React from "react";
import wrong from "assets/svg/wrong.svg";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export default function ConfirmModal(props) {
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
          <h3>{t("Tasks.Are you sure to delete")}</h3>
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary m-2" onClick={props.onProceed}>
            {t("Tasks.Yes")}
          </button>
          <button className="btn btn-danger m-2" onClick={props.onHide}>
            {t("Tasks.No")}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
