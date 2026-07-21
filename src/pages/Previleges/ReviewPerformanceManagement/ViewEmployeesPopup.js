import React from "react";
import { Modal } from "react-bootstrap";
import "./style.scss";
import wrong from "assets/svg/wrong.svg";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { defaultProfilePic } from "utilities";

const ViewEmployeesPopup = (props) => {
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
          View Employees
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12 mh-100 p-4 m-4">
          {props.employees.length > 0 ? props.employees.map((item, index) => (
            <div className="d-flex align-items-center mb-3 bg-white border-bottom">
              <img src={item.profilePicture ? item.profilePicture : defaultProfilePic} alt="profile" className="user-pic" />
              <p className="m-2">{item.key}</p>
            </div>
          )) : <h4>No Employees</h4>}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewEmployeesPopup;
