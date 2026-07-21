/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import TitleHeader from "components/TitleHeader";
import addNewReward from "assets/svg/addNewReward.svg";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import { useDispatch } from "react-redux";
import "./style.scss";
import useWindowSize from "components/UseWindowSize";
import Toolcard from "./Toolcard";
import { Toast } from "service/toast";
import Tippy from "@tippyjs/react";
import {
  createReward,
  deleteReward,
  getAllRewards,
  updateReward,
} from "action/RewardsAct";
import AddRewardPopup from "./AddRewardPopup";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  TextField,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

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
      rewardApprover: data[i].rewardApprover,
      rewardPoints: data[i].rewardPoints,
      rewardAmount: data[i].rewardAmount,
      rewardStatus: data[i].rewardStatus,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

function CatalogManagement() {
  const { t } = useTranslation();
  const [rewardData, setRewardData] = useState({
    rewardIcon: "",
    rewardName: "",
    rewardCode: "",
    rewardDescription: "",
    rewardPoints: 0,
    rewardAmount: 0,
    rewardStatus: "active",
    rewardType: "",
    rewardApprover: "",
  });
  const [rewardsData, setRewardsData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const validator = Validator();
  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (value) => {
    setSearchText(value); 
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      getRewardsData(value); 
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (rewardData) => {
    if (validator.current.allValid()) {
      if (editId) {
        const finalData = {
          ...rewardData,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updateReward(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            emptyData();
            getRewardsData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        const finalData = {
          ...rewardData,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createReward(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            emptyData();
            getRewardsData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({
        message: t("catalogManagement.validationError"),
        time: 4000,
        type: "warning",
      });
    }
  };

  const getRewardsData = (searchValue = "") => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards(searchValue));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "rewardName");
          nonduplicate = tableGenerator(data, data.length);
          setRewardsData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setRewardsData([]);
          setError(t("catalogManagement.noData"));
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

  const handleEdit = (row) => {
    setRewardData({
      rewardIcon: row.rewardIcon,
      rewardName: row.rewardName,
      rewardCode: row.rewardCode,
      rewardDescription: row.rewardDescription,
      rewardPoints: row.rewardPoints,
      rewardAmount: row.rewardAmount,
      rewardStatus: row.rewardStatus,
      rewardType: row.rewardType,
      rewardApprover: row.rewardApprover,
    });
    setEditId(row._id);
    handleShowAdd();
  };

  const handleShowAdd = () => {
    setShowAdd(true);
  };

  const emptyData = () => {
    setRewardData({
      rewardIcon: "",
      rewardName: "",
      rewardCode: "",
      rewardDescription: "",
      rewardPoints: 0,
      rewardAmount: 0,
      rewardStatus: "active",
      rewardType: "",
      rewardApprover: "",
    });
    setEditId(null);
    validator.current.hideMessages();
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    let response = dispatch(deleteReward(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getRewardsData();
      } else {
        setError(message);
      }
    });
  };

  useEffect(() => {
    getRewardsData();
  }, []);

  const handleAddRewardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleShowAdd();
      setEditId(null);
    }
  };

  return (
    <>
      <TitleHeader name={t("catalogManagement.headerTitle")} />
      <Box
        sx={{
          padding: "1rem",
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bold",
            textAlign: isMobile ? "center" : "left",
            pb: isMobile ? 0 : 3,
            color: "black",
            fontFamily: "Montserrat",
          }}
        >
          {t("catalogManagement.title")}
        </Typography>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <TextField
            placeholder={t("catalogManagement.searchPlaceholder")}
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            variant="outlined"
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "100%",
              maxWidth: 360,
              borderRadius: "12px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </Box>

        <Grid container spacing={2}>
          <Box
            component="button"
            tabIndex={0}
            aria-label={t("catalogManagement.addNewReward")}
            onKeyDown={handleAddRewardKeyDown}
            onClick={() => {
              handleShowAdd();
              setEditId(null);
            }}
            sx={{
              m: 2,
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "250px",
              cursor: "pointer",
              backgroundColor: "#827e39",
              boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
              borderRadius: "1rem",
              border: "none",
              outline: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                opacity: 0.9,
              },
              "&:focus": {
                outline: "3px solid #FFD700",
                outlineOffset: "3px",
              },
              "&:focus-visible": {
                outline: "3px solid #FFD700",
                outlineOffset: "3px",
              },
            }}
          >
            <Typography variant="h6" sx={{ mt: 1 }} color={"#fff"}>
              {t("catalogManagement.addNewReward")}
            </Typography>
            <img
            tabIndex={0}
              src={addNewReward}
              alt="new reward"
              style={{ width: "50px", height: "50px", pointerEvents: "none" }}
            />
          </Box>

          {loading ? (
            <LoadingIndicator />
          ) : 
            rewardsData.length > 0 ?
           ( rewardsData.map((reward, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  minWidth: "250px",
                }}
              >
                <Tippy
                  content={<Toolcard reward={reward} />}
                  placement="right"
                  interactive={true}
                >
                  <Box
                    sx={{
                      m: 2,
                      p: 2,
                      cursor: "pointer",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: "250px",
                      maxWidth: "250px",
                      minHeight: "370px",
                      maxHeight: "370px",
                      marginLeft: "1.5rem",
                      boxShadow: "0px 4px 40px 0px rgba(0, 0, 0, 0.08)",
                      bgcolor: "#fff",
                      borderRadius: "1rem",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                        <img
                          src={reward.rewardIcon}
                          alt="reward logo"
                          style={{
                            minWidth: "200px",
                            minHeight: "100px",
                            maxHeight: "100px",
                            borderRadius: ".5rem",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 0,
                          color: "#827e39",
                          fontWeight: "600",
                          textAlign: "start",
                          fontFamily: "Montserrat",
                        }}
                      >
                        {reward.rewardName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontFamily: "Work Sans",
                          fontWeight: "400",
                        }}
                      >
                        {reward.rewardDescription}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {reward.rewardType}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => handleEdit(reward)}
                        sx={{
                          borderRadius: "8px",
                          padding: "6px",
                          color: "#827e39",
                          "&:hover": {
                            backgroundColor: "rgba(130, 126, 57, 0.08)",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDelete(reward._id)}
                        sx={{
                          borderRadius: "8px",
                          padding: "6px",
                          color: "#827e39",
                          "&:hover": {
                            backgroundColor: "rgba(130, 126, 57, 0.08)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Tippy>
              </Box>
            ))
          ): 
          (
    searchText.trim() !== "" && (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          m: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontFamily: "Montserrat",
            textAlign: "center",
          }}
        >
          No Search Results
        </Typography>
      </Box>
    )
          )}
        </Grid>

        {showAdd && (
          <AddRewardPopup
            handlecallback={handleSubmit}
            show={showAdd}
            onHide={() => setShowAdd(!showAdd)}
            editId={editId}
            rewardDatas={rewardData}
          />
        )}
      </Box>
    </>
  );
}

export default CatalogManagement;
