/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import profile from "assets/images/profile.png";
import printer from "assets/svg/printer.svg";
import vedeo from "assets/svg/vedeo.svg";
import { useLocation } from "react-router-dom";
import {
  handleLink2,
  LoadingIndicator,
  OKRperiod,
  removeDuplicates,
  RewardCategories,
  RewardTypes1,
  OKRperiodMonths,
} from "utilities";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "action/EmployeeAct";
import { getObjectivesRewardPoints } from "action/UserAct";
import useWindowSize from "components/UseWindowSize";
import { Col, Row } from "react-bootstrap";
import Button from "components/Company/Button";
import { history } from "service/helpers";
import Toolcard from "./Toolcard/Toolcard";
import Tippy from "@tippyjs/react";
import {
  createRedeemPoints,
  getAllRedeemPoints,
  getAllRewards,
  updateRedeem,
} from "action/RewardsAct";
import Slider from "components/Slider";
import PieChartRewards from "components/DashboardComponents/PieChartRewards";
import PieChartTotalRedeems from "components/DashboardComponents/PieChartTotalRedeems";
import UserOnboarding from "react-user-onboarding";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Stack, Grid, Typography, Divider, TextField } from "@mui/material";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import RewardsTable from "./table/RewardsTable";
import { Checkbox } from "rsuite";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

function Card2({ children }) {
  return <Box>{children}</Box>;
}
function Heading({ title }) {
  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: { xs: 2, sm: 4 }, 
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: "bold",
      fontSize: { xs: 16, sm: 20 }, 
    }}
  >
    {title}
  </Typography>
</Box>

  );
}
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      rewardIcon: data[i].rewardIcon,
      rewardName: data[i].rewardName,
      rewardCode: data[i].rewardCode,
      rewardDescription: data[i].rewardDescription,
      rewardType: data[i].rewardType,
      rewardTypeCategory:
        RewardTypes1.filter((item) => item.value === data[i].rewardType)
          .length > 0
          ? "Monetory"
          : "Non Monetory",
      rewardPoints: data[i].rewardPoints,
      rewardAmount: data[i].rewardAmount,
      rewardStatus: data[i].rewardStatus,
      rewardApprover: data[i].rewardApprover,
      status: data[i].status,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

