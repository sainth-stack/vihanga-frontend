import React, { useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin as GoogleLoginButton,
} from "@react-oauth/google";
import { Box, Paper, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  PSYCHOMETRIC_BASE,
  REACT_APP_GOOGLE_CLIENT_ID,
  psychometricApi,
} from "./constants";

const Login = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;

      const response = await axios.post(psychometricApi("/google-login"), {
        token: credential,
      });

      const userEmail = response?.data?.user?.email;
      if (userEmail) {
        localStorage.setItem("userEmail", userEmail);
      }

      toast.success("Login successful!");
      history.push(PSYCHOMETRIC_BASE);
    } catch (error) {
      console.error(
        "Error during Google login:",
        error.response?.data || error.message
      );
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google login failed");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
            textAlign: "center",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: 3, color: "#1976d2" }}
          >
            Welcome!
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Sign in with your Google account to continue.
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              p: { xs: 2, md: 0 },
            }}
          >
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{ display: "block", marginTop: 3, color: "#888" }}
          >
            By signing in, you agree to our terms and privacy policy.
          </Typography>
        </Paper>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default Login;
