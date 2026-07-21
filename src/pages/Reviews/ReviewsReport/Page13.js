import React from "react";
import "./styles.scss";
import wayforwardrun from "../../../assets/svg/wayforwardrun.svg";
import wayforwardbulb from "../../../assets/svg/wayforwardbulb.svg";
import PageNumber from "./PageNumber";
import { t } from "i18next";
export default function TheWayForward({ pageNumber }) {
  return (
    <div className="bg-brown">
      <div className="bg-white bgReviewLast">
        <div className='d-flex justify-content-center main-card'>
          <div className="bg-white center-card">
            <div className="d-flex justify-content-center mt-3">
              <p className="wayforward-main-heading">{t("ReviewsReport.The way forward")}</p>
              <img className="reviewsetting" src={wayforwardrun} alt="review" />
              <img className="reviewspaper" src={wayforwardbulb} alt="review" />
            </div>
            <div className="p-3">
              <p className="wayforward-content">{t("ReviewsReport.We have all read review reports about ourselves, at some point, and come out of it thinking what next? What do I do with this information? Or thinking nothing at all.")}</p>
              <p className="wayforward-content mt-3">{t("ReviewsReport.We know that you want to further improve yourself and contribute to this organization.")}</p>
              <p className="wayforward-list-title mt-5">{t("ReviewsReport.To help you do that, these are the next steps waiting for you:")}</p>
              <ul className="wayforward-list-title mt-3">
                <li>{t("ReviewsReport.Constructive 1-on-1 discussion with your manager")}</li>
                <li>{t("ReviewsReport.Personalized performance development plan")}</li>
                <li>{t("ReviewsReport.Tailored reminder messages, progress overview and resources")}</li>
              </ul>
              <p className="wayforward-list-title">{t("ReviewsReport.Access all the above at one place - your Talent management platform.")}</p>
              <p className="wayforward-content mt-3">{t("ReviewsReport.Thank you for investing time and effort in your growth and helping your organization reach new heights!")}</p>
            </div>
            <PageNumber pageNumber={pageNumber} />
          </div>
        </div>
      </div>
    </div>

  );
}