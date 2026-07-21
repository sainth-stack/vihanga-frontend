import React from "react";
import { Col } from "react-bootstrap";
import Add from "assets/svg/Rectangle.svg";
import plus from "assets/svg/plus.svg";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";

export default function CreateColumn(props) {
  const isMobile = useWindowSize();
  const { t } = useTranslation();

  return (
    <Col
      className={`d-flex justify-content-${
        isMobile ? "end" : "end"
      } align-items-center`}
    >
      <div className="dropdown actionDropdown">
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
          >
            {t("Tasks.Create")}
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
          >
            {t("Tasks.Libray OKR")}
          </button>
          <button
            className="dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              props.setOrderModalShow3(true);
            }}
          >
            {t("Tasks.Non Library OKR")}
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
          <img src={Add} alt="add form" className="mr-1 mt-3 cursor-pointer" />
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
            {t("Tasks.Export as CSV")}
          </button>
          <button
            className="dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => window.print()}
          >
            {t("Tasks.Export as PDF")}
          </button>
        </div>
      </div>
    </Col>
  );
}
