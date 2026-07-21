import React, { useState, useEffect } from "react";
import { SectionCards } from "./card-section";
import { CandidateTable } from "./table-section";
import axios from "axios";
import { appURL } from 'utilities';

const RecuitementTable = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState("");
  const [summaryData, setSummaryData] = useState({
    newCandidate: [],
    inProgress: [],
    waitingForFeedback: [],
    offerReleased: [],
    total: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);

  const fetchSummary = async () => {
    try {
      const companyId = localStorage.getItem("companyId")
        ? JSON.parse(localStorage.getItem("companyId"))
        : null;
      const response = await axios.get(`${appURL}/recruitment/getSummary`, {
        params: { companyId },
      });
      if (response.data.success) {
        setSummaryData({
          newCandidate: response.data.data.newCandidate || [],
          inProgress: response.data.data.inProgress || [],
          waitingForFeedback: response.data.data.waitingForFeedback || [],
          offerReleased: response.data.data.offerReleased || [],
          total: response.data.data.total || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <>
      <SectionCards
        summaryData={summaryData}
        loading={loadingSummary}
        onCardClick={(data, title) => {
          setPopupData(data);
          setPopupTitle(title);
          setIsPopupOpen(true);
        }}
      />
      <CandidateTable
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        popupData={popupData}
        popupTitle={popupTitle}
        onCandidateDelete={fetchSummary} // Pass function to refetch summary
      />
    </>
  );
};

export default RecuitementTable;
