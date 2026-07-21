import React, { useEffect, useState } from "react";
import "./styles.scss";
import { getReviewFormById, getReviewFormByUserId } from "action/ReviewFormAct";
import { useDispatch } from "react-redux";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page4Two from "./Page4Two";
import Page5 from "./Page5";
import Page10 from "./Page10";
import Page11 from "./Page11";
import Page13 from "./Page13";
import { useParams } from "react-router-dom";
import { LoadingIndicator } from "utilities";
import NewPage from "./NewPage";
import { useTranslation } from "react-i18next";

export default function Reviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const dispatch = useDispatch();
  const { id, userId } = useParams();
  const {t} = useTranslation()
  const getReviewData = (data) => {
    console.log(data)
    try {
      let scoreSelf = data.competencies.length > 0 ? data.competencies.map(item => ({
        averageScore: item?.Feedback ||0,
        category: item?.competencyName,
        type: item.type
      })) : [];
      let allCategories = scoreSelf?.map(item => item.category)
      allCategories = allCategories?.filter((v, i, a) => a.findIndex(t => (t === v)) === i)
      const averageScores = allCategories?.map(item => {
        const filterData = scoreSelf.filter(item2 => item2.category === item);
        const total = filterData.reduce((acc, curr) => acc + curr?.averageScore, 0);
        const average = total / filterData.length;
        const selfScore = filterData.filter(item3 => item3.type === "employee")[0]?.averageScore;
        const managerScore = filterData.filter(item3 => item3.type === "manager")[0]?.averageScore;
        return {
          category: item,
          averageScore: average,
          selfScore,
          managerScore,
          prevEmpComp: 0,
          prevManagerComp: 0,
          isGap: selfScore !== managerScore
        }
      });
      const formattedData = {
        fullname: data.employeeFullName,
        overalComments: data.overalComments,
        goals: data.goals,
        managerId: data.managerId,
        employeeId: data.employeeId,
        report: {
          selfCompleted: 1,
          managerCompleted: 1,
          totalCompleted: 2,
          scoreSelf: scoreSelf.filter(item => item.type === "employee"),
          scoreManager: scoreSelf.filter(item => item.type === "manager"),
          averageScores: averageScores,
          overallRating: data.overallRating
        }
      }
      setReport(formattedData)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };


  const getAllReviews = async () => {
    try {
      setLoading(true);
      // Use the id from URL params to directly fetch the specific review form
      const response = await dispatch(getReviewFormById(id));
      if (response?.data && Object.keys(response.data).length > 0) {
        // Filter by userId if needed
        if (response.data.employeeId === userId || !userId) {
          getReviewData(response.data);
        } else {
          setLoading(false);
          setError("Review form does not match the user ID");
        }
      } else if (response?.data && Object.keys(response.data).length === 0) {
        setLoading(false);
        // setError("No Data Found!");
      } else {
        setLoading(false);
        setError(response?.message || "Failed to fetch review form");
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    getAllReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="bg-light-primary rounded vh-100 p-4 printonly review-report">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="non-printable">{t("ReviewsReport.ReviewsReport")}</h1>
        <div onClick={() => window.print()} className="cursor-pointer non-printable">
          <i className="fa fa-print h3" /> <span className="non-printable">{t("ReviewsReport.PrintReport")}</span>
        </div>
      </div>
      {loading && <LoadingIndicator />}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="">
        {report && <div className="c1 mt-2">
          <Page1 report={report} pageNumber={1} />
          <Page2 report={report} pageNumber={2} />
          <Page3 report={report} pageNumber={3} />
          <div style={{ position: 'relative', height: "100%" }}>
            <NewPage report={report} pageNumber={4} />
          </div>
          <div className="review-all-report">
            <Page4 report={report} pageNumber={5} />
            <Page4Two report={report} pageNumber={6} />
            {report.report.averageScores.length > 0 && report.report.averageScores.map((selfReport, index) => (
              <Page5 report={report} selfReport={selfReport} pageNumber={7} />
            ))}
            <Page10 report={report} pageNumber={8} />
            <Page11 report={report} pageNumber={9} />
            <Page13 report={report} pageNumber={10} />
          </div>
        </div>}
      </div>
    </div>
  );
}