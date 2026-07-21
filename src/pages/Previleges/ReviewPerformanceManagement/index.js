/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TitleHeader from "components/TitleHeader";
import { useState } from "react";
import "./index.css";
import "./style.scss";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import useWindowSize from "components/UseWindowSize";
import TransferTab from "./Templates";
import GuideLinesTab from "./GuideLinesTab";
import SessionTab from "./Session";

function ReviewPerformanceManagement() {
  const isMobile = useWindowSize();
  const [value, setValue] = useState(0);

  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div
        className={
          isMobile
            ? "bg-light-primary rounded-12 "
            : "bg-light-primary rounded-12 mh-100 p-4 m-4"
        }
      >
        <p
          className={
            isMobile
              ? "title text-dark font-weight-bold text-center"
              : "title text-dark font-weight-bold pb20"
          }
        >
          OKR Management
        </p>
        <div className="company-form">
          <div className="d-flex justify-content-center">
            <Tabs
              value={value}
              textColor="primary"
              indicatorColor="primary"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <Tab label="Templates" />
              <Tab label="Session" />
              <Tab label="Guidelines" />
            </Tabs>
          </div>
          {value === 0 && <TransferTab />}
          {value === 1 && (
            <div className="mt-3">
              <SessionTab />
            </div>
          )}
          {value === 2 && (
            <div className="mt-3">
              <GuideLinesTab />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ReviewPerformanceManagement;
