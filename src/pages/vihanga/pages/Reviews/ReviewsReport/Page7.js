import React from "react";
import "./styles.scss";
import page8 from 'assets/svg/page8.svg'
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import TableView1 from "./TableView1";
export default function Conscientiousness({ report }) {
  return (
    <div className="container">
      <div className="bg-white h-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">Cooperation</h1>
          <div className="mt-5 text-center">
            <img src={page8} width="70%" />
          </div>
          <TableView1 />
          <div className="pt-4 pb-4">
            Based on the overall average of your results of the <span style={{ fontWeight: 'bold' }}>Conscientiousness</span> competency breakdown, your capability to <span style={{ fontWeight: 'bold' }}>Allocate time and resources for individual and team objectives and achieve effective levels of productivity targets</span>  has been <span className="font-weight-bold">Highly Satisfactory</span> for the effectiveness of your team and for Vihanga. <br /><br />
            Your capability to <span className="font-weight-bold"> Proactively take initiatives on responsibilities as well as tasks and involve ideas and feedback from other in planning the execution of those responsibilities</span> has <span className="font-weight-bold">been more than Satisfactory</span> for the effectiveness of your team and for Vihanga.
          </div>
        </div>
      </div>
      <PageNumber pageNumber={7} />
    </div>
  );
}