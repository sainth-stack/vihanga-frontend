import Stepper from "pages/vihanga/components/stepper";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import CandidateDetailsForm from "./form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import ReportPage from './../../../ReportPages/index';
const CandidateCreate = () => {
  const [activeStep, setActiveStep] = useState(0);
   const { t } = useTranslation();
const [status,setStatus]=useState("New Applied")
  const steps = [
  { label: t("RecruitmentManagement.CandidateDetails"), value: "New Applied", step: 0 },
  { label: t("RecruitmentManagement.PsychometricAssessment"), value: "Psychometric Test", step: 1 },
  { label: t("RecruitmentManagement.Interview1"), value: 'Interview 1', step: 2 },
  { label: t("RecruitmentManagement.Interview2"), value: "Interview 2", optional: true, step: 3 },
  { label: t("RecruitmentManagement.DocumentVerification"), value: "Document Upload", step: 4 },
  { label: t("RecruitmentManagement.Offer"), step: 5, value: ["Shortlisted", "Offer Letter"] },
  { label: t("RecruitmentManagement.Onboarding"), step: 6, value: ["Onboarding", 'Convert to Employee'] },
];

  const { id } = useParams();

  useEffect(()=>{
if(status){
  const step2=steps.filter((item)=>{
    if(item?.value?.length>0){
     return item.value.includes(status)
    } else {
     return item.value ===status
    }
  })?.[0]?.step;
  setActiveStep(step2)
}
  },[status])

  return (
    <div>
      <Card
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: 0,
          borderRadius: "16px",
          marginX: "30px",
          marginTop: "30px",
          marginBottom: "30px",
          border: "1px solid #565656",
        }}
      >
        <div style={{ padding: 20 }}>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            stepIconColor="#837F39"
            connectorColor="#9E9E9E"
            onStepClick={(stepIndex) => setActiveStep(stepIndex)}
          />
        </div>
      </Card>
      <CandidateDetailsForm id={id} setStatus={setStatus} />
      {/* <ReportPage candidateId={id}/> */}
    </div>
  );
};

export default CandidateCreate;
