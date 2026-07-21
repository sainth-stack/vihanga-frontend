import React from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import toast from "react-hot-toast";
import Timer from "./Timer";
import { questions } from "../data/QuestionsData";

const Question = ({
  questionData,
  currentQuestion,
  onOptionSelect,
  selectedAnswer,
}) => {
  const handleTimeUp = () => {
    toast.error("Time's up!");
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: { xs: ".5rem", md: "1rem" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: { xs: "0", sm: "1" },
        }}
      >
        <Timer onTimeUp={handleTimeUp} />
      </Box>

      <Box sx={{ padding: { xs: ".5rem", md: "1.5rem" } }}>
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: "600",
            mb: { xs: ".5rem", sm: "1rem" },
            textAlign: "left",
          }}
        >
          Question {currentQuestion} / {questions.length}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.5rem" },
            fontWeight: "bold",
            mb: { xs: "1rem", sm: "1.5rem" },
          }}
        >
          {questionData?.question.charAt(0).toUpperCase() +
            questionData?.question.slice(1)}
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {questionData?.options?.map((option, index) => (
            <Grid
              item
              xs={option.isImage ? 6 : 12}
              sm={option.isImage ? 3 : 6}
              md={option.isImage ? 3 : 6}
              key={index}
            >
              <Button
                fullWidth
                sx={{
                  padding: "10px",
                  textTransform: "none",
                  color: "#000",
                  border:
                    selectedAnswer === option.label
                      ? option.isImage && option.image
                        ? "2px solid #EBBE2D"
                        : ""
                      : "1px solid #000",
                  backgroundColor:
                    selectedAnswer === option.label &&
                    !(option.isImage && option.image)
                      ? "#EBBE2D"
                      : "#fff",
                  borderRadius: ".5rem",
                }}
                onClick={() => onOptionSelect(option)}
              >
                {option.isImage && option.image ? (
                  <img
                    src={option.image}
                    alt={option.option}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "180px",
                      aspectRatio: "16/9",
                      borderRadius: ".5rem",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    {option.label}.{" "}
                    {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
                  </Typography>
                )}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Question;
