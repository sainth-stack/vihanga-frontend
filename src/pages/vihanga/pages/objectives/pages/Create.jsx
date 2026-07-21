import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import Stepper from "pages/vihanga/components/stepper";
import FileUpload from "../../../components/filesUplode/draganddropFile";
import { createObjective, updateObjective, getObjectiveSingle, getObjectives } from "action/GoalsAct";
import { getEmployees } from "action/EmployeeAct";
import Progress from "../components/pages/Progress";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { Toast } from "service/toast";
import './create.scss';
import { getAllRewards } from "action/RewardManagementAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { getObjectiveRewardPoints } from "utils/rewardCalculator";
import { useTranslation } from 'react-i18next';

const SESSION_STORAGE_KEY = "objectiveFormData";

const useQuery = () => new URLSearchParams(useLocation().search);

// Helper function to get initial form data
const getInitialFormData = () => {
  const user = JSON.parse(localStorage.getItem("userData")) || {};
  return {
    objective: "",
    weight: "",
    owner: user?.ownerId || "",
    dueDate: "",
    dimension: "",
    comments: "",
    progressStatus: "0",
    file: "",
  };
};

export default function ObjectiveForm() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useQuery();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const DIMENSION_OPTIONS = [
    { label: t("ObjectiveForm.Dimensions.People"), value: "People" },
    { label: t("ObjectiveForm.Dimensions.Financial"), value: "Financial" },
    { label: t("ObjectiveForm.Dimensions.Operations"), value: "Operations" },
    { label: t("ObjectiveForm.Dimensions.Strategy"), value: "Strategy" },
    { label: t("ObjectiveForm.Dimensions.ProcessGovernanceSystem"), value: "Process/Governance/System" },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [savedObjectiveId, setSavedObjectiveId] = useState(null);
  const objectiveId = query.get("objectiveId");
  const keyResultId = query.get("keyResultId");
  const [isEditMode, setIsEditMode] = useState(false);
  const isEdit = query.get("isEdit") === "true";
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [objectiveSaved, setObjectiveSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [existingObjectives, setExistingObjectives] = useState([]);
  const [totalExistingWeight, setTotalExistingWeight] = useState(0);
  const [isGifShown, setIsGifShown] = useState(false);
  const gifShownRef = useRef(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [rewardSchemes, setRewardSchemes] = useState([]);
  const [privilegeGroups, setPrivilegeGroups] = useState([]);

  // Determine if progress should be editable
  // Progress is editable only for managers
  const isProgressEditable = () => {
    // Check if user role is Manager (case-insensitive)
    const userRole = user?.role?.toLowerCase() || "";
    return userRole.includes("manager");
  };

  // Initialize form data based on mode
  const [formData, setFormData] = useState(() => {
    // If we have an objectiveId, we're in edit mode - don't use session storage
    if (objectiveId) {
      return getInitialFormData();
    }
    
    // For new objectives, try to restore from session storage
    const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : getInitialFormData();
  });

  const STEPS = [
    { label: t("ObjectiveForm.Stepper.Objective"), path: `/admin/objectives/objective?${isEdit ? "isEdit=true" : ""}&objectiveId=${objectiveId || savedObjectiveId || ""}` },
    { label: t("ObjectiveForm.Stepper.KR"), path: `/admin/objectives/details?${isEdit ? "isEdit=true" : ""}&objectiveId=${objectiveId || savedObjectiveId || ""}&keyResultId=${keyResultId || ""}` },
    { label: t("ObjectiveForm.Stepper.Task"), path: `/admin/objectives/task?${isEdit ? "isEdit=true" : ""}&objectiveId=${objectiveId || savedObjectiveId || ""}&keyResultId=${keyResultId || ""}` },
  ];

  // Effect to fetch reward schemes and privilege groups on mount
  useEffect(() => {
    const fetchRewardData = async () => {
      try {
        // Fetch reward schemes
        const rewardsResponse = await dispatch(getAllRewards());
        if (rewardsResponse.data) {
          setRewardSchemes(rewardsResponse.data);
        }
        
        // Fetch privilege groups
        const groupsResponse = await dispatch(getAllPrivilegesGroup());
        if (groupsResponse.data && groupsResponse.data.privilegeGroups) {
          setPrivilegeGroups(groupsResponse.data.privilegeGroups);
        }
      } catch (error) {
        console.error("Error fetching reward data:", error);
      }
    };
    
    fetchRewardData();
  }, [dispatch]);

  // Fetch existing objectives to calculate total weight
  const fetchExistingObjectives = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const response = await dispatch(getObjectives(user.role, user._id));
      
      if (response.data && response.data.length > 0) {
        // Filter objectives for the current user
        const userObjectives = response.data.filter((item) => {
          const existingUser = JSON.parse(localStorage.getItem("userData")) || {};
          return item.employeeName === (existingUser?.ownerName || userData.ownerName);
        });
        
        setExistingObjectives(userObjectives);
        
        // Calculate total weight of existing objectives
        const totalWeight = userObjectives.reduce((sum, obj) => {
          return sum + Number(obj.weight || 0);
        }, 0);
        
        setTotalExistingWeight(totalWeight);
      }
    } catch (error) {
      console.error("Error fetching existing objectives:", error);
    }
  }, [dispatch, user.role, user._id]);

  // Load objective data for edit mode
  useEffect(() => {
    if (objectiveId) {
      setIsEditMode(true);
      setLoading(true);
      dispatch(getObjectiveSingle(objectiveId, user.role))
        .then(({ data }) => {
          if (data) {
            const loadedData = {
              objective: data.objective || "",
              weight: data.weight || "",
              owner: data.owner || "",
              dueDate: data.dueDate || "",
              dimension: data.dimension || "",
              comments: data.comments || "",
              progressStatus: data.progressStatus?.toString() || "0",
              file: "",
            };
            setFormData(loadedData);
            
            // Set uploaded file URL if exists
            if (data.feedAttachment) {
              setUploadedFileUrl(data.feedAttachment);
            }
            
            // Set isGifShown based on the data from API
            setIsGifShown(data.isGifShown || false);
            
            // Mark as already saved since we're editing
            setObjectiveSaved(true);
            setSavedObjectiveId(objectiveId);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch objective:", err);
          Toast({ 
            type: "error", 
            message: "Failed to load objective data", 
            time: 3000 
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsEditMode(false);
      // For new objectives, check if we have saved session data
      const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          // Check if we have a saved objective ID from previous session
          const savedId = sessionStorage.getItem("savedObjectiveId");
          if (savedId) {
            setSavedObjectiveId(savedId);
            setObjectiveSaved(true);
          }
        } catch (error) {
          console.error("Error parsing saved form data:", error);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    }
  }, [objectiveId, dispatch, user.role]);

  // Fetch existing objectives on component mount
  useEffect(() => {
    fetchExistingObjectives();
  }, [fetchExistingObjectives]);

  // Update stepper active step based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = STEPS.findIndex((step) => {
      const stepPath = step.path.split('?')[0]; // Compare only the base path
      return stepPath === currentPath;
    });
    setActiveStep(stepIndex !== -1 ? stepIndex : 0);
  }, [location.pathname, savedObjectiveId]);

  // Save form data to session storage only for new objectives
  useEffect(() => {
    if (!isEditMode && !objectiveId) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isEditMode, objectiveId]);

  // Validate form (weight is auto-computed from KRs, so only objective name is required)
  useEffect(() => {
    const isValid = formData.objective.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);

  // Removed the useEffect that was triggering animation on progress status change
  // Animation will only be shown during form submission based on isGifShown

  // Load employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await dispatch(getEmployees());
      if (response.data && response.data.length > 0) {
        const employeeOptions = response.data.map((item) => ({
          value: item._id,
          label: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
        }));
        const uniqueEmployees = employeeOptions.filter((employee, index, self) =>
          index === self.findIndex(e => e.label === employee.label)
        );
        setEmployees(uniqueEmployees);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      Toast({ 
        type: "error", 
        message: "Failed to load employees", 
        time: 3000 
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  const validateWeight = useCallback((newWeight) => {
    const currentWeight = Number(newWeight) || 0;
    let adjustedExistingWeight = totalExistingWeight;
    
    if (isEditMode && (objectiveId || savedObjectiveId)) {
      const currentObjectiveId = objectiveId || savedObjectiveId;
      const currentObjective = existingObjectives.find(obj => obj._id === currentObjectiveId);
      if (currentObjective) {
        adjustedExistingWeight = totalExistingWeight - Number(currentObjective.weight || 0);
      }
    }
    
    const totalWeight = adjustedExistingWeight + currentWeight;
    
    if (totalWeight > 100) {
      const remainingWeight = 100 - adjustedExistingWeight;
      Toast({
        type: "warning",
        message: `Total weight cannot exceed 100%. You can add up to ${remainingWeight}% more.`,
        time: 5000
      });
      return false;
    }
    return true;
  }, [totalExistingWeight, isEditMode, objectiveId, savedObjectiveId, existingObjectives]);

  const handleUploadToCloudinary = async (file) => {
    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", "ma7nge92");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload",
        uploadFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            if (percent === 25 || percent === 50 || percent === 75 || percent === 100) {
              Toast({ 
                message: `Uploaded ${percent}%`, 
                type: "success", 
                time: 500 
              });
            }
          },
        }
      );

      const fileUrl = response.data.secure_url;
      setUploadedFileUrl(fileUrl);
      Toast({ 
        message: "File uploaded successfully!", 
        type: "success", 
        time: 2000 
      });
      
      return fileUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      Toast({ 
        message: "Upload failed. Please try again.", 
        type: "error", 
        time: 3000 
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    
    
  }, []);

  const handleFileChange = useCallback(async (file) => {
    if (file) {
      const fileUrl = await handleUploadToCloudinary(file?.file);
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, file: file.name }));
      }
    }
  }, []);

  const handleAddKrClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!isFormValid) {
        Toast({ type: "warning", message: "Please fill in all required fields", time: 3000 });
        return;
      }
      
      const finalObjectiveId = objectiveId || savedObjectiveId;
      if (!finalObjectiveId) {
        Toast({ type: "warning", message: "Please save the objective first before adding KR", time: 3000 });
        return;
      }
      
      history.push(
        `/admin/objectives/details?objectiveId=${finalObjectiveId}`
      );
    },
    [isFormValid, history, objectiveId, savedObjectiveId]
  );

  const handleSaveObjective = useCallback(() => {
    if (!isFormValid) {
      Toast({ type: "warning", message: "Please fill in all required fields", time: 3000 });
      return;
    }

    setLoading(true);

    // Calculate dynamic reward points and get approval status
    const rewardConfig = getObjectiveRewardPoints({
      userId: user._id,
      rewardSchemes,
      privilegeGroups
    });
    const dynamicRewardPoints = rewardConfig?.points || 0;
    const approvalRequired = rewardConfig?.approvalRequired || false;

    const payload = {
      comments: formData.comments,
      objective: formData.objective,
      weight: String(formData.weight).trim(),
      owner: user?.name,
      dueDate: formData.dueDate,
      dimension: formData.dimension,
      progressStatus: formData.progressStatus,
      feedAttachment: uploadedFileUrl || "",
      employeeName: user?.name,
      employeeReferenceId: user._id,
      okrPeriod: "Q1",
      companyId: user?.companyId || "",
      okrYear: new Date().getFullYear(),
      totalWeight: 0,
      isGifShown: isEditMode ? isGifShown : false, // Keep existing value for edits
      dynamicRewardPoints: dynamicRewardPoints,
      approvalRequired: approvalRequired,
    };

    const handleSuccess = (data) => {
      const newObjectiveId = data._id;
      
      // Get reward points from API response
      const apiRewardPoints = data.rewardPoints || data.dynamicRewardPoints || 0;
      
      console.log("Objective save success - Animation check:", {
        progress: formData.progressStatus,
        apiRewardPoints,
        isGifShown,
        isEditMode
      });
      
      // Show animation only for updates when isGifShown is false (first time) and progress is 100 and user has reward points from API
      if (isEditMode && !isGifShown && Number(formData.progressStatus) === 100 && apiRewardPoints > 0) {
        if (!gifShownRef.current) {
          gifShownRef.current = true;
          
          console.log("Showing reward animation with points from API:", apiRewardPoints);
          setShowGif(true);
          setRewardPoints(apiRewardPoints); // Use reward points from API response
          setTimeout(() => {
            setShowGif(false);
            setRewardPoints(0);
            gifShownRef.current = false;
            // Mark GIF as shown for this objective
            setIsGifShown(true);
          }, 5000);
        }
      }
      
      if (!isEditMode) {
        // Clear session storage after successful creation
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.setItem("savedObjectiveId", newObjectiveId);
        
        setObjectiveSaved(true);
        setSavedObjectiveId(newObjectiveId);
        
        // Update URL with the new objective ID without page reload
        const newUrl = `/admin/objectives/objective?objectiveId=${newObjectiveId}`;
        history.replace(newUrl);
      } else {
        // For edit mode, we might want to go back or stay on the same page
        // history.goBack();
      }
      
      setLoading(false);
    };

    const handleError = (error) => {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} objective:`,
        error
      );
      setLoading(false);
    };

    if (isEditMode && (objectiveId || savedObjectiveId)) {
      const idToUpdate = objectiveId || savedObjectiveId;
      dispatch(updateObjective(idToUpdate, payload))
        .then(({ success, data }) => {
          if (success) {
            handleSuccess({ _id: idToUpdate, ...data });
          } else {
            throw new Error("Update failed");
          }
        })
        .catch(handleError);
    } else {
      dispatch(createObjective(payload))
        .then(({ success, data }) => {
          if (success && data) {
            handleSuccess(data);
          } else {
            throw new Error("Creation failed");
          }
        })
        .catch(handleError);
    }
  }, [
    formData,
    isFormValid,
    isEditMode,
    objectiveId,
    dispatch,
    history,
    savedObjectiveId,
    uploadedFileUrl,
    user,
    validateWeight,
    isGifShown,
    rewardSchemes,
    privilegeGroups
  ]);

  const handleBackClick = useCallback(() => {
    // Check if we came from reviews
    const fromReviews = query.get("fromReviews") === "true";
    
    // Clear session storage when navigating away
    if (!isEditMode && !objectiveSaved) {
      const shouldClear = window.confirm("You have unsaved changes. Do you want to discard them?");
      if (shouldClear) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem("savedObjectiveId");
      } else {
        return;
      }
    }
    
    // Navigate back to reviews if we came from there, otherwise go to objectives
    if (fromReviews) {
      history.push("/admin/reviews");
    } else {
      history.push("/admin/objectives");
    }
  }, [history, isEditMode, objectiveSaved, query]);
  return (
    <div>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={"lottie-img"}
          alt="LottieConfettie"
        />
        <br />
        <h3>{t("ObjectiveForm.EarnedRewardPoints", { points: rewardPoints })}</h3>
      </div>
      
      <Box
        mt={"20px"}
        sx={{
          width: "100%",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          padding:isMobile ? "14px" : "20px",
          boxShadow: 1,
          pointerEvents: isFormValid ? "auto" : "none",
          opacity: isFormValid ? 1 : 0.5,
        }}
      >
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={(stepIndex) => {
            if (isFormValid) {
              history.push(STEPS[stepIndex].path);
            }
          }}
        />
      </Box>

      <div
        className="card "
        style={{ borderRadius: "20px", marginTop: "20px",height:'100%',padding:isMobile ? "14px" : "20px" }}
      >
        <Box
          sx={{
            margin:  isMobile ? "0.1rem" : "0 2rem",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            <ArrowBackIosIcon
              tabIndex={0}
              onClick={handleBackClick}
              sx={{ fontSize: 30, color: "#000", cursor: "pointer" }}
            />
            {isEditMode ? t("ObjectiveForm.EditObjective") : t("ObjectiveForm.CreateObjective")}
            {objectiveSaved && !isEditMode && (
              <Typography
                variant="body2"
                sx={{
                  color: "#4CAF50",
                  fontWeight: "500",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {t("ObjectiveForm.ObjectiveSavedSuccess")}
              </Typography>
            )}
          </Typography>

          

          <form style={{padding:isMobile ? "14px" : "20px"}} >
            <Box mb={3} style={{width:'100%'}} >
              <Typography component="label">{t("ObjectiveForm.FormLabels.Objective")}</Typography>
              <InputTextComponent
                value={formData.objective}
                onChange={(e) => handleInputChange("objective", e.target.value)}
                fullWidth
              />
            </Box>

            <Box mb={3}>
              <Typography component="label">
                {t("ObjectiveForm.FormLabels.Weight")}
                <Typography component="span" variant="caption" sx={{ ml: 1, color: "#888" }}>
                  (auto-computed from KR weights)
                </Typography>
              </Typography>
              <InputTextComponent
                value={formData.weight}
                fullWidth
                type="number"
                disabled
              />
            </Box>

            <Box display="flex" flexDirection={isMobile || isTablet ? "column" : "row"} gap={3} mb={3}>
              <Box flex={1}>
                <Typography component="label">{t("ObjectiveForm.FormLabels.Owner")}</Typography>
                <SelectComponent
                  value={formData.owner}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  options={employees}
                  fullWidth
                  disabled={loadingEmployees}
                />
              </Box>
              <Box flex={1}>
                <Typography component="label">{t("ObjectiveForm.FormLabels.DueDate")}</Typography>
                <InputTextComponent
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  fullWidth
                  placeholder={t("ObjectiveForm.Placeholders.DateFormat")}
                />
              </Box>
            </Box>

            {/* Dimension dropdown - commented out, no longer mandatory */}
            {/* <Box mb={3}>
              <Typography component="label">{t("ObjectiveForm.FormLabels.Dimension")}</Typography>
              <SelectComponent
                value={formData.dimension}
                onChange={(e) => handleInputChange("dimension", e.target.value)}
                options={DIMENSION_OPTIONS}
                fullWidth
              />
            </Box> */}

            <Progress
              value={formData.progressStatus}
              onChange={(e) =>
                handleInputChange("progressStatus", Number(e.target.value))
              }
              disabled={!isProgressEditable()}
            />

            <Box mb={3}>
              <Typography component="label">{t("ObjectiveForm.FormLabels.Comment")}</Typography>
              <InputTextComponent
                type="text"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder={t("ObjectiveForm.Placeholders.EnterComment")}
                multiline={true}
                minRows={3}
                fullWidth
              />
            </Box>

            <Box mt={2} mb={3}>
              <Typography fontWeight={500} fontSize={16}>
                {t("ObjectiveForm.FormLabels.UploadFile")}
                {uploading && (
                  <Typography component="span" sx={{ ml: 1, color: "#1976d2" }}>
                    {t("ObjectiveForm.FileUpload.Uploading")}
                  </Typography>
                )}
                {uploadedFileUrl && !uploading && (
                  <Typography component="span" sx={{ ml: 1, color: "#4CAF50" }}>
                    {t("ObjectiveForm.FileUpload.FileUploaded")}
                  </Typography>
                )}
              </Typography>
              <FileUpload
                id="objective-upload"
                value={formData.file}
                link={uploadedFileUrl}
                onFileUpload={handleFileChange}
                disabled={uploading}
              />

            </Box>

            <Box 
              display="flex" 
              justifyContent="center" 
              gap={2} 
              mt={4}
              flexDirection={isMobile ? "column" : "row"}
              alignItems={isMobile ? "stretch" : "center"}
            >
              <Button
                variant="outlined"
                onClick={handleSaveObjective}
                disabled={!isFormValid || loading || uploading}
                sx={{
                  color: "#73712A",
                  borderColor: "#73712A",
                  borderRadius: "30px",
                  padding: isMobile ? "16px 16px" : isTablet ? "14px 14px" : "12px 20px",
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                  minWidth: isMobile ? "100%" : "auto",
                  "&:disabled": { opacity: 0.7 },
                }}
              >
                {loading
                  ? t("ObjectiveForm.Buttons.Saving")
                  : isEditMode
                  ? t("ObjectiveForm.Buttons.UpdateObjective")
                  : t("ObjectiveForm.Buttons.SaveDetails")}
              </Button>

              <Button
                variant="contained"
                onClick={handleAddKrClick}
                disabled={!isFormValid || (!objectiveId && !savedObjectiveId) || uploading}
                sx={{
                  backgroundColor: "#73712A",
                  borderRadius: "30px",
                  padding: isMobile ? "16px 24px" : isTablet ? "14px 28px" : "12px 30px",
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                  minWidth: isMobile ? "100%" : "auto",
                  "&:disabled": { opacity: 0.7 },
                  "&:hover": { backgroundColor: "#5a581f" },
                }}
              >
                {objectiveSaved ? t("ObjectiveForm.Buttons.AddKeyResults") : t("ObjectiveForm.Buttons.SaveAndAddKR")}
              </Button>
            </Box>
          </form>
        </Box>
      </div>
    </div>
  );
}