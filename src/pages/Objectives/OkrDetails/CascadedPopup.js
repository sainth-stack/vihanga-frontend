import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import nextarrow from "assets/svg/nextarrow.svg";
import useWindowSize from "components/UseWindowSize";
import { Col, Row } from "react-bootstrap";
import img1 from "assets/images/img2.png";
import img2 from "assets/images/img1.png";

import Objectives1Popup from "./objectives1Poppup";
import Objectives2Popup from "./objectives2Popup";
import SearchEmployees from "./SearchEmployees";
import { Toast } from "service/toast";
import { useGetGoals } from "pages/Goals/hooks/useGetEmployees";
import { useTranslation } from "react-i18next";
export default function CascadedPopup(props) {
  const [orderModalShow1, setOrderModalShow1] = useState(false);
  const [orderModalShow2, setOrderModalShow2] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedData2, setSelectedData2] = useState([]);
  const [rollupActual, setRollupActual] = useState(false);
  const { data, isLoading } = useGetGoals();
  const isMobile = useWindowSize();
  const objectives1 = () => {
    document.getElementById("objective1").checked = true;
    setOrderModalShow1(true);
    setOrderModalShow2(false);
  };
  const objectives2 = () => {
    document.getElementById("objective2").checked = true;
    setOrderModalShow2(true);
    setOrderModalShow1(false);
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
  const handleSaveData2 = (data) => {
    let ownerDetails =
      localStorage.getItem("userData") !== null
        ? JSON.parse(localStorage.getItem("userData"))
        : null;
    if (ownerDetails !== null) {
      let selectedResult = data.map((item) => ({
        ...item,
        owner: ownerDetails.ownerId,
      }));
      setSelectedData2(selectedResult);
    } else {
      Toast({
        type: "warning",
        message: "Owner Details Not Found",
        time: 4000,
      });
    }
  };

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
          {t("OKR Details.Do you want to assign this KR to someone?")}
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        {isMobile ? (
          <div id="demo" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={img1} alt="Los Angeles" />
                <div className="alignment">
                  {" "}
                  <input
                    style={{ width: "40" }}
                    type="radio"
                    value="objective"
                    name="assignTo"
                    id="objective1"
                  />
                </div>
              </div>
              <div className="carousel-item">
                <img src={img2} alt="Chicago" />
                <div className="alignment">
                  {" "}
                  <input
                    style={{ width: "40" }}
                    type="radio"
                    value="keyResults"
                    name="assignTo"
                    id="objective2"
                  />
                </div>
              </div>
            </div>
            <a className="carousel-control-next" href="#demo" data-slide="next">
              <img src={nextarrow} alt="nextarrow" />
            </a>
          </div>
        ) : (
          <Row>
            <Col>
              <div className="" onClick={objectives1}>
                <img src={img1} alt="img1" />
                <div className="alignment">
                  {" "}
                  <input
                    style={{ width: "40" }}
                    type="radio"
                    value="objective"
                    name="assignTo"
                    id="objective1"
                  />
                </div>
              </div>
            </Col>
            <Col>
              <div onClick={objectives2}>
                <img src={img2} alt="img1" />
                <div className="alignment">
                  {" "}
                  <input
                    style={{ width: "40" }}
                    type="radio"
                    value="keyResults"
                    name="assignTo"
                    id="objective2"
                  />
                </div>
              </div>
            </Col>
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

        {orderModalShow2 && (
          <Objectives2Popup
            show={orderModalShow2}
            onHide={() => setOrderModalShow2(false)}
            handleSaveData2={(data) => handleSaveData2(data)}
            selectedObjective={props.selectedObjective}
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
          selectedData2={selectedData2}
          onHide={props.onHide}
          handleCallback={handleCallback}
        />
      </Modal.Body>
    </Modal>
  );
}
