import React, { useState } from "react";
import CardWrapper from "../CardWrapper";
import "./index.scss";
import salesforce from "assets/images/saleforce.png";
import { useHistory } from "react-router-dom";
import TopHeader from "../salesforce/components/TopHeader";
import {jwtDecode} from 'jwt-decode';
import { getSalesforceUser } from 'service/integrationapis';
import { useQuery } from "@tanstack/react-query";
import { getServiceUrl } from "service/api";
import { generateCodeChallenge, generateCodeVerifier } from './pkceUtils';
import { Box, Typography, Button } from "@mui/material";

const Auth = () => {
  const history = useHistory();
  const [tokenDetails, setTokenDetails] = useState(null);

  const handleCallback = async (code) => {
    try {
      const codeVerifier = localStorage.getItem('pkce_code_verifier');
      
      const response = await fetch(`${getServiceUrl('local')}callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          code_verifier: codeVerifier
        })
      });

      const data = await response.json();
      console.log("data", data);
      
      if (data.access_token) {
        localStorage.setItem('sf_access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('sf_refresh_token', data.refresh_token);
        }

        // Parse JWT token using jwt-decode package

        // Parse and store token details
        const tokenPayload = jwtDecode(data.access_token);

        console.log("tokenPayload", tokenPayload);
        setTokenDetails(tokenPayload);
        
        // Fetch user info after getting access token
        const userInfo = await getSalesforceUser();
        localStorage.setItem('salesforce_user', JSON.stringify(userInfo?.data));
        history.push(`/admin/previlages/integrationManagement/salesforce/setup/${userInfo?.data?.user_id}`);
      }

      // Clean up
      localStorage.removeItem('pkce_code_verifier');
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  React.useEffect(() => {
    const existingToken = localStorage.getItem('sf_access_token');
    const salesforceUser = localStorage.getItem('salesforce_user');
    
    if (existingToken && salesforceUser) {
      try {
        const decodedToken = jwtDecode(existingToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token has expired, clear storage and require re-auth
          localStorage.removeItem('sf_access_token');
          localStorage.removeItem('sf_refresh_token');
          localStorage.removeItem('salesforce_user');
          return;
        }

        // Token still valid, proceed with navigation
        const userInfo = JSON.parse(salesforceUser);
        history.push(`/admin/previlages/integrationManagement/salesforce/setup/${userInfo?.user_id}`);
        return;
      } catch (error) {
        console.error('Error decoding token:', error);
        // Clear storage if token is invalid
        localStorage.removeItem('sf_access_token');
        localStorage.removeItem('sf_refresh_token'); 
        localStorage.removeItem('salesforce_user');
        return;
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleNavigate = async () => {
    const salesforceAuthUrl = 'https://login.salesforce.com/services/oauth2/authorize';
    
    // Generate PKCE values
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store code verifier in localStorage to use it later during token exchange
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.REACT_APP_SALESFORCE_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_SALESFORCE_REDIRECT_URI,
      scope: 'api',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    window.location.href = `${salesforceAuthUrl}?${params.toString()}`;
  };

  return (
    <>
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <CardWrapper>
          <TopHeader 
            {...{
              image: salesforce
            }}
          />
          <Box className="auth-container">
            <Box
              className="inner-container"
              sx={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                p: 4,
                boxShadow: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700} mb={2}>
                Connect Salesforce to Update Progress
              </Typography>
              <Button
                variant="contained"
                onClick={handleNavigate}
                sx={{
                  backgroundColor: "#73712A",
                  borderRadius: "30px",
                  py: 1.5,
                  px: 3,
                  fontWeight: "bold",
                  '&:hover': { backgroundColor: '#5a581f' }
                }}
              >
                <img width={28} style={{ marginRight: 8 }} src={salesforce} alt="salesforce" />
                Sign in to Salesforce
              </Button>
            </Box>
          </Box>
        </CardWrapper>
      </div>
    </>
  );
};

export default Auth;
