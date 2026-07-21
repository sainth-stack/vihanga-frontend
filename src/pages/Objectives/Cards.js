import React from "react";
import { Row } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";
Chart.register(ArcElement);
export function Cards({
  data1,
  data2,
  data3,
  data4,
  data5,
  data6,
  companyInfo,
}) {
  const isMobile = useWindowSize();
  let chartColor = "Red";
  let chartColor2 = "Red";
  let chartColor3 = "Red";
  let chartColor4 = "Red";
  let chartColor5 = "Red";
  let chartColor6 = "Red";
  let progressValue =
    data1 &&
    data1.datasets.length > 0 &&
    data1.datasets[0].data.length > 0 &&
    data1?.datasets[0]?.data[0];
  if (progressValue > 0 && progressValue <= 60) {
    chartColor = "Red";
  } else if (progressValue > 60 && progressValue <= 80) {
    chartColor = "Orange";
  } else if (progressValue > 80) {
    chartColor = "Green";
  }
  let progressValue2 =
    data2 &&
    data2.datasets.length > 0 &&
    data2.datasets[0].data.length > 0 &&
    data2?.datasets[0]?.data[0];
  if (progressValue2 > 0 && progressValue2 <= 60) {
    chartColor = "Red";
  } else if (progressValue2 > 60 && progressValue2 <= 80) {
    chartColor = "Orange";
  } else if (progressValue2 > 80) {
    chartColor = "Green";
  }
  let progressValue3 =
    data3 &&
    data3.datasets.length > 0 &&
    data3.datasets[0].data.length > 0 &&
    data3?.datasets[0]?.data[0];
  if (progressValue3 > 0 && progressValue3 <= 60) {
    chartColor = "Red";
  } else if (progressValue3 > 60 && progressValue3 <= 80) {
    chartColor = "Orange";
  } else if (progressValue3 > 80) {
    chartColor = "Green";
  }
  let progressValue4 =
    data4 &&
    data4.datasets.length > 0 &&
    data4.datasets[0].data.length > 0 &&
    data4?.datasets[0]?.data[0];
  if (progressValue4 > 0 && progressValue4 <= 60) {
    chartColor = "Red";
  } else if (progressValue4 > 60 && progressValue4 <= 80) {
    chartColor = "Orange";
  } else if (progressValue4 > 80) {
    chartColor = "Green";
  }
  let progressValue5 =
    data5 &&
    data5.datasets.length > 0 &&
    data5.datasets[0].data.length > 0 &&
    data5?.datasets[0]?.data[0];
  if (progressValue5 > 0 && progressValue5 <= 60) {
    chartColor = "Red";
  } else if (progressValue5 > 60 && progressValue5 <= 80) {
    chartColor = "Orange";
  } else if (progressValue5 > 80) {
    chartColor = "Green";
  }
  let progressValue6 =
    data6 &&
    data6.datasets.length > 0 &&
    data6.datasets[0].data.length > 0 &&
    data6?.datasets[0]?.data[0];
  if (progressValue6 > 0 && progressValue6 <= 60) {
    chartColor = "Red";
  } else if (progressValue6 > 60 && progressValue6 <= 80) {
    chartColor = "Orange";
  } else if (progressValue6 > 80) {
    chartColor = "Green";
  }

  const { t } = useTranslation();

  // console.log("datas fro cards",data1, data2,data3,data4,data5,data6)
  return (
    <>
      <Row className="mt-1 d-flex justify-content-center">
        <Card6
          data={data1}
          title={`${t("objectives.Total_weight")} ${
            isMobile ? "" : data1.datasets[0].data[0]
          }`}
          chartColor={chartColor}
        />
        <Card6
          data={data2}
          title={`${t("objectives.Total_weight_achievement")} ${
            isMobile ? "" : data2.datasets[0].data[0] + "%"
          }`}
          chartColor={chartColor2}
        />
      </Row>
      <Row className="mt-1">
        <Card3
          data={data3}
          title={`Q1 ${companyInfo.okrYear}`}
          color="success"
          chartColor={chartColor3}
          percent="59.50"
        />
        <Card3
          data={data4}
          title={`Q2 ${companyInfo.okrYear}`}
          color="warning"
          chartColor={chartColor4}
          percent="50.75"
        />
        <Card3
          data={data5}
          title={`Q3 ${companyInfo.okrYear}`}
          color="danger"
          chartColor={chartColor5}
          percent="71.00"
        />
        <Card3
          data={data6}
          title={`Q4 ${companyInfo.okrYear}`}
          color="warning"
          chartColor={chartColor6}
          percent="50.75"
        />
      </Row>
    </>
  );
}

function Card6({ data, title = "", chartColor }) {
  const isMobile = useWindowSize();
  let finalData = {
    ...data,
  };
  return (
    <div className={` ${isMobile ? "col-6 p-0 m-0" : "col-lg-6"} `}>
      <div className={`card card-body m-2 rounded ${isMobile ? "h200" : ""}`}>
        <Row
          className={`d-flex justify-content-${
            isMobile ? "center" : "between"
          } align-items-center ${isMobile ? "text-center" : ""}`}
        >
          {!isMobile && (
            <h6 className={`card-title pl-2 ${isMobile ? "w-100" : ""}`}>
              {title}
            </h6>
          )}
          <div
            style={{ width: isMobile ? 60 : 90, height: isMobile ? 60 : 80 }}
          >
            <Pie data={finalData} />
          </div>
          {isMobile && (
            <h6
              className={`card-title pl-2 font-weight-bold ${
                isMobile ? "w-100 pt-2 pb-0 mb-0" : ""
              }`}
            >
              {title}
            </h6>
          )}
        </Row>
      </div>
    </div>
  );
}

function Card3({ data, title = "", color, percent = "0", chartColor }) {
  const isMobile = useWindowSize();
  let finalData = {
    ...data,
  };
  return (
    <div className={` ${isMobile ? "col-6 p-0 m-0" : "col-lg-3"} `}>
      <div className={`card card-body m-2 rounded ${isMobile ? "h200" : ""}`}>
        <Row
          className={`d-flex justify-content-${
            isMobile ? "center" : "between"
          } align-items-center ${isMobile ? "text-center" : ""}`}
        >
          {!isMobile && (
            <div className={`${isMobile ? "w-100" : ""}`}>
              <h6 className={`card-title pl-2 text-${color}`}>
                {data.datasets[0].data[0]}%
              </h6>
              <p className="pl-2 font-weight-bold">{title}</p>
            </div>
          )}
          <div
            style={{ width: isMobile ? 60 : 90, height: isMobile ? 60 : 80 }}
          >
            <Pie data={finalData} />
          </div>
          {isMobile && (
            <div className={`${isMobile ? "w-100 pt-2 pb-0 mb-0" : ""}`}>
              <h6 className={`card-title pl-2  mb-0 pb-0 text-${color}`}>
                {data.datasets[0].data[0]}%
              </h6>
              <p className="pl-2 font-weight-bold pb-0 mb-0">{title}</p>
            </div>
          )}
        </Row>
      </div>
    </div>
  );
}
