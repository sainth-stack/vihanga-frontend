import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { questions } from "./data/QuestionsData";
import Question from "./components/Question";
import CustomSubmitButton from "./components/CustomSubmitButton";
import {
  decrementCategory,
  incrementCategory,
} from "reducer/quizSlice";
import { PSYCHOMETRIC_BASE, psychometricApi } from "./constants";

const Quiz = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const responses = useSelector((state) => state?.quizCategories?.responses);

  useLayoutEffect(() => {
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[randomIndex]] = [
          shuffled[randomIndex],
          shuffled[i],
        ];
      }
      return shuffled;
    };
    setCurrentQuestions(shuffleArray(questions));
  }, []);

  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (selectedOption) => {
    if (answers[currentQuestion] === selectedOption?.label) {
      return;
    }

    const updatedAnswers = [...answers];
    const previousAnswer = updatedAnswers[currentQuestion];

    let previousCategories = [];

    if (previousAnswer) {
      const previousSelectedOption = currentQuestions[currentQuestion].options.find(
        (option) => option.label === previousAnswer
      );

      if (previousSelectedOption) {
        previousCategories = previousSelectedOption.category.flatMap((cat) =>
          cat.split(",").map((c) => c.trim())
        );
      }
    }

    updatedAnswers[currentQuestion] = selectedOption.label;
    setAnswers(updatedAnswers);
    setShowWarning(false);

    previousCategories.forEach((cat) => {
      dispatch(decrementCategory({ category: cat }));
    });

    const newCategories = selectedOption.category.flatMap((cat) =>
      cat.split(",").map((c) => c.trim())
    );

    newCategories.forEach((cat) => {
      dispatch(incrementCategory({ category: cat }));
    });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      setShowWarning(true);
      return;
    }
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      history.push(`${PSYCHOMETRIC_BASE}/result`);
    }
  };

  useEffect(() => {
    if (isQuizCompleted) {
      history.push(`${PSYCHOMETRIC_BASE}/result`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizCompleted]);

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
    setShowWarning(false);
  };

  const handleSubmitResults = async () => {
    const userEmail = localStorage.getItem("userEmail");
    const candidateId = localStorage.getItem("candidateId");
    const hr = localStorage.getItem("hr");

    const resultData = {
      email: userEmail,
      candidateId: candidateId,
      results: responses,
      hr,
    };

    setIsSubmitting(true);

    try {
      await axios.post(psychometricApi("/save-results"), resultData);
      history.push(`${PSYCHOMETRIC_BASE}/result`);
    } catch (error) {
      console.error("Error submitting results:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 0, sm: 2 },
      }}
    >
      {isQuizCompleted ? (
        <>Compeleted</>
      ) : (
        <Box
          sx={{
            display: "flex",
            background: "#fff",
            borderRadius: ".5rem",
            flexDirection: "column",
            alignItems: "center",
            width: { xs: "100%", sm: "100%", md: "60%" },
            minHeight: "60vh",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Question
            questionData={currentQuestions[currentQuestion]}
            currentQuestion={currentQuestion + 1}
            onOptionSelect={handleOptionSelect}
            selectedAnswer={answers[currentQuestion]}
          />

          {showWarning && (
            <Typography sx={{ color: "red", width: "100%", px: 2 }}>
              Please select an option to continue.
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "flex-end",
              marginTop: 1,
              padding: { xs: "0.5rem", sm: "1rem" },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              sx={{
                margin: 2,
                width: "150px",
                borderColor: "#000",
                color: "#000",
                fontFamily: "inherit",
                "&:hover": {
                  color: "#000",
                  borderColor: "#000",
                  fontWeight: "bold",
                  transform: "scale(1.005)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              Back
            </Button>
            {currentQuestion === currentQuestions.length - 1 ? (
              <CustomSubmitButton
                onClick={handleSubmitResults}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </CustomSubmitButton>
            ) : (
              <CustomSubmitButton
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
              >
                Next
              </CustomSubmitButton>
            )}
          </Box>

          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                marginTop: 4,
                padding: { xs: "0.5rem", sm: "1rem" },
                textAlign: "left",
                textDecoration: "none",
                margin: "0px",
                cursor: "pointer",
              }}
              color="primary"
            >
              Report an Issue
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Quiz;
