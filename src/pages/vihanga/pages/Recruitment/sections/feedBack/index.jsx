import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FileUpload from "../../../../components/filesUplode/draganddropFile";
import axios from "axios";
import { Toast } from "service/toast";
import { appURL } from "utilities";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllCompetencies } from "action/CompetencyAct";
import { useDispatch } from "react-redux";

const FeedBackReport = () => {
  const [candidateId, setCandidateId] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const feedbackId = urlParams.get("feedbackId");
  const round = urlParams.get("round");
  const viewOnly = urlParams.get("viewOnly") === "true";
  const [competencies, setCompetencies] = useState([]);
  const defaultRatings = {
    overall: 0,
  };

  const defaultRatings1 = {
    unsatisfactory: 1,
    belowAverage: 2,
    meetsRequirements: 3,
    exceedsRequirements: 4,
    farExceeds: 5,
  };

  const defaultComments = {
    overall: "",
  };

  const [ratings, setRatings] = useState(defaultRatings);
  const [ratings1, setRatings1] = useState(defaultRatings1);
  const [comments, setComments] = useState(defaultComments);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("candidateId");
    const token = urlParams.get("token");

    if (id) {
      setCandidateId(id);
    }
    if (token) {
      console.log("Extracted token:", token);
    }
  }, []);

