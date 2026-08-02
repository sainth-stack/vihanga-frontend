import React from "react";
import "./styles.scss";
import appLogo from "../../assets/images/appLogo.jpg";
import reviewsetting from "../../assets/svg/reviewssetting.svg";
import reviewspaper from "../../assets/svg/reviewspaper.svg";
import PageNumber from "./PageNumber";

export default function EmployeeAssessment({ report, pageNumber }) {
  return (
    <div className="bg-brown">
      <div className="bg-white bgReview">
        <div className='d-flex justify-content-center main-card'>
          <div className="bg-white center-card">
            <div className="d-flex justify-content-center mt-3">
              {/*<Logo />*/}
              <img src={appLogo} className="appLogoReview" alt="applogo" />&nbsp;&nbsp;
              <p className="text-dark logoTextReview"><span className="talentReview">TALENT</span><span className="spotifyReview">SPOTIFY</span></p>
              <img className="reviewsetting" src={reviewsetting} alt="review settings" />
              <img className="reviewspaper" src={reviewspaper} alt="reviews paper" />
            </div>
            <div className="d-flex justify-content-center mt-5">
              <div className="boldline mt-3" style={{ width: '15%' }}>.</div>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <p className="main-content">Vihanga Employee Assessment</p>
            </div>
            <div className="d-flex justify-content-center mt-2">
              <p className="review-content">Feedback Report for {report.fullname}</p>
            </div>
            <div className="d-flex justify-content-center mt-5 pt-5">
              <p className="review-footer-content">Review for the period of {window.moment(new Date()).subtract(3, 'months').format("MMMM")} 2023 - {window.moment(new Date()).format("MMMM")} 2023</p>
            </div>
            <PageNumber pageNumber={pageNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}