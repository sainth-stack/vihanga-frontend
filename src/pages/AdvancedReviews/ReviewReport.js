import React, { useEffect, useState } from "react";
import "./styles.scss";
import { getReviewByUserId } from "action/reviews_v2Act";
import { useDispatch } from "react-redux";
import Page1 from "./page1";
import Page2 from "./Page2";
import Page3 from "./page3";
import Page4 from "./page4";
import Page4Two from "./Page4Two";
import Page5 from "./Page5";
import Page10 from "./Page10";
import Page11 from "./Page11";
import Page13 from "./page13";
import { useParams } from "react-router-dom";
import { LoadingIndicator } from "utilities";

export default function Reviews() {
  const [loading, setLoading] = useState(false);
  const [reviews,] = useState([]);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const dispatch = useDispatch();
  const { id, templateId } = useParams();
  const getAllReview = () => {
    try {
      setLoading(true);
      let response = dispatch(getReviewByUserId(id, templateId));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let reviewsData = [...reviews, ...data];
          let filterData = reviewsData.filter(item => item.userId === id).length > 0 ? reviewsData.filter(item => item.userId === id)[0] : {};
          const allCategories = filterData.report.scoreSelf.map(item => item.category).filter((v, i, a) => a.findIndex(t => (t === v)) === i)
          const averageScores = allCategories.map(item => {
            const filterData2 = filterData.report.scoreSelf.filter(item2 => item2.category === item);
            const total = filterData2.reduce((acc, curr) => acc + Number(curr.averageScore), 0);
            const average = total / filterData2.length;
            const selfScore = filterData.report.scoreSelf.filter(item2 => item2.category === item)[0].averageScore;
            const managerScore = filterData.report.scoreManager.filter(item2 => item2.category === item)[0].averageScore;
            return {
              category: item,
              averageScore: average,
              selfScore,
              managerScore,
              isGap: selfScore !== managerScore
            }
          });
          filterData = {
            ...filterData,
            report: {
              ...filterData.report,
              averageScores: averageScores,
              overallRating: filterData.report.overallRating
            }
          }
          setReport(filterData)
          setLoading(false)
        } else if (data.length === 0) {
          setLoading(false);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    getAllReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="bg-light-primary rounded vh-100 p-4 printonly review-report">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="non-printable">Review Report</h1>
        <div onClick={() => window.print()} className="cursor-pointer non-printable">
          <i className="fa fa-print h3" /> <span className="non-printable">Print Report</span>
        </div>
      </div>
      {loading && <LoadingIndicator />}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="contain-review">
        {report && <div className="c1 mt-2">
          <Page1 report={report} pageNumber={1} />
          <Page2 report={report} pageNumber={2} />
          <Page3 report={report} pageNumber={3} />
          <Page4 report={report} pageNumber={4} />
          <Page4Two report={report} pageNumber={4} />
          {report.report.scoreSelf.length > 0 && report.report.scoreSelf.map((selfReport, index) => (
            <Page5 report={report} pageNumber={5} selfReport={report.report.scoreSelf[index]} managerReport={report.report.scoreManager[index]} peersReport={!!report.report.scorePeers ? report.report.scorePeers[index] : {}} groupReport={report.report.groupScore[index]} />
          ))}
          <Page10 report={report} pageNumber={6} />
          <Page11 report={report} pageNumber={7} />
          <Page13 report={report} pageNumber={8} />
        </div>}
      </div>
    </div>
  );
}