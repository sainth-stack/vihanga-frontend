/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import "./styles.scss";
import flatDots from "assets/svg/flatDots.svg";
import bargraph1 from "assets/svg/bargraph1.svg";
import bargraph2 from "assets/svg/bargraph2.svg";
import bargraph4 from "assets/svg/bargraph4.svg";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";
export default function Taskpercent({ data1, rewardPoints, totalTasks, completedTasks, role = "", tab = "", privileges = [], taskPercent, taskPercentAchieved, rewardPointsAchieved }) {
  const isMobile = useWindowSize();
  const {t} = useTranslation()
  return (
    <>
      <Row className={isMobile ? "d-flex justify-content-center" : "mt-3 mb-3"}>
        {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Tasks")[0].view && <Card3
          data={data1}
          title1={`${role !== "Employee" && tab !== "me" ? "Team" : ""} ${t("Dashboard.tasks")}`}
          title={Number(taskPercent).toFixed(2)}
          arrow="up"
          color="#01a8fd"
          bargraph={bargraph1}
          chartColor="primary"
          percent={totalTasks}
          isMobile={isMobile}
          type=""
          url="/tasks"
        />}
        {/* <Card3
          data={data1}
          title1={`${role !== "Employee" && tab !== "me" ? "Team" : ""} Kudos Received`}
          title="0.7"
          arrow="down"
          color="#FA9EA5"
          bargraph={bargraph3}
          chartColor="red"
          percent="40"
          isMobile={isMobile}
        /> */}
        {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Achievement").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Achievement")[0].view && <Card3
          data={data1}
          title1={`${role !== "Employee" && tab !== "me" ? "Team" : ""} ${t("Dashboard.achievement")}`}
          title={Number(taskPercentAchieved).toFixed(2)}
          arrow="up"
          color="#B34EFB"
          bargraph={bargraph4}
          chartColor="info"
          percent={completedTasks}
          type=""
          isMobile={isMobile}
          url="/tasks"
        />}
        {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Reward Points").length > 0 && privileges.filter(privilege => privilege.page === "Dashboard - Reward Points")[0].view && <Card3
          data={data1}
          title1={`${role !== "Employee" && tab !== "me" ? "Team" : ""} ${t("Dashboard.points")}`}
          title={Number(rewardPointsAchieved).toFixed(2)}
          arrow="up"
          color="#C16999"
          bargraph={bargraph2}
          chartColor="orange"
          percent={rewardPoints}
          type="rewardpoints"
          isMobile={isMobile}
          url="/rewards/rewardsRedemption"
        />}
      </Row>
    </>
  );
}

function Card3({
  data,
  title1 = "",
  title = "",
  color,
  arrow,
  percent = "0",
  chartColor,
  bargraph,
  isMobile,
  type,
  url
}) {
  const history = useHistory();
  const handleTask = (url) => {
    history.push('/admin' + url);
  }
  return (
    <div className={isMobile ? "col-11 mt-3 p-1" : "col-lg-4"}>
      <div className="team-card p-0">
        <div className="d-flex justify-content-between align-items-center">
          <p className="fs12 font-weight-bold p-2 m-0" style={{ "cursor": 'pointer' }} id={title1} onClick={() => handleTask(url)}>{title1}</p>
          <img src={flatDots} alt="flatDots" className="p-2" />
        </div>
        <div className="row d-flex justify-content-between">
          <div className="">
            <p className="percent ml-4">{percent}</p>
            {type !== "rewardpoints" && <div className="d-flex ml-4 mt-0">
              {/*<img src={upArrow} alt="upArrow" />*/}
              <i
                className={`fa fa-arrow-${title > 0 ? 'up' : 'down'} mt-2 fs12`}
                style={{
                  color: "white",
                  background: color,
                  borderRadius: 100,
                  width: 15,
                  height: 15,
                  padding: 2,
                  textAlign: "center",
                }}
              />
              <h6 className={`pl-2 text-${color} mt-2 fs14`}>{title}%</h6>
            </div>}
          </div>
          <div className="m-4">
            {/* <PieChart width={90} height={60}>
          <Pie data={data} dataKey="students" outerRadius={30} fill={chartColor} />
        </PieChart> */}
            <img src={bargraph} style={{ width: "50px", visibility: type !== "rewardpoints" ? "visible" : "hidden" }} alt="bargraph" />
          </div>
        </div>
      </div>
    </div>
  );
}
