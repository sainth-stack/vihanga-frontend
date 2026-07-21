import React, { useState } from 'react';
import "./styles.scss";
import { Link } from "react-scroll";
import okrsummary from "assets/svg/okrsummary.svg";
import okrsummaryFilled from "assets/svg/okrSummaryFilled.svg";
import okrReport from "assets/svg/okrReport.svg";
import okrReportFilled from "assets/svg/okrReportFilled.svg";

const ObjectivesFooter = () => {
  const [actObj, setIsActObj] = useState({
    okrSummary: 1,
    okrReport: 0,
  });
  return (
    <div style={{ position: "fixed", bottom: "0%", width: "100%", zIndex: 1 }}>
      <nav className="m-footer">
        <Link to="okrSummary" smooth={true} onClick={() => setIsActObj({ ...actObj, okrSummary: 1, okrReport: 0 })}><img src={actObj.okrSummary === 1 ? okrsummaryFilled : okrsummary} alt="OKR Summary" /></Link>
        <Link to="report" smooth={true} onClick={() => setIsActObj({ ...actObj, okrSummary: 0, okrReport: 1 })}><img src={actObj.okrReport === 1 ? okrReportFilled : okrReport} alt="Report" /></Link>
      </nav>
    </div>
  )
}

export default ObjectivesFooter;