import React from "react";
import { Avatar, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import interviewerImage from "../../../../../../assets/images/male.png";
import interviewerImage2 from "../../../../../../assets/images/female.png"
import { useHistory } from 'react-router-dom';

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: 760,
  padding: "10px",
  marginTop: "30px",
  marginBottom: "30px",
});

const InfoBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const ActionsBox = styled(Box)({
  display: "flex",
  gap: "10px",
});


const InterviewerCard = ({ formData,employeeOptions }) => {
  const history = useHistory();

  const handleViewFeedback = async (feedbackId, index) => {
    localStorage.setItem("candidateIdForFeedback", feedbackId);
    console.log("Candidate ID saved to localStorage");
  
    // Use "interview 1" format to match the feedback component's expected format
    const round = index === 0 ? "interview 1" : "interview 2";
    const url = `/candidate/interviewer/feedback?feedbackId=${feedbackId}&candidateId=${formData?.candidateId}&round=${round}&viewOnly=true`;
  
    window.open(url, '_blank');
  };
  return (
    <>
{(formData?.interviewer1 || formData?.interviewer2) && (
  <>
    {[formData?.interviewer1, formData?.interviewer2].filter(Boolean).map((interviewer, index) =>{
      const emp=employeeOptions.filter((item)=>item.email ==interviewer?.email)?.[0]
      console.log(emp)
      return(
        <>
        {interviewer?.name &&  <StyledBox
            key={index}
            sx={{
              marginX: "30px",
              borderTop: "1px solid #E9EAEC",
              borderBottom: "1px solid #E9EAEC",
              padding: "20px 0px",
            }}
          >
            <InfoBox>
              <Avatar
                src={emp?.image || (emp?.gender=="Male"?interviewerImage:interviewerImage2)}
                alt="Interviewer"
                sx={{ width: 50, height: 50 }}
              />
              <Box sx={{ marginLeft: "50px" }}>
                <Typography variant="body2" color="textSecondary">
                  Interviewer {index + 1}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="olive">
                  {interviewer.name}
                </Typography>
              </Box>
            </InfoBox>
    
            <ActionsBox>
              {/* <Button
                size="small"
                sx={{
                  color: "#7C7C8D",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  fontSize: "14px",
                }}
              >
                Delete
              </Button>
              <Button
                size="small"
                sx={{
                  color: "#A162F7",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  fontSize: "14px",
                }}
              >
                Update
              </Button> */}
              {interviewer.feedbackId ? (
                <Button
                  size="small"
                  sx={{
                    color: "#7C7C8D",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                    textTransform: "capitalize",
                    fontSize: "14px",
                  }}
                  onClick={() => handleViewFeedback(interviewer.feedbackId,index)}
                >
                  View Feedback
                </Button>
              ) :     <Button
              size="small"
              sx={{
                color: "#7C7C8D",
                fontFamily: "Work Sans",
                fontWeight: "500",
                textTransform: "capitalize",
                fontSize: "14px",
                cursor:"text"
              }}
            >
              Pending
            </Button>}
            </ActionsBox>
          </StyledBox>}
        </>
      )
    })}
  </>
)}

    </>
  );
};

export default InterviewerCard;