export default function Objectives({ onChange }) {
  let user = useSelector((store) => store.user.user);
  let selectedTab1 =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTabRewards") !== null
      ? JSON.parse(localStorage.getItem("selectedTabRewards"))
      : { tab: "rewardsRedemption" };
  let companyObj = {
    companyEntityName: "",
    employeeName: "",
    employeeNames: "",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
    okrPeriod: "Monthly",
    okrYear: "2022",
    rewardType: "Monetory",
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [, setError] = useState(false);
  const [isAvailable] = useState(false);
  const dispatch = useDispatch();
  const [showAttachment, setShowAttachment] = useState(true);
  const [rewardsData, setRewardsData] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [remainingPoints, setRemainingPoints] = useState(0);
  const [bronzePoints, setBronzePoints] = useState(40);
  const [silverPoints, setSilverPoints] = useState(0);
  const [goldPoints, setGoldPoints] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [redeemHistory, setRedeemHistory] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);
  const isMobile = useWindowSize();
  const location = useLocation();
  
  const { primaryColor, secondaryColors } = getThemeColors();

  const handleChange = (name, value,id) => {
    console.log(name,value)
    if (onChange) {

      onChange({
        target: {
          id,
          name,
          value,
        },
      });
    }
  };
  
  const { t } = useTranslation();
  const empID2 = JSON.parse(localStorage.getItem("user"));
  const getUser = () => {
    let selectedTab =
      localStorage.getItem("selectedTabRewards") !== null
        ? JSON.parse(localStorage.getItem("selectedTabRewards"))
        : null;
    if (selectedTab !== null && selectedTab.tab === "rewardsRedemption") {
      history.push("/admin/rewards/rewardsRedemption");
    } else if (selectedTab !== null && selectedTab.tab === "recognize") {
      history.push("/admin/rewards/recognize");
    }
  };

  const fetchRewardPoints = useCallback(() => {
    let response2 = dispatch(
      getObjectivesRewardPoints(user._id, user.role, selectedTab1.tab)
    );
    response2.then(({ data, message }) => {
      if (data) {
        setRewardPoints(
          Number(
            (
              Number(data.totalObjectivesPoints) +
              Number(data.totalKeyResultsPoints)
            ).toFixed(1)
          )
        );
        setEarnedPoints(Number(Number(data.earnedPoints).toFixed(2)));
        setRedeemedPoints(Number(Number(data.redeemPoints).toFixed(2)));
        setRemainingPoints(Number(Number(data.remainingPoints).toFixed(2)));
        setBronzePoints(parseInt(data.rewardPoints));
        setSilverPoints(parseInt(data.rewardPoints2));
        setGoldPoints(parseInt(data.rewardPoints3));
        setError("");
        setLoading(false);
      } else if (data.length === 0) {
        setError("No Data Found!");
        setLoading(false);
      } else {
        setError(message);
        setLoading(false);
      }
    });
  });

  const fetchAllRedeemPoints = () => {
    let response2 = dispatch(getAllRedeemPoints(user._id));
    response2.then(({ data, message }) => {
      if (data) {
        setRedeemHistory(data.rewardTypeAndPoints);
        setTotalPoints(data.totalPoints);
        setError("");
        setLoading(false);
      } else if (data.length === 0) {
        setError("No Data Found!");
        setLoading(false);
      } else {
        setError(message);
        setLoading(false);
      }
    });
  };
  const elem1 = useRef(),
    elem2 = useRef(),
    elem3 = useRef();
  useEffect(() => {
    if (location.state && location.state.story) {
      if (location.state.story === "story") {
        if (elem1.current) {
          setTimeout(() => {
            setIsVisible(location.state ? location.state.isVisible : false);
            window.history.replaceState({ isVisible: false }, document.title);
          }, 200);
        }
      } else if (location.state.story === "story1") {
        if (elem3.current) {
          setTimeout(() => {
            setIsVisible(location.state ? location.state.isVisible : false);
            window.history.replaceState({ isVisible: false }, document.title);
          }, 200);
        }
      }
    }
  }, [location, elem1, elem2, elem3]);
  
  // Add highlight class to tutorial elements when visible
  useEffect(() => {
    if (isVisible && location.state) {
      if (location.state.story === "story1" && elem3.current) {
        elem3.current.classList.add('tutorial-highlight');
      } else if (location.state.story === "story" && elem1.current) {
        elem1.current.classList.add('tutorial-highlight');
      }
    } else {
      if (elem3.current) {
        elem3.current.classList.remove('tutorial-highlight');
      }
      if (elem1.current) {
        elem1.current.classList.remove('tutorial-highlight');
      }
    }
    
    return () => {
      if (elem3.current) {
        elem3.current.classList.remove('tutorial-highlight');
      }
      if (elem1.current) {
        elem1.current.classList.remove('tutorial-highlight');
      }
    };
  }, [isVisible, location]);
  
  useEffect(() => {
    getUser();
    fetchRewardPoints();
    fetchAllRedeemPoints();
  }, []);
  const story = [
    {
      component: "tooltip",
      ref: elem1,
      children: (
        <Box>
          <Typography>Here we can view the reward points</Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography>Thanks {empID2.name}!</Typography>
          <Typography>You have completed The Onboarding Process.</Typography>
        </Box>
      ),
    },
  ];
  const story1 = [
    {
      component: "tooltip",
      ref: elem3,
      children: (
        <Box>
          <Typography>Select the reward type (Monetary or Non-Monetary) to view available rewards</Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography>Thanks {empID2.name}!</Typography>
          <Typography>You have completed the reward redemption tutorial!</Typography>
          <Typography sx={{ mt: 2 }}>Now you know how to redeem your earned reward points.</Typography>
        </Box>
      ),
    },
  ];
  const getStory = () => {
    if (location.state.story === "story") {
      return story;
    } else if (location.state.story === "story1") {
      return story1;
    }
  };

  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data
            .filter((item) => {
              if (selectedTab1 !== null && selectedTab1.tab === "me") {
                if (user !== null && item._id === user._id) {
                  return item;
                }
              } else {
                if (
                  (user !== null &&
                    item.employmentInformation &&
                    item.employmentInformation.lineManager &&
                    item.employmentInformation.lineManager === user._id) ||
                  item._id === user._id
                ) {
                  return item;
                }
              }
            })
            .map((item) => {
              return {
                key:
                  item.personalInformation.firstName +
                  " " +
                  item.personalInformation.lastName,
                value: item._id,
              };
            });
          let nonduplicates = removeDuplicates(updatedData, "key");
          let updatedData2 = { ...companyInfo };
          updatedData2["employeeName"] = nonduplicates[0].value;
          updatedData2["employeeNames"] = nonduplicates[0].key;
          if (localStorage.getItem("userData") === null) {
            localStorage.setItem(
              "userData",
              JSON.stringify({
                ownerName: updatedData.filter(
                  (item) => item.value === updatedData2.employeeName
                )[0].key,
                ownerId: updatedData2.employeeName,
              })
            );
          } else {
            let existingUser =
              localStorage.getItem("userData") !== null
                ? JSON.parse(localStorage.getItem("userData"))
                : null;
            if (existingUser !== null) {
              updatedData2["employeeName"] = existingUser.ownerId;
              updatedData2["employeeNames"] = existingUser.ownerName;
            }
          }
          setCompanyInfo(updatedData2);
          setEmpData(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const getRewardsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "rewardName");
          nonduplicate = tableGenerator(data, data.length);
          setRewardsData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchEmployees();
    getRewardsData();
    //eslint-disable-next-line
  }, []);
  const handleSelect = (points, amount, rewardId) => {
    try {
      setLoading(true);
      let response = dispatch(
        createRedeemPoints({ points, amount, userId: user._id, rewardId })
      );
      response.then(({ data, message }) => {
        setLoading(false);
        setError("");
        getRewardsData();
        fetchRewardPoints();
        fetchAllRedeemPoints();
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleUpdate = (rewardId, status) => {
    try {
      setLoading(true);
      let response = dispatch(updateRedeem(rewardId, { status }));
      response.then(({ data, message }) => {
        setLoading(false);
        setError("");
        getRewardsData();
        fetchRewardPoints();
        fetchAllRedeemPoints();
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  return (
    <>
      <style>{`
        /* Fix broken cancel icon in react-user-onboarding */
        img[alt="cancel"] {
          display: none !important;
        }
        
        img[alt="cancel"]::before {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          display: inline-block;
        }
        
        /* Target the cancel button container */
        [class*="cancel"] {
          position: relative;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        [class*="cancel"]::after {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          line-height: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        [class*="cancel"]:hover::after {
          color: #333;
        }
      `}</style>
      <Box
  sx={{
    borderRadius: 3, 
    minHeight: "100%",
    p: isMobile ? 1 : 4,
    m: isMobile ? 1 : 4,
    backgroundColor:"white",
  }}
>
      
        {selectedTab.tab === "rewardsRedemption" ? (
          <>              
<Box
  sx={{
    backgroundColor: secondaryColors.white,
    padding: 3,
    borderRadius: 2,
    boxShadow: 1,
    mb: 4,
  }}
  >
  <Box
    display="flex"
    flexDirection="column"
    alignItems="flex-start"
    sx={{ mb: 2 }}
  >
    <Typography sx={{ fontSize: { xs: 16, sm: 20, md: 22 }, fontWeight: 600, mb: { xs: 2, sm: 3 } }}>
      Rewards Redemption
    </Typography>
    <Typography sx={{ fontSize:{ xs: 14, sm: 18, md: 20 }, fontWeight: 600, mb: 2 }}>
      Rewards
    </Typography>
  </Box>

    
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
      }}
    >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ width: "100%" }}>
          <SelectComponent
           fullWidth
            placeholder=""
            id="employeeName"
            label={t("Rewards.employee")}
            value={companyInfo.employeeName}
            disabled={isAvailable}
            onChange={(e) => {
              handleChange(e);
              localStorage.setItem(
                "userData",
                JSON.stringify({
                  ownerName: e.target.label,
                  ownerId: e.target.value,
                })
              );
            }}
            options={empData}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ width: "100%" }}>
          <SelectComponent
            fullWidth
            id="rewardsPeriod"
            label={t("Rewards.period")}
            placeholder=""
            name="okrPeriod"
            options={OKRperiodMonths}
            value={companyInfo.okrPeriod}
            onChange={handleChange}
            disabled={isAvailable}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box ref={elem3} sx={{ width: "100%" }}>
          <SelectComponent
            fullWidth
            id="rewardType"
            label={t("Rewards.rewardType")}
            placeholder=""
            name="rewardType"
            options={RewardCategories}
            value={companyInfo.rewardType}
            onChange={handleChange}
          />
        </Box>
      </Grid>
    </Grid>
   </Box>

</Box>

              <RewardsTable/>
              
            <Box
  sx={{
    mt: 3,
    borderRadius: 2,
    boxShadow: 2,
    backgroundColor: secondaryColors.white,
  }}
>
        <Typography
              variant="h5"               
              sx={{
                p: 4,                   
                fontWeight: "bold",      
              }}
          >
        {t("Rewards.redemption")}
      </Typography>

<Box
  sx={{
    display: "flex",
    justifyContent: "space-arround",
    flexWrap: "wrap",
    mt: 3,
    alignItems: "center",
  }}
>
  {/* Left Side - Pie Chart & Points */}
  <Box
    className="pie"
    sx={{
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
      maxWidth: { md: '60%', xs: '100%' },
      mt: 3,
    }}
  >
    <Box className="pieChart" sx={{ pl: 3 ,m:2}}>
      {remainingPoints && (
        <PieChartRewards
          redeemed={redeemedPoints}
          remaining={remainingPoints}
        /> 
      )}
    </Box>

    <Box className="giveAway" sx={{ ml: 4 }}>
      <Box ref={elem1}>
        {remainingPoints > 0 && (
          <>
            <Typography>
              {t("Rewards.congratulations")} {user?.name},
            </Typography>
            <Typography>{t("Rewards.earnedPoints")}</Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "40px",
                textAlign: "center",
                p: 2,
                mb: 0,
              }}
            >
              {Number(remainingPoints).toFixed(2)}
            </Typography>
            <Typography sx={{ mb: 0 }}>
              {t("Rewards.before")}
              <br /> {t("Rewards.claim")}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  </Box>

  {/* Right Side - Slider & Labels */}
  <Box
    sx={{
      flexGrow: 1,
      maxWidth: { md: '35%', xs: '100%' },
      mt: { xs: 2, md: 3 },                
    ml: { xs: 0, md: 4 },                
    p: { xs: 1, md: 2 },
    }}
  >
    {remainingPoints && (
      <Slider
        bronze={bronzePoints}
        silver={silverPoints}
        gold={goldPoints}
        progressStatus={remainingPoints / 10}
        disabled
      />
    )}

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 1,
        px: { xs: 1, md: 0 }, 
      }}
    >
      <Typography sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}>{t("Rewards.bronze")}</Typography>
      <Typography sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}>{t("Rewards.silver")}</Typography>
      <Typography sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}>{t("Rewards.gold")}</Typography>
    </Box>

    {remainingPoints > 0 && (
      <Typography textAlign="center" mt={1}>
        {remainingPoints < silverPoints
          ? silverPoints - remainingPoints
          : goldPoints - remainingPoints}{" "}
        {t("Rewards.morePoints")}{" "}
        <b>
          {remainingPoints < silverPoints
            ? t("Rewards.silver")
            : t("Rewards.gold")}
        </b>
      </Typography>
    )}
  </Box>