const fetchCompetencies = (savedCompetencyIds = null) => {
  let response1 = dispatch(getAllCompetencies());
  response1.then(({ success, message, data }) => {
    
    let finalCompetencies;
    
    // If we have saved competency IDs (from feedback), use those
    if (savedCompetencyIds && savedCompetencyIds.length > 0) {
      finalCompetencies = data.filter(competency =>
        savedCompetencyIds.includes(competency._id)
      );
    } else {
      // Otherwise, filter by candidate's position/role
      const candidateRole = candidateData?.designation?.toLowerCase();
      
      finalCompetencies = data.filter(competency =>
        competency?.designation?.some(
          d => d.value?.toLowerCase() === candidateRole || 
               d.key?.toLowerCase() === candidateRole
        )
      );
    }
    finalCompetencies = finalCompetencies.sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ta - tb;
    });

    setCompetencies(finalCompetencies);
    
    // Only initialize ratings/comments if not viewing existing feedback
    if (!savedCompetencyIds) {
      const dynamicRatings = {};
      const dynamicComments = {};
      
      finalCompetencies.forEach((competency, index) => {
        dynamicRatings[`competency_${competency._id}`] = 0;
        dynamicComments[`competency_${competency._id}`] = "";
      });
      
      dynamicRatings.overall = 0;
      dynamicComments.overall = "";
      
      setRatings(dynamicRatings);
      setComments(dynamicComments);
    }
  });
};
  const downloadFeedbackReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Interview Feedback Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Candidate Name: ${candidateData?.candidateName || "N/A"}`, 14, 30);
    doc.text(`Position Applied: ${candidateData?.designation || "N/A"}`, 14, 38);
    doc.text(`Interview Date: ${new Date().toLocaleDateString()}`, 14, 46);
    doc.text(`Interviewer: ${round === "interview 1" ? candidateData?.interviewer1?.name : candidateData?.interviewer2?.name || "N/A"}`, 14, 54);
    doc.text(`Interview Round: ${round === "interview 1" ? "First Round" : "Second Round"}`, 14, 62);
    
    doc.setFontSize(14);
    doc.text("Candidate Ratings", 14, 74);
    
    // Add rating scale
    doc.setFontSize(10);
    const ratingsScale = [
      ["1", "Far Below Average/Unsatisfactory"],
      ["2", "Below Average/Doesn't Meet All Requirements"],
      ["3", "Meets/Meets Requirements"],
      ["4", "Above Average/Exceeds Requirements"],
      ["5", "Exceptional/Far Exceeds Requirements"]
    ];
    
    autoTable(doc, {
      startY: 80,
      head: [["Rating", "Description"]],
      body: ratingsScale,
      theme: 'grid',
      headStyles: {
        fillColor: [131, 127, 57] // Matching your theme color
      }
    });
    
    // Add competency ratings
    doc.setFontSize(14);
    doc.text("Competency Ratings", 14, doc.lastAutoTable.finalY + 15);
    
    const competencyData = competencies.map((competency, index) => [
      competency.competencyName || `Competency ${index + 1}`,
      ratings[`competency_${competency._id}`] || 0,
      comments[`competency_${competency._id}`] || ""
    ]);
    
    // Add overall rating
    competencyData.push(["Overall", ratings.overall, comments.overall]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Competency", "Rating (1-5)", "Comments"]],
      body: competencyData,
      theme: 'grid',
      headStyles: {
        fillColor: [131, 127, 57]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 'auto' }
      }
    });
    
    // Add overall impression
    doc.setFontSize(14);
    doc.text("Overall Impression and Recommendation", 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(10);
    doc.text(comments.overall || "No overall comments provided", 14, doc.lastAutoTable.finalY + 20, { maxWidth: 180 });
    
    // Save the PDF
    doc.save(`Feedback_Report_${candidateData?.candidateName || "Candidate"}.pdf`);
  };


  useEffect(() => {
    const fetchCandidateById = async () => {
      try {
        const response = await axios.get(
          `${appURL}/recruitment/getCandidateById`,
          {
            params: { _id: candidateId },
          }
        );

        if (response.data.success) {
          const candidate = response.data.data[0];
          setCandidateData(candidate);
        } else {
          throw new Error("Failed to fetch candidate data");
        }
      } catch (error) {
        console.error("Error fetching candidate:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateById();
    } else {
      setIsLoading(false);
    }
  }, [candidateId]);
  const fetchFeedbackData = async () => {
    try {
      // Normalize round parameter (handle both "interview1" and "interview 1" formats)
      const normalizedRound = round?.toLowerCase().replace(/\s+/g, '');
      
      // Use feedbackId from URL first, then try round-specific feedbackId
      let idToFetch = feedbackId;
      
      if (!idToFetch && candidateData) {
        // Try to get round-specific feedbackId from interviewer object
        if (normalizedRound === "interview1" && candidateData?.interviewer1?.feedbackId) {
          idToFetch = candidateData.interviewer1.feedbackId;
        } else if (normalizedRound === "interview2" && candidateData?.interviewer2?.feedbackId) {
          idToFetch = candidateData.interviewer2.feedbackId;
        }
      }
      
      if (!idToFetch) {
        // No existing feedback, fetch competencies based on candidate role
        if (candidateData?.designation) {
          fetchCompetencies();
        }
        return;
      }

      // Fetch feedback with feedbackId AND round for extra safety
      const response = await axios.get(
        `${appURL}/recruitment/feedback?feedbackId=${idToFetch}&round=${encodeURIComponent(round)}`
      );
      
      if (response.data.success && response.data.data) {
        const feedback = response.data.data;
        
        // Verify the feedback is for the correct round
        if (feedback.round && feedback.round !== round) {
          console.warn(`Feedback round mismatch: expected ${round}, got ${feedback.round}`);
          // Fetch competencies for new round instead
          if (candidateData?.designation) {
            fetchCompetencies();
          }
          return;
        }
        
        setFeedbackData(feedback);
        
        // Set ratings directly (not merged) to ensure they match the competencies
        if (feedback.ratings) {
          setRatings(feedback.ratings);
        }
        
        // Set ratings1
        if (feedback.ratings1) {
          setRatings1({
            ...defaultRatings1,
            ...feedback.ratings1
          });
        } else {
          setRatings1(defaultRatings1);
        }
        
        // Set comments directly (not merged) to ensure they match the competencies
        if (feedback.comments) {
          setComments(feedback.comments);
        }
        
        // Fetch competencies by IDs if available
        if (feedback.competencyIds && feedback.competencyIds.length > 0) {
          fetchCompetencies(feedback.competencyIds);
        } else if (candidateData?.designation) {
          // Fallback to role-based competencies if no saved IDs
          fetchCompetencies();
        }
      }
    } catch (error) {
      console.error("Error fetching feedback:", error.message);
      // On error, try to fetch competencies based on role
      if (candidateData?.designation) {
        fetchCompetencies();
      }
    }
  };
  
  // Single useEffect to handle the data fetching flow
  useEffect(() => {
    // Only proceed if we have candidate data
    if (!candidateData) return;
    
    // Fetch feedback data (which will handle competencies fetching)
    fetchFeedbackData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateData, round]);

  const handleRatingChange = (name, value) => {
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (name, value) => {
    setComments((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFile(event?.file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (candidateId) {
        formData.append("candidateId", candidateId);
      }
      
      // Include feedbackId if updating existing feedback
      if (feedbackId) {
        formData.append("feedbackId", feedbackId);
      }
      
      formData.append("ratings", JSON.stringify(ratings));
      formData.append("ratings1", JSON.stringify(ratings1));
      formData.append("comments", JSON.stringify(comments));
      
      // Store competency IDs for this specific round
      const competencyIds = competencies.map(c => c._id);
      formData.append("competencyIds", JSON.stringify(competencyIds));
      
      // Critical: Include round to ensure data is stored separately for each interview
      formData.append("round", round);

      if (file) {
        formData.append("file", file);
      }
      
      const response = await axios.post(
        `${appURL}/recruitment/feedback`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Toast({ message: "Feedback has been submitted successfully.", type: "success" });
        // Close the window after successful submission
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      Toast({ message: "Failed to submit feedback. Please try again.", type: "error" });
    }
  };

  const handleCancel = () => {
    window.close();
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          margin: "4rem",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <div>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "700",
                fontFamily: "Montserrat, sans-serif",
                color: "#0E0E0E",
              }}
              gutterBottom
            >
              <ArrowBackIosIcon
                sx={{ fontSize: 30, color: "#000000", mt: "-4px", mr: "16px" }}
              />
              Feedback Form
            </Typography>
          </div>

          <div onClick={() => downloadFeedbackReport()}>
            <IconButton
              sx={{
                width: "27px",
                height: "27px",
                color: "rgba(131, 127, 57, 1)",
              }}
            >
              <DownloadIcon />
            </IconButton>
          </div>
        </Box>

        {/* Basic Details Section */}
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Montserrat, sans-serif",
              mb: "10px",
              marginTop: "24px",
            }}
          >
            Basic Details
          </Typography>
          <Box
            display="flex"
            gap={36}
            sx={{ fontFamily: "Work Sans, sans-serif", marginTop: "24px" }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "400",
                }}
              >
                Candidate Name 
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                {candidateData?.candidateName || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                Position Applied
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                {candidateData?.designation || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={6} sx={{ marginTop: "32px" }}>
            <div>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "400",
                }}
              >
                Date:
              </Typography>
              <input
                type="date"
                value={
                  candidateData?.appliedOn
                    ? new Date(candidateData.appliedOn)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                style={{
                  width: "350px",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #E9EAEC",
                }}
                disabled
              />
            </div>
            <div>
              <Box sx={{ marginTop: "29px" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#707070",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                >
                  Interviewer Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#0E0E0E",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                >
                  {round === "interview 1"
                    ? candidateData?.interviewer1?.name
                    : candidateData?.interviewer2?.name || "N/A"}
                </Typography>
              </Box>
            </div>
            </Box>
          
              <Box style={{marginTop:"24px"}}>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "400",
                }}
              >
               Function
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                {candidateData?.department || "N/A"}
              </Typography>
            </Box>

          {/* Interview Feedback Section */}
          <Box sx={{ marginTop: "24px" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                fontFamily: "Montserrat, sans-serif",
                mb: "10px",
                color: "#0E0E0E",
              }}
            >
              Interview Feedback
            </Typography>
            <Typography
              marginTop="24px"
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#707070",
                fontFamily: "Work Sans, sans-serif",
              }}
            >
              Type of Evaluation
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "2px",
              }}
            >
              {round === "interview 1" ? "First Round" : "Second Round"}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "24px",
                marginBottom: "24px",
              }}
            >
              Please rate this candidate on the following attributes using a
              scale 1 to 5
            </Typography>

            {[
              {
                key: "unsatisfactory",
                label: " Lacks Competency - Demonstrated limited or no understanding of the concepts",
              },
              {
                key: "belowAverage",
                label: "Basic -Understands concepts; will require close guidance to demonstrate",
              },
              { key: "meetsRequirements", label: "Intermediate -Will be able to apply knowledge independently in routine situations" },
              {
                key: "exceedsRequirements",
                label: "Advanced -Will be able to apply expertise in complex situations and guide others",
              },
              {
                key: "farExceeds",
                label: "Expert -Demonstrated deep knowledge; will be able to set direction, define policies and processes.",
              },
            ].map(({ key, label }) => (
              <Box key={key}>
                <Box display="flex" alignItems="center">
                  <Typography
                    sx={{
                      width: "38%",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#707070",
                      fontFamily: "Work Sans, sans-serif",
                      marginTop: "14px !important",
                    }}

                  >
                    {label}
                  </Typography>
                  <Rating
                    name={key}
                    value={ratings1[key]}
                    // onChange={(event, newValue) =>
                    //   handleRatingChange1(key, newValue)
                    // }
                    readOnly
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: "19px",
                        width: "16px",
                        height: "16px",
                        color: "#FFD029",
                      },
                    }}
                    // disabled={!!feedbackData} // Disable when viewing existing feedback
                  />
                </Box>
              </Box>
            ))}
          </Box>


          {/* Competencies Section */}
          <Box sx={{ marginTop: "27px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginBottom: "16px",
              }}
            >
              Functional Competencies
            </Typography>
            {competencies.map((competency, index) => {
              const compKey = `competency_${competency._id}`;
              return (
                <Box key={compKey} sx={{ marginTop: "27px" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#0E0E0E",
                      fontFamily: "Work Sans, sans-serif",
                    }}
                  >
                    {competency.competencyName || `Competency ${index + 1}`||"NA"}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#0E0E0E",
                      fontFamily: "Work Sans, sans-serif",
                    }}
                  >
                    {competency.description || `Competency ${index + 1}`||"NA"}
                  </Typography>
                  <Rating
                    name={compKey}
                    value={ratings[compKey] || 0}
                    onChange={(event, newValue) =>
                      handleRatingChange(compKey, newValue)
                    }
                    readOnly={viewOnly}
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: "29px",
                        width: "29px",
                        height: "27px",
                        marginTop: "10px",
                        color: "#FFD029",
                      },
                    }}
                  />
                  <Box display="flex" justifyContent="start" sx={{ mt: "5px" }}>
                    <TextField
                      sx={{
                        width: "50%",
                        border: "1px solid #E9EAEC",
                        borderRadius: "10px",
                      }}
                      multiline
                      rows={3}
                      margin="normal"
                      label="Comment"
                      value={comments[compKey] || ""}
                      onChange={(event) =>
                        handleCommentChange(compKey, event.target.value)
                      }
                      disabled={viewOnly}
                    />
                  </Box>
                </Box>
              );
            })}
            {competencies.length === 0 && (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontStyle: "italic",
                }}
              >
                No competencies found for this role.
              </Typography>
            )}
          </Box>

          {/* Overall Rating and Comments */}
          <Box sx={{ marginTop: "27px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
              }}
            >
              Overall Rating
            </Typography>
            <Rating
              name="overall"
              value={ratings.overall}
              onChange={(event, newValue) =>
                handleRatingChange("overall", newValue)
              }
              readOnly={viewOnly}
              sx={{
                "& .MuiRating-icon": {
                  fontSize: "29px",
                  width: "29px",
                  height: "27px",
                  marginTop: "10px",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "27px",
                maxWidth: "70%",
              }}
            >
              Overall Impression and Recommendation, Please provide any final
              comments and your recommendations for proceeding with the
              candidate.
            </Typography>
            <TextField
              sx={{
                width: "70%",
                marginTop: "16px",
                border: "1px solid #E9EAEC",
                borderRadius: "10px",
              }}
              multiline
              rows={4}
              margin="normal"
              label="Overall Impression and Recommendation"
              value={comments.overall}
              onChange={(event) =>
                handleCommentChange("overall", event.target.value)
              }
              disabled={viewOnly}
            />
          </Box>

          {/* File Upload */}
          <Box sx={{ marginTop: "24px" }}>
            {!viewOnly && (
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                Upload Document
              </Typography>
            )}
            {!viewOnly && feedbackData?.uploadedDocument && (
              <Box sx={{ marginTop: "10px" }}>
                <a
                  href={feedbackData.uploadedDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Document
                </a>
              </Box>
            )}
            
            {!viewOnly && (
              <FileUpload
                id="feedback-document-upload"
                onFileUpload={handleFileChange}
                sx={{ width: "70%", marginLeft: "4px", marginTop: "-20px" }}
                disabled={viewOnly}
              />
            )}
          </Box>

          {/* Action Buttons */}
          {!viewOnly && (
          <Box
            display="flex"
            gap="12px"
            sx={{
              marginTop: "60px",
              maxWidth: "70%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button
              onClick={handleCancel}
              sx={{
                borderRadius: "136px",
                border: "1.37px solid rgba(131, 127, 57, 1)",
                width: "107px",
                color: "#837F39",
                fontFamily: "Work Sans, sans-serif",
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
                Cancel
            </Button>
              <Button
                sx={{
                  borderRadius: "136px",
                  background: "#837F39",
                  color: "#FFFFFF",
                  width: "161px",
                  textTransform: "capitalize",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "500",
                  "&:hover": {
                    background: "#99965E",
                    color: "#FFFFFF",
                    border: "1px solid #837F39",
                  },
                }}
                onClick={handleSubmit}
              >
                Save Details
              </Button>
          </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default FeedBackReport;