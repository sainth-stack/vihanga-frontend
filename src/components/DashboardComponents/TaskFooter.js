import React, { useState } from 'react';
import "./styles.scss";
import { Link } from "react-scroll";
import nav1filled from "assets/svg/notstarted1.svg";
import notstarted from "assets/svg/notstarted2.svg";
import inprogress from "assets/svg/inprogress.svg";
import started from "assets/svg/started.svg";
import inprogressfilled from "assets/svg/inprogressfilled.svg";
import startedfilled from "assets/svg/startedfilled.svg";


const TasksFooter = () => {
  const [actObj, setIsActObj] = useState({
    notstarted: 1,
    inprogress: 0,
    started: 0
  });
  return (
    <div className='task-footer'>
      <nav className="m-footer">
        <Link to="notstarted" smooth={true} onClick={() => setIsActObj({ ...actObj, notstarted: 1, inprogress: 0, started: 0 })}><img src={actObj.notstarted === 1 ? nav1filled : notstarted} alt="notstarted" /></Link>
        <Link to="inprogress" smooth={true} onClick={() => setIsActObj({ ...actObj, notstarted: 0, inprogress: 1, started: 0 })}><img src={actObj.inprogress === 1 ? inprogressfilled : inprogress} alt="inprogress" /></Link>
        <Link to="completed" smooth={true} onClick={() => setIsActObj({ ...actObj, notstarted: 0, inprogress: 0, started: 1 })}><img src={actObj.started === 1 ? startedfilled : started} alt="started" /></Link>
      </nav>
    </div>
  )
}

export default TasksFooter;