</Box>


<Box
  ref={elem2}
  sx={{
    display: "flex",
    flexWrap: "wrap",         
    justifyContent: { xs: "center", sm: "flex-start" }, 
    gap: { xs: 2, sm: 3, md: 4 }, 
    p: { xs: 1, sm: 2 },          
  }}
>
  {loading ? (
    <LoadingIndicator />
  ) : (
    rewardsData.length > 0 &&
    rewardsData
      .filter((reward) => reward.rewardType === companyInfo.rewardType)
      .map((reward, index) => {
        const isDisabled =
          earnedPoints < reward.rewardPoints ||
          reward.status === "approved" ||
          reward.status === "in progress";

        return (
          <Tippy
            key={index}
            content={
              <Toolcard
                reward={reward}
                role={user.role}
                userPoints={earnedPoints}
                handleSelect={handleSelect}
                handleUpdate={handleUpdate}
              />
            }
            placement="right"
            className="hover"
            interactive
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "48%", md: "22%" }, 
                bgcolor: isDisabled ? "grey.100" : "background.paper",
                p: { xs: 1.5, md: 2 },                     
                borderRadius: 2,
                boxShadow: 1,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: isDisabled ? "none" : "scale(1.02)", 
                },
              }}
            >
              {/* Icon */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <img
                  src={reward.rewardIcon}
                  alt="reward logo"
                  className="rewardlogo"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
              </Box>

              {/* Reward Name */}
              <Typography
                variant="h6"
                align="center"
                className="rewardtitle"
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 18 },
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {reward.rewardName}
              </Typography>
              <Typography
                align="center"
                sx={{
                  color: isDisabled ? "text.primary" : "success.main",
                  fontWeight: 500,
                  fontSize: { xs: 13, sm: 15 },
                }}
              >
                {reward.rewardPoints}
              </Typography>

              {/* Eligibility */}
              {!isDisabled && (
                <Typography
                  align="center"
                  sx={{
                    color: "success.main",
                    fontWeight: 500,
                    fontSize: { xs: 12, sm: 14 },
                  }}
                >
                  {t("Rewards.eligible")}
                </Typography>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Reward Code */}
              <Typography
                align="center"
                className="rewardcode"
                sx={{ fontSize: { xs: 12, sm: 13 } }}
              >
                {reward.rewardCode}
              </Typography>

              {/* Reward Type */}
              <Typography
                align="center"
                color="text.secondary"
                sx={{ fontSize: { xs: 12, sm: 13 } }}
              >
                {reward.rewardType}
              </Typography>

              {/* Status */}
              {reward.status !== "pending" && (
                <Typography
                  align="center"
                  sx={{
                    textTransform: "uppercase",
                    color:
                      reward.status === "approved"
                        ? "success.main"
                        : "warning.main",
                    fontWeight: 600,
                    mt: 1,
                    fontSize: { xs: 12, sm: 14 },
                  }}
                >
                  {reward.status}
                </Typography>
              )}
            </Box>
          </Tippy>
        );
      })
  )}
