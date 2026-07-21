import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import useWindowSize from "components/UseWindowSize";
import { Col, Row } from "react-bootstrap";
import cascadeObjectiveDiagram from "assets/svg/cascade-objective-diagram.svg";

import Objectives1Popup from "./objectives1Poppup";
import SearchEmployees from "./SearchEmployees";
import { Toast } from "service/toast";
import { useGetGoals } from "pages/Goals/hooks/useGetEmployees";
import { useTranslation } from "react-i18next";
export default function CascadedPopup(props) {
  const [orderModalShow1, setOrderModalShow1] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [rollupActual, setRollupActual] = useState(false);
  const { data, isLoading } = useGetGoals();
  const isMobile = useWindowSize();
  const objectives1 = () => {
    document.getElementById("objective1").checked = true;
    setOrderModalShow1(true);
  };
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
  const { t } = useTranslation();
  const cascadeObjectiveCard = (
    <div
      className="cascade-objective-card"
      onClick={objectives1}
      role="presentation"
    >
      <div className="cascade-objective-card__header">
        <input
          type="radio"
          value="objective"
          name="assignTo"
          id="objective1"
        />
      </div>
      <div className="cascade-objective-card__diagram">
        <img
          src={cascadeObjectiveDiagram}
          alt=""
          width={456}
          height={314}
        />
      </div>
    </div>
  );
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
          {t("OKR Details.Do you want to assign this KR to someone?")}
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body className="cascade-modal-body">
        {isMobile ? (
          cascadeObjectiveCard
        ) : (
          <Row>
            <Col>{cascadeObjectiveCard}</Col>
          </Row>
        )}

        {orderModalShow1 && (
          <Objectives1Popup
            show={orderModalShow1}
            onHide={() => setOrderModalShow1(false)}
            handleSaveData={(data) => handleSaveData(data)}
            selectedObjective={props.selectedObjective}
            objectives={
              !isLoading
                ? data.data.map((item) => ({
                    key: item.objective,
                    value: item._id,
                    ...item,
                  }))
                : []
            }
          />
        )}

        <div className="m-3">
          <input
            type="checkbox"
            id="rollupactual"
            checked={rollupActual}
            name="rollupactual"
            value={rollupActual}
            onChange={() => setRollupActual(!rollupActual)}
          />{" "}
          <label htmlFor="rollupactual">{t("OKR Details.Rollup Actual")}</label>
        </div>
        <SearchEmployees
          selectedData={selectedData}
          selectedData2={[]}
          rollupActual={rollupActual}
          onHide={props.onHide}
          handleCallback={handleCallback}
        />
      </Modal.Body>
    </Modal>
  );
} 