import React from "react";
import "./styles.scss";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
export default function Overview({ report, pageNumber }) {
  return (
    <div className="container">
      <div className="bg-white vh-100  mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div className="">
          <h1 className="head-1 mt-5">Overview of Participant & Responses</h1>
          <div className=" mt-5">
            <p style={{ width: '95%' }}>
              The numbers below represent the number of completed surveys submitted by each respondent group prior to the due date. These figures only represent completed, submitted assessments.</p>
          </div>
          <div >
            <table style={{ borderRadius: '50px' }}>
              <thead>
                <tr className='thead text-center'>
                  <th scope="col" className="p-2 bg-green border-left-radius-10"></th>
                  <th scope="col" className="p-2 text-white bg-green">Report<br />N</th>
                  <th scope="col" className="p-2 text-white bg-green border-right-radius-10">Response Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className='row1 p-2'>
                  <th scope="row" className="p-2 ">Self</th>
                  <td className="p-2 text-center">{report.report.selfCompleted}</td>
                  <td className="p-2 text-center">100%</td>
                </tr>
                <tr className='row2'>
                  <th scope="row" className="p-2 ">Manager</th>
                  <td className="text-center">{report.report.managerCompleted}</td>
                  <td className="text-center">100%</td>
                </tr>
                <tr className='row1 p-2'>
                  <th scope="row" className="p-2 ">Peers</th>
                  <td className="p-2 text-center">{report.report.peersCompleted}</td>
                  <td className="p-2 text-center">100%</td>
                </tr>
                <tr className=''>
                  <th scope="row" className="p-2 row2 border-left-bottom-radius-10">Total</th>
                  <td className="p-2 text-center row2">{report.report.totalCompleted}</td>
                  <td className="p-2 text-center row2 border-right-bottom-radius-10">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}