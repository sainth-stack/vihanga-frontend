import React from "react";
import { Col } from "react-bootstrap";
import search from "assets/svg/search.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import eye from "assets/svg/eye.svg";
import filter from "assets/svg/Filter.svg";
import filterIcon from "assets/svg/filterIcon.svg";
import eyeIcon from "assets/svg/eyeIcon.svg";
import moreIcon from "assets/svg/moreIcon.svg";
import SelectInputIcon from "components/Company/SelectInputIcon";
import { statusesActive } from "utilities";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";

export default function ObjectiveHeader({
  searchKey,
  setSearchKey,
  privileges,
  handleSureDelete,
  handleCascade,
  checkboxOptions,
  filterOptions,
  onChangeText2,
  showSearchIcon,
  searchIcon,
}) {
  const isMobile = useWindowSize();
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-between align-items-center m-2 flex-wrap">
      {!isMobile && (
        <div className="input-group col-lg-6 col-xs-12 col-sm-12 p-0 mt-5 nav-item search-bar">
          <div className="input-group-append searchInput-icon ">
            <img src={search} alt="search-icon" className="searchIcon" />
          </div>
          <input
            type="text"
            className="bg-light outline-none searchInput text-dark mt-0 fs14"
            placeholder="Search Objective by Due date, Owner or Success Metrics"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
      )}
      <div className={`${isMobile ? "" : "col-sm-6"}`}>
        <div className={isMobile ? "d-flex" : "row"}>
          {isMobile && (
            <div className="d-flex justify-content-between">
              <img
                src={search}
                alt="search-icon"
                className="mt-2 searchIcon searchIconMobile"
                onClick={() => showSearchIcon(!searchIcon)}
              />
              <div className="ml-2 searchIconMobile border-seperate" />
            </div>
          )}
          <Col className={isMobile ? "p-0" : "mt-5 col-sm"}>
            <div className="dropdown actionDropdown">
              {isMobile ? (
                <img
                  src={moreIcon}
                  alt="add form"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  className="mr-1 mt-2 cursor-pointer"
                />
              ) : (
                <button
                  className="btn dropdown-hide text-capitalize p-2  circle border fs16 w-100"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {t("objectives.Action")}
                </button>
              )}
              <div
                className="dropdown-menu m-1 col-sm"
                aria-labelledby="dropdownMenuButton"
              >
                {privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Objectives"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Objectives"
                  )[0].delete && (
                    <button
                      className="dropdown-item text-capitalize fs16"
                      onClick={() => handleSureDelete()}
                    >
                      <img src={trashIcon} alt="delete table icon" />
                      &nbsp; {t("objectives.Delete")}
                    </button>
                  )}

                {privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Cascade Objectives"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Cascade Objectives"
                  )[0].view && (
                    <button
                      className="dropdown-item text-capitalize fs16"
                      onClick={() => handleCascade()}
                    >
                      <img src={eye} alt="Cascade" />
                      &nbsp; {t("objectives.Cascade")}
                    </button>
                  )}
              </div>
            </div>
          </Col>
          <Col className={isMobile ? "p-0 mt-2" : "mt-5 col-sm"}>
            <SelectInputIcon
              label=""
              icon={isMobile ? eyeIcon : eye}
              style={{ backgroundImage: "none", textAlign: "center" }}
              placeholder={t("objectives.Display Options")}
              name="action"
              options={statusesActive}
              checkboxOptions={checkboxOptions}
            />
          </Col>
          <Col className={isMobile ? "p-0 mt-2" : "mt-5 col-sm"}>
            <SelectInputIcon
              label=""
              icon={isMobile ? filterIcon : filter}
              style={{ backgroundImage: "none", textAlign: "center" }}
              placeholder={t("Tasks.Status")}
              name="status"
              options={statusesActive}
              checkboxOptions={filterOptions}
              onChangeText={(e) => onChangeText2(e)}
            />
          </Col>
        </div>
      </div>
    </div>
  );
}
