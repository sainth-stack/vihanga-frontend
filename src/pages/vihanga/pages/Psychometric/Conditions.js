import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { conditions } from "./data/ConditionsData";
import { questions } from "./data/QuestionsData";
import logo from "./assets/Logo.png";
import {
  PSYCHOMETRIC_BASE,
  psychometricApi,
  setPsychometricSession,
  getPsychometricSession,
  clearPsychometricSession,
} from "./constants";

const Conditions = () => {
  const history = useHistory();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [ready, setReady] = useState(false);

  const handleStart = () => {
    if (checked) {
      history.push(`${PSYCHOMETRIC_BASE}/quiz`);
    } else {
      toast("Please accept the conditions to start the Test.");
    }
  };

  const clearInviteQueryParams = () => {
    if (window.location.search) {
      window.history.replaceState({}, document.title, PSYCHOMETRIC_BASE);
    }
  };

  useEffect(() => {
    const bootstrapInvite = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const session = getPsychometricSession();

      const candidateId =
        urlParams.get("candidateId") || session.candidateId;
      const token = urlParams.get("token") || session.token;
      const hr =
        urlParams.get("hr") !== null ? urlParams.get("hr") : session.hr;
      const email = urlParams.get("email") || session.email;

      if (!candidateId || !token || !email) {
        clearPsychometricSession();
        setErrorMessage(
          "This test link is incomplete or invalid. Please use the link from your invitation email."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(psychometricApi("/invite-login"), {
          token,
          email,
          candidateId,
        });

        setPsychometricSession({
          email: response?.data?.user?.email || email,
          candidateId: response?.data?.user?.candidateId || candidateId,
          token,
          hr,
        });
        clearInviteQueryParams();

        if (response?.data?.completed) {
          history.replace(`${PSYCHOMETRIC_BASE}/test-completed`);
          return;
        }

        setReady(true);
      } catch (error) {
        clearPsychometricSession();
        const message =
          error?.response?.data?.error ||
          "Unable to open this test link. Please ask HR to resend the invitation.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    bootstrapInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 2,
        }}
      >
        <Paper
          sx={{
            maxWidth: 560,
            width: "100%",
            padding: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Unable to start assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {errorMessage}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!ready) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: { xs: "0px", sm: "20px", md: "0px" },
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          background: "#fff",
          borderRadius: ".5rem",
          padding: 2,
          width: { xs: "90%", sm: "80%", md: "60%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box sx={{ marginBottom: { xs: 2, sm: 0 }, marginRight: { sm: -10 } }}>
            <img src={logo} alt="Company Logo" style={{ height: "70px" }} />
          </Box>

          <Box sx={{ textAlign: "center", flex: 1 }}>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>
              Psychometric Test
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {questions.length} Questions | 15 Minutes
            </Typography>
          </Box>
        </Box>

        <Paper
          sx={{
            maxWidth: 850,
            margin: "0 auto",
            padding: 2,
            borderRadius: "0.4rem",
            border: "1px solid #9d9d9d",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "left", fontSize: "1.5rem", marginBottom: 2 }}
          >
            Instructions
          </Typography>
          <ul style={{ textAlign: "left" }}>
            {conditions.map((condition, index) => (
              <li key={index} style={{ marginBottom: "10px", fontWeight: "300" }}>
                {condition}
              </li>
            ))}
          </ul>
        </Paper>

        <Box sx={{ maxWidth: 850, margin: "0 auto", padding: 2 }}>
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "start" }}>
            <label>
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                sx={{ marginRight: 1 }}
              />
              I accept all terms & conditions
            </label>
          </Box>
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={handleStart}
              disabled={!checked}
              sx={{
                background: "#847F3B",
                width: { xs: "100%", sm: "auto" },
                color: "#FFFFFF",
                "&:hover": { background: "#6E6B30" },
                padding: { xs: "12px 20px", sm: "8px 20px" },
              }}
            >
              Start Test
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Conditions;