</Box>
            </Box>
          </>
        ) : (
          <>

<Grid container spacing={2} sx={{ mt: 5 }}>
  {/* Employee Name Block */}
  <Grid item xs={12} md={6}>
    <Box display="flex" alignItems="center">
      <Typography
        component="label"
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          minWidth: "120px", // Equivalent to col-md-4
          mr: 2,
        }}
      >
        Employee
      </Typography>

      <Typography sx={{ fontSize: "14px", fontWeight: 300 }}>
        Nandhini Clament
      </Typography>
    </Box>
  </Grid>

  {/* SelectInput Block */}
  <Grid item xs={12} md={6}>
    <SelectInput
      label="Other Participants Contribute"
      placeholder=""
      name="okrPeriod"
      options={OKRperiod}
      value={companyInfo.okrPeriod}
      disabled={isAvailable}
    />
  </Grid>
</Grid>


<Box
  display="flex"
  alignItems="flex-start"
  mt={4}
  flexDirection={isMobile ? "column" : "row"}
>
  <Typography
    component="label"
    htmlFor="comments"
    sx={{
      mr: 5,
      minWidth: isMobile ? "30%" : "unset",
      mb: isMobile ? 1 : 0,
      p: 0,
      m: 0,
    }}
  >
    Comments
  </Typography>

  <TextField
    id="comments"
    name="comments"
    multiline
    rows={5}
    variant="outlined"
    sx={{
      p: 1,
      width: isMobile ? "100%" : "40%",
      ml: isMobile ? 0 : 5,
    }}
  />
