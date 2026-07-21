/* eslint-disable no-unused-vars */
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
import { removeDuplicates, taskStatus, Validator } from "utilities";
import OkrDetails from "./OkrDetails";
const KRPopup = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="xl"
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
          View KRs
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <OkrDetails state={props.data} />
      </Modal.Body>
    </Modal>
  );
};

export default KRPopup;
