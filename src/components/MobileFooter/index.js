import React, { useState } from 'react';
import "./styles.scss";
import { Link } from "react-scroll";
import analytics from "assets/svg/analytics.svg";
import okrProgress from "assets/svg/okrProgress.svg";
import celebrationList from "assets/svg/celebrationList.svg";
import leaderBoard from "assets/svg/leaderBoard.svg";

import analyticsFill from "assets/svg/analyticsFill.svg";
import okrProgressFill from "assets/svg/okrProgressFill.svg";
import celebrationListFill from "assets/svg/celebrationListFill.svg";
import leaderBoardFill from "assets/svg/leaderBoardFill.svg";

const MobileFooter = () => {
  const [actObj, setIsActObj] = useState({
    analytics: 1,
    okrProgress: 0,
    celebrationList: 0,
    leaderBoard: 0
  });
  return (
    <div style={{ position: "fixed", bottom: "0%", width: "100%", zIndex: 1 }}>
      <nav className="m-footer">
        <Link to="analyticsOverview" smooth={true} onClick={() => setIsActObj({ ...actObj, analytics: 1, okrProgress: 0, celebrationList: 0, leaderBoard: 0 })}><img src={actObj.analytics === 1 ? analyticsFill : analytics} alt="analytics" /></Link>
        <Link to="okrProgress" smooth={true} onClick={() => setIsActObj({ ...actObj, analytics: 0, okrProgress: 1, celebrationList: 0, leaderBoard: 0 })}><img src={actObj.okrProgress === 1 ? okrProgressFill : okrProgress} alt="okrProgress" /></Link>
        <Link to="celebrationList" smooth={true} onClick={() => setIsActObj({ ...actObj, analytics: 0, okrProgress: 0, celebrationList: 1, leaderBoard: 0 })}><img src={actObj.celebrationList === 1 ? celebrationListFill : celebrationList} alt="celebrationList" /></Link>
        <Link to="leaderBoard" smooth={true} onClick={() => setIsActObj({ ...actObj, analytics: 0, okrProgress: 0, celebrationList: 0, leaderBoard: 1 })}><img src={actObj.leaderBoard === 1 ? leaderBoardFill : leaderBoard} alt="leaderBoard" /></Link>
      </nav>
    </div>
  )
}

export default MobileFooter;