</Box>

            {showAttachment ? (

<Box
  display="flex"
  justifyContent={isMobile ? "space-between" : "flex-start"}
  width={isMobile ? "100%" : "50%"}
  alignItems="center"
>
  <Typography
    component="label"
    htmlFor="comment"
    sx={{
      minWidth: isMobile ? "15%" : "30%",
      m: 0,
      p: 0,
    }}
  >
    {t("Tasks.Upload Files")}
  </Typography>

  <BrowseFilesNormal
    className="col-12"
    setData={({ url }) => {
      handleChange({
        target: { name: "attachments", value: url },
      });
      setShowAttachment(!showAttachment);
    }}
  />
</Box>

            ) : (

<Box
  display="flex"
  alignItems="center"
  gap={2}
  sx={{ border: "1px solid #ccc", padding: 1, borderRadius: 1 }} // similar to `.browse-border`
>
  <Link href="" target="_blank" rel="noopener noreferrer">
    View Attachment
  </Link>

  <Button
    variant="contained"
    color="primary"
    onClick={() => setShowAttachment(!showAttachment)}
  >
    Reupload Attachment
  </Button>
</Box>

            )}
              <Box>
      <Box mb={2}>
        <Button variant="contained" color="success">
          Import
        </Button>
      </Box>

      {/* Private & Public Checkboxes */}
      <Stack direction="row" justifyContent="center" spacing={5} mt={5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox id="private" />
          <label htmlFor="private">Private</label>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox id="public" />
          <label htmlFor="public">Public</label>
        </Stack>
      </Stack>

      {/* Buttons: Schedule + Send Now */}
      <Stack direction="row" spacing={2} mt={3}>
        <Button variant="outlined" color="inherit">
          Schedule
        </Button>
        <Button variant="contained" color="success">
          Send Now
        </Button>
      </Stack>

      {/* Horizontal Line */}
      <Divider sx={{ my: 4 }} />

      {/* Tab Navigation */}
      <Stack direction="row" spacing={5}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: "bold",
            color: selectedTab.tab === "me" ? "primary.main" : "text.primary",
          }}
        >
          GIVEN
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: "bold",
            color:
              selectedTab.tab === "RECEIVED" ? "primary.main" : "text.primary",
          }}
        >
          {user.role === "Manager" ? "My team" : "RECEIVED"}
        </Typography>
      </Stack>

      {/* Profile and View Board */}
      <Stack direction="row" spacing={2} alignItems="center" mt={4}>
        <Box component="img" src={profile} alt="profile" width={40} />
        <Button variant="contained" color="success">
          View Board
        </Button>
      </Stack>

      {/* Header */}
      <Stack direction="row" spacing={2} mt={2}>
        <Typography variant="body2" fontWeight="bold">
          FOR
        </Typography>
        <Typography variant="body2">Nandhini Clament</Typography>
        <Typography variant="body2">Min board</Typography>
      </Stack>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />

      {/* Creator + Icons */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1}>
          <Typography variant="body2">Creator</Typography>
          <Typography variant="body2" fontWeight="bold">
            Created
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Box component="img" src={printer} alt="printer" width={20} />
          <Box component="img" src={vedeo} alt="vedeo" width={20} />
        </Stack>
      </Stack>

      {/* Name and Date */}
      <Stack direction="row" spacing={2} mt={2}>
        <Typography variant="body2">Yesu Clament David</Typography>
        <Typography variant="body2">May 14, 2021</Typography>
      </Stack>

      {/* Posts + Redeem */}
      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <Typography variant="body2">Posts</Typography>
        <Button variant="outlined">Redeem</Button>
        <Typography variant="body2">Last post added</Typography>
      </Stack>

      {/* Max + Time */}
      <Stack direction="row" spacing={2} mt={1}>
        <Typography variant="body2">1 (Max of 10)</Typography>
        <Typography variant="body2">1 minute ago</Typography>
      </Stack>
    </Box>
          </>
        )}
      </Box>
      <UserOnboarding
        story={location.state ? getStory() : []}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
      />
    </>
  );
}
