import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Objectives1Popup from "./objectives1Poppup";
import SearchEmployees from "./SearchEmployees";
import { Toast } from "service/toast";
import { useGetGoals } from "../hooks/useGetEmployees";
export default function CascadedPopup(props) {
  const [orderModalShow1, setOrderModalShow1] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const { data, isLoading } = useGetGoals();
  const handleSaveData = (data) => {
    let ownerDetails =
      localStorage.getItem("userData") !== null
        ? JSON.parse(localStorage.getItem("userData"))
        : null;
    if (ownerDetails !== null) {
      let selectedResult = data.map((item) => ({
        ...item,
        owner: ownerDetails.ownerId,
      }));
      setSelectedData(selectedResult);
      //setOrderModalShow1(false);
    } else {
      Toast({
        type: "warning",
        message: "Owner Details Not Found",
        time: 4000,
      });
    }
  };
  const handleCallback = (childData) => {
    if (childData.dataRefresh) {
      props.handleCallback({
        dataRefresh: true,
      });
    }
  };
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
          Do you want to assign this Goal to someone?
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        {orderModalShow1 && (
          <Objectives1Popup
            show={orderModalShow1}
            onHide={() => setOrderModalShow1(false)}
            handleSaveData={(data) => handleSaveData(data)}
            selectedObjective={props.selectedObjective}
            objectives={!isLoading ? data.data.map(item => ({ key: item.objective, value: item._id, ...item })) : []}
          />
        )}
        <SearchEmployees
          selectedData={selectedData}
          onHide={props.onHide}
          handleCallback={handleCallback}
        />
      </Modal.Body>
    </Modal>
  );
}
