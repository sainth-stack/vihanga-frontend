import React from "react";
import { Col } from "react-bootstrap";
import Add from "assets/svg/Rectangle.svg";
import { t } from "i18next";

export default function CreateAndExport({
  isMobile,
  handleCreate,
  forwardRef,
}) {
  return (
    <Col
      className={`d-flex justify-content-${
        isMobile ? "center" : "end"
      } align-items-center`}
    >
      <div className="  dropdown actionDropdown" ref={forwardRef}>
        <button
          className="dropdown-hide create-btn bg-green  mt-4 m-2  text-white border  p-1"
          style={{ borderRadius: "30px" }}
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdownMenuButton"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={handleCreate}
        >
          {t("Tasks.Create Task")}
        </button>
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
            onClick={() => window.print()}
          >
            {t("Tasks.Export as PDF")}
          </button>
        </div>
      </div>
    </Col>
  );
}
