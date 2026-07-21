import React, { useState } from "react";
import { Col } from "react-bootstrap";
import Add from "assets/svg/Rectangle.svg";
import plus from "assets/svg/plus.svg";
import useWindowSize from "components/UseWindowSize";
import "./show.scss";
import { cascadeTabs } from "utilities";
import { useDispatch } from "react-redux";
import { setCurrentTab, setTabReadOnly } from "reducer/userSlice";
import { useTranslation } from "react-i18next";

export default function CreateColumn(props) {
  const isMobile = useWindowSize();
  const [activeURL, setActiveURL] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <div
      className="d-flex justify-content-between"
      style={{ flexWrap: "wrap" }}
    >
      <div className="mt-4 pl-3">
        <div className="team-tabs">
          {props.isIndividual && (
            <div
              onClick={() => {
                dispatch(setCurrentTab(cascadeTabs.Individual));
                setTimeout(() => {
                  props.filterCascadeData(cascadeTabs.Individual, 0);
                  dispatch(setTabReadOnly(false));
                  setActiveURL(0);
                }, 100);
              }}
              className={`text-decoration-none nav display-inline cursor-pointer ${
                activeURL === 0 ? "activeLink" : ""
              }`}
            >
              {t("objectives.Individual")}
            </div>
          )}
          {props.isTeam && (
            <div
              onClick={() => {
                dispatch(setCurrentTab(cascadeTabs.Team));
                setTimeout(() => {
                  props.filterCascadeData(cascadeTabs.Team, 1);
                  dispatch(setTabReadOnly(true));
                  setActiveURL(1);
                }, 100);
              }}
              className={`text-decoration-none nav display-inline cursor-pointer ${
                activeURL === 1 ? "activeLink" : ""
              }`}
            >
              {t("objectives.Team")}
            </div>
          )}

          {props.isCompany && (
            <div
              onClick={() => {
                dispatch(setCurrentTab(cascadeTabs.Company));
                setTimeout(() => {
                  props.filterCascadeData(cascadeTabs.Company, 2);
                  dispatch(setTabReadOnly(true));
                  setActiveURL(2);
                }, 100);
              }}
              className={`text-decoration-none nav display-inline cursor-pointer ${
                activeURL === 2 ? "activeLink" : ""
              }`}
            >
              {t("objectives.Company")}
            </div>
          )}
        </div>
      </div>
      <Col
        className={`d-flex justify-content-${
          isMobile ? "end" : "end"
        } align-items-center`}
      >
        <div className="dropdown actionDropdown" ref={props.forwardedRef}>
          {isMobile ? (
            <img
              src={plus}
              alt="add form"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              className="mr-1 mt-3 cursor-pointer w-35"
            />
          ) : (
            <button
              className="dropdown-hide create-btn bg-green rounded mt-4 m-2 text-white border circle p-1"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={props.handlecallback}
            >
              {t("objectives.Create")}
            </button>
          )}
          <div
            className="dropdown-menu text-left "
            aria-labelledby="dropdownMenuButton"
          >
            <button
              className="dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => {
                props.setOrderModalShow5(true);
              }}
              ref={props.forwardedRef1}
            >
              {t("objectives.Library_okr")}
            </button>
            <button
              className="dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => {
                props.setOrderModalShow3(true);
              }}
              ref={props.forwardedRef2}
            >
              {t("objectives.Non_library_okr")}
            </button>
          </div>
        </div>

        <div className="dropdown actionDropdown">
          <span
            className="dropdown-hide align-items-center"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              src={Add}
              alt="add form"
              className="mr-1 mt-3 cursor-pointer"
            />
          </span>
          <div
            className="dropdown-menu dropdown-menu-right text-left "
            aria-labelledby="dropdownMenuButton"
          >
            <button
              className="dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => {
                document.getElementById("exportcsv").click();
              }}
            >
              {t("objectives.Export_as_csv")}
            </button>
            <button
              className="dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => window.print()}
            >
              {t("objectives.Export_as_pdf")}
            </button>
          </div>
        </div>
      </Col>
    </div>
  );
}
