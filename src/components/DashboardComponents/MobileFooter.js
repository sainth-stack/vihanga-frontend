import React from 'react';
import "./styles.scss";
import { Link } from "react-scroll";
import analytics from "assets/svg/analytics.svg";
import okrProgress from "assets/svg/okrProgress.svg";
import celebrationList from "assets/svg/celebrationList.svg";
import leaderBoard from "assets/svg/leaderBoard.svg";

const MobileFooter = () => {
  return (
    <div style={{ position: "fixed", bottom: "0%", width: "100%", left: 0, zIndex: 1 }}>
      <nav className="m-footer">
        <Link to="analyticsOverview" smooth={true}><img src={analytics} alt="analytics" /></Link>
        <Link to="okrProgress" smooth={true}><img src={okrProgress} alt="okrProgress" /></Link>
        <Link to="celebrationList" smooth={true}><img src={celebrationList} alt="celebrationList" /></Link>
        <Link to="leaderBoard" smooth={true}><img src={leaderBoard} alt="leaderBoard" /></Link>
      </nav>
    </div>
  )
}

export default MobileFooter;