import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import Stepper from "pages/vihanga/components/stepper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import FileUpload from "pages/vihanga/components/filesUplode/draganddropFile";
import BellCurveChart from "./Graph";
import { useDispatch } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getKPIs, querySalesforce, deleteKPI,
  getJiraIssues,
  getJiraTasks,
  syncJiraStatuses,
} from "service/integrationapis";
import { api } from "service/api";
import { tasksApi } from "service/apiVariables";
import {
  getKeyResultSingle,
  createkeyResult,
  updatekeyResult,
} from "action/keyResultAct";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { Toast } from "service/toast";
import "./details2.scss";
import CommentPopup from "../../../../../pages/Tasks/commentPopup";
import CustomTable from "pages/vihanga/components/CustomTable";
import { getAllRewards } from "action/RewardManagementAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { getKRRewardPoints } from "utils/rewardCalculator";
import { useTranslation } from "react-i18next";
import { isTalentSpotify } from "utilities/api";
import { appURL } from "utilities/baseurl";
import { AuthEmail } from "utilities/validations";

// Date utility functions
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const parseDateFromInput = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

export default function KeyResultForm() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { objectiveId: paramObjectiveId } = useParams();

  const STEPS = [
    {
      label: t("ObjectiveForm.Stepper.Objective"),
      path: "/admin/objectives/objective",
    },
    {
      label: t("ObjectiveForm.Stepper.KR"),
      path: "/admin/objectives/keyresult",
    },
    { label: t("ObjectiveForm.Stepper.Task"), path: "/admin/objectives/task" },
  ];

  const STATUSOPTIONS = [
    { label: t("KeyResultForm.StatusOptions.NotStarted"), value: "notStarted" },
    { label: t("KeyResultForm.StatusOptions.InProgress"), value: "inProgress" },
    { label: t("KeyResultForm.StatusOptions.OnHold"), value: "onHold" },
    { label: t("KeyResultForm.StatusOptions.Completed"), value: "completed" },
  ];

  const KPIOPTIONS = [
    { label: t("KeyResultForm.KPIOptions.Revenue"), value: "revenue" },
    { label: t("KeyResultForm.KPIOptions.UserGrowth"), value: "usergrowth" },
    {
      label: t("KeyResultForm.KPIOptions.ConversionRate"),
      value: "conversionrate",
    },
  ];

  const UNITOPTIONS = [
    { label: t("KeyResultForm.UnitOptions.Number"), value: "number" },
    { label: t("KeyResultForm.UnitOptions.Percentage"), value: "percentage" },
    { label: t("KeyResultForm.UnitOptions.INR"), value: "INR" },
    { label: t("KeyResultForm.UnitOptions.USD"), value: "USD" },
    { label: t("KeyResultForm.UnitOptions.AED"), value: "AED" },
  ];

  const SOURCEOPTIONS = [
    { label: t("KeyResultForm.SourceOptions.SelectSource"), value: "" },
    { label: t("KeyResultForm.SourceOptions.Salesforce"), value: "salesforce" },
    { label: t("KeyResultForm.SourceOptions.Jira"), value: "jira" },
  ];

  // Get objectiveId from URL params or query string
  const urlParams = new URLSearchParams(location.search);
  const queryObjectiveId = urlParams.get("objectiveId");
  const objectiveId = paramObjectiveId || queryObjectiveId;
  const keyResultId = urlParams.get("keyResultId");

  const isEdit = !!keyResultId;

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepperDisabled, setStepperDisabled] = useState(true);
  const [savedKeyResultId, setSavedKeyResultId] = useState(null);
  const [showGif, setShowGif] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const gifShownRef = useRef(false);
  const [popupData, setPopupData] = useState(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [krReferenceId, setKrReferenceId] = useState("");
  const [taskData, setTaskData] = useState({ title: "" });
  const [isGifShown, setIsGifShown] = useState(false);
  const [rewardSchemes, setRewardSchemes] = useState([]);
  const [privilegeGroups, setPrivilegeGroups] = useState([]);

  // New states for Jira Task Import
  const [importTasks, setImportTasks] = useState(false);
  const [jiraTasks, setJiraTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTasksPopup, setShowTasksPopup] = useState(false);

  const handleCommentPopup = () => {
    if (!keyResultId) {
      Toast({
        message: "Please save the Key Result before adding comments",
        type: "warning",
        time: 3000,
      });
      return;
    }
    setShowCommentPopup(true);
  };

  const initialFormData = {
    krName: "",
    source: "",
    status: "",
    kpiName: "",
    kpiId: "",
    query: "",
    unit: "",
    polarity: "positive",
    targetResult: "",
    actualResult: "",
    targetDate: "",
    completionDate: "",
    file: "",
    comments: "",
    weight: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isApproved, setIsApproved] = useState("");
  const [objectiveIsApproved, setObjectiveIsApproved] = useState("");
  const [isAlignedToCompany, setIsAlignedToCompany] = useState("No");

  const companyId = JSON.parse(localStorage.getItem("companyId") || '""');
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const authEmail = user?.email || AuthEmail || "";

  // Load Salesforce KPIs when Salesforce is chosen as source
  const { data: listOfKpis } = useQuery({
    queryKey: ["salesforce-kpis", formData.source],
    queryFn: () => getKPIs(true),
    enabled: formData.source === "salesforce",
  });

  // Load Jira issues when Jira is chosen as source (pass authEmail for Jira API, assignee from objective)
  const { data: jiraIssuesData, isLoading: jiraIssuesLoading } = useQuery({
    queryKey: ["jira-issues", formData.source, objectiveId, authEmail],
    queryFn: () => getJiraIssues({ objectiveId, companyId, authEmail }),
    enabled: formData.source === "jira" && !!objectiveId,
    retry: false,
    onError: (err) => {
      const msg = err?.data?.message || err?.message || "Failed to load Jira issues";
      if (formData.source === "jira") {
        Toast({ message: msg, type: "error", time: 4000 });
      }
    },
  });
  const jiraIssues = Array.isArray(jiraIssuesData) ? jiraIssuesData : (jiraIssuesData?.data || []);

  // Fetch Jira tasks when story is selected or importTasks is toggled
  useEffect(() => {
    const fetchTasks = async () => {
      if (formData.source === "jira" && formData.kpiId && importTasks) {
        setLoadingTasks(true);
        try {
          const params = {
            storyKey: formData.kpiId,
            authEmail,
            companyId,
          };
          const data = await getJiraTasks(params);
          console.log("Jira tasks data:", data);
          if (data?.length > 0) {
            setJiraTasks(data || []);
          }
        } catch (err) {
          console.error("Failed to fetch Jira tasks:", err);
          Toast({ message: "Failed to load Jira tasks", type: "error" });
        } finally {
          setLoadingTasks(false);
        }
      } else if (!importTasks) {
        setJiraTasks([]);
      }
    };

    fetchTasks();
  }, [formData.source, formData.kpiId, importTasks, authEmail, companyId]);

  // Execute SOQL query against Salesforce
  const testQueryMutation = useMutation({
    mutationFn: (query) => querySalesforce({ query }),
    onSuccess: (data) => {
      if (
        Array.isArray(data?.data) &&
        data.data.length > 0 &&
        data.data[0]?.message === "INVALID_JWT_FORMAT"
      ) {
        Toast({
          message: "Your Salesforce session has expired. Please sign in again.",
          type: "error",
        });
        localStorage.removeItem("sf_access_token");
        localStorage.removeItem("sf_refresh_token");
        localStorage.removeItem("salesforce_user");
        history.push("/admin/previlages/integrationManagement/salesforce/setup");
        return;
      }
      const count = data?.data?.totalSize ?? 0;
      setFormData((prev) => ({ ...prev, actualResult: String(count) }));
    },
    onError: () => {
      Toast({ message: "Failed to fetch KPI value from Salesforce", type: "error" });
    },
  });

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

  // Helper function to show animation
  const showCompletionAnimation = () => {
    if (!gifShownRef.current) {
      gifShownRef.current = true;
      setShowGif(true);
      setRewardPoints(15);
      setTimeout(() => {
        setShowGif(false);
        setRewardPoints(0);
        gifShownRef.current = false;
      }, 5000);
    }
  };

  // Cloudinary upload function (same as ObjectiveForm)
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
            if (
              percent === 25 ||
              percent === 50 ||
              percent === 75 ||
              percent === 100
            ) {
              Toast({
                message: `Uploaded ${percent}%`,
                type: "success",
                time: 500,
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
        time: 2000,
      });

      return fileUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      Toast({
        message: "Upload failed. Please try again.",
        type: "error",
        time: 3000,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Effect to fetch data if keyResultId exists
  useEffect(() => {
    if (keyResultId) {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const runSyncThenFetch = async () => {
        try {
          await syncJiraStatuses({ companyId, authEmail });
        } catch (err) {
          console.warn("Jira sync on edit page failed (non-blocking):", err?.message || err);
        }
        return dispatch(getKeyResultSingle(keyResultId, user.role));
      };
      runSyncThenFetch()
        .then(({ data }) => {
          if (data && data[0]) {
            console.log("API Response:", data[0]); // Debug log
            setFormData((prev) => ({
              ...prev,
              krName: data[0].keyResultName || data[0].okrName || "",
              source: data[0].source || "",
              status: data[0].status || "",
              kpiName: data[0].kpiName || "",
              kpiId: data[0].kpiId || "",
              unit: data[0].unit || data[0].uom || "",
              polarity: data[0].polarity || "positive",
              targetResult: data[0].target || 0,
              actualResult: data[0].actual || 0,
              targetDate: data[0].targetDate
                ? formatDateForInput(data[0].targetDate)
                : "",
              completionDate:
                data[0].actualDate || data[0].completionDate
                  ? formatDateForInput(
                    data[0].actualDate || data[0].completionDate
                  )
                  : "",
              file: data[0].feedAttachment || data[0].file || null,
              comments: data[0].comments || "",
              weight: data[0].weight !== undefined ? String(data[0].weight) : "",
            }));

            // Set uploaded file URL if exists
            if (data[0].feedAttachment) {
              setUploadedFileUrl(data[0].feedAttachment);
            }

            // Set isGifShown based on the data from API
            setIsGifShown(data[0].isGifShown || false);

            // Set approval status for key result and parent objective
            setIsApproved(data[0].isApproved || "");
            setObjectiveIsApproved(data[0].objectiveIsApproved || "");
            setIsAlignedToCompany(data[0].isAlignedToCompany === "Yes" ? "Yes" : "No");
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [keyResultId, dispatch, companyId, authEmail]);

  // Validate form
  useEffect(() => {
    const isValid =
      formData.krName.trim() !== "" &&
      objectiveId &&
      formData.status !== "" &&
      (formData.source === "" || formData.kpiName !== "") &&
      !isNaN(Number(formData.targetResult)) &&
      formData.targetResult !== "" &&
      formData.targetDate !== "";
    setIsFormValid(isValid);
    setStepperDisabled(!isValid);
  }, [formData, objectiveId]);

  // Removed the useEffect that was triggering animation on every change
  // Animation will only be shown during form submission

  const handleInputChange = (field, value) => {
    // Reset KPI-related fields when switching source
    if (field === "source") {
      setFormData((prev) => ({
        ...prev,
        source: value,
        kpiName: "",
        kpiId: "",
        query: "",
        actualResult: "",
      }));
      return;
    }

    // Handle Salesforce KPI selection
    if (field === "kpiName" && formData.source === "salesforce" && value) {
      const sfToken = localStorage.getItem("sf_access_token");
      if (!sfToken) {
        Toast({ message: "Please connect Salesforce to use KPIs", type: "warning" });
        history.push("/admin/previlages/integrationManagement/salesforce/setup");
        return;
      }
      const kpiObject = listOfKpis?.data?.find((k) => k._id === value);
      if (kpiObject) {
        setFormData((prev) => ({
          ...prev,
          kpiName: value,
          kpiId: kpiObject._id,
          query: kpiObject.query || "",
          krName: kpiObject.name || prev.krName,
        }));
        if (kpiObject.query) {
          testQueryMutation.mutate(kpiObject.query);
        }
        return;
      }
    }

    // Handle Jira issue selection - value is issue key, store in kpiId
    if (field === "kpiName" && formData.source === "jira" && value) {
      const issue = jiraIssues.find((i) => i.key === value);
      if (issue) {
        setFormData((prev) => ({
          ...prev,
          kpiName: issue.label,
          kpiId: issue.key,
          krName: issue.label || prev.krName,
        }));
        return;
      }
    }

    // Non-Salesforce/Non-Jira KPI selection keeps previous behavior
    if (field === "kpiName" && formData.source !== "salesforce" && formData.source !== "jira" && value) {
      const selectedKpi = KPIOPTIONS.find((kpi) => kpi.value === value);
      if (selectedKpi) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          krName: selectedKpi.label,
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCommentPopUp = (data) => {
    console.log("Comment submitted:", data.comment);
    setShowCommentPopup(false);
  };

  const handleSave = async () => {
    if (!formData.krName.trim()) {
      setError("Key Result Name is required");
      return;
    }

    if (!objectiveId) {
      setError("Objective ID is required");
      return;
    }

    const targetValue = Number(formData.targetResult);
    if (isNaN(targetValue)) {
      setError("Target must be a valid number");
      return;
    }

    const actualValue = formData.actualResult
      ? Number(formData.actualResult)
      : 0;
    if (formData.actualResult && isNaN(actualValue)) {
      setError("Actual must be a valid number");
      return;
    }

    if (!formData.targetDate) {
      setError("Target Date is required");
      return;
    }

    // Validate KR weight: sum across all objectives for this user/company must not exceed 100
    const newWeight = Number(formData.weight) || 0;
    if (newWeight > 0) {
      try {
        const token = user?.token || localStorage.getItem("authToken");
        const krResponse = await axios.get(`${appURL}/keyresults/getKeyResults/${user._id}/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5000, page: 0 },
        });
        const existingTotal = (krResponse?.data?.data || []).reduce((sum, kr) => {
          if (isEdit && String(kr._id) === String(keyResultId)) return sum;
          return sum + (Number(kr.weight) || 0);
        }, 0);
        if (existingTotal + newWeight > 100) {
          const remaining = 100 - existingTotal;
          Toast({
            type: "warning",
            message: `Total KR weight across all objectives cannot exceed 100%. You can add up to ${remaining}% more.`,
            time: 5000,
          });
          return;
        }
      } catch (weightErr) {
        // Validation call failed — backend will enforce the weight limit
        console.warn("Frontend KR weight validation skipped:", weightErr?.message);
      }
    }

    setLoading(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("user")) || {};

    // Calculate dynamic reward points and get approval status based on user eligibility
    const rewardConfig = getKRRewardPoints({
      userId: user._id,
      rewardSchemes,
      privilegeGroups,
    });
    const dynamicRewardPoints = rewardConfig?.points || 0;
    const approvalRequired = rewardConfig?.approvalRequired || false;

    // Determine if GIF should be shown (first time completion)
    const shouldShowGif = isEdit && !isGifShown && targetValue > 0 && actualValue > 0 && targetValue <= actualValue && dynamicRewardPoints > 0;

    const payload = {
      keyResultName: formData.krName,
      okrName: formData.krName, // Added this to fix the validation error
      source: formData.source,
      polarity: formData.polarity,
      target: targetValue, // Use the target value from form input
      targetDate: parseDateFromInput(formData.targetDate),
      actual: actualValue, // Use the actual value from form input
      actualDate: formData.completionDate
        ? parseDateFromInput(formData.completionDate)
        : null,
      file: formData.file?.name || formData.file,
      feedAttachment: uploadedFileUrl || "", // Add the uploaded file URL
      objectiveId,
      userId: user._id,
      status: formData.status,
      kpiName:
        formData.source === "salesforce"
          ? (listOfKpis?.data?.find((k) => k._id === formData.kpiName)?.name || "")
          : formData.source === "jira"
            ? formData.kpiName
            : formData.kpiName,
      kpiId: formData.source === "salesforce" ? formData.kpiId : formData.source === "jira" ? formData.kpiId : undefined,
      query: formData.source === "salesforce" ? formData.query : undefined,
      unit: formData.unit,
      comments: formData.comments,
      isGifShown: shouldShowGif ? true : (isEdit ? isGifShown : false), // Mark as shown if animation will play
      dynamicRewardPoints: dynamicRewardPoints,
      approvalRequired: approvalRequired,
      isAlignedToCompany: isEdit ? isAlignedToCompany : "No",
      jiraKey: formData.source === "jira" ? formData.kpiId : undefined,
      jiraStatus: formData.source === "jira" ? (jiraIssues?.find(i => i.key === formData.kpiId)?.status || "") : undefined,
      companyId: companyId,
      weight: Number(formData.weight) || 0,
    };

    const action =
      isEdit && keyResultId
        ? dispatch(updatekeyResult(keyResultId, payload))
        : dispatch(createkeyResult(payload));

    action
      .then(async ({ success, data }) => {
        if (success) {
          // If Jira tasks were imported, create them now
          if (formData.source === "jira" && importTasks && jiraTasks.length > 0) {
            const krId = data._id;
            const taskPromises = jiraTasks.map(task => {
              const taskPayload = {
                title: task.summary,
                description: task.description || "",
                status: "notstarted",
                priority: task.priority?.toLowerCase() === "highest" ? "High Level" : (task.priority?.toLowerCase() === "lowest" ? "Low Level" : "Medium Level"),
                krReferenceId: krId,
                linkToKR: krId,
                linkToKr: krId,
                objectiveReferenceId: objectiveId,
                companyId,
                userId: user._id,
                assignTo: [user._id], // Default assign to creator
                startDate: new Date().toISOString().split('T')[0],
                dueDate: formData.targetDate ? formData.targetDate.split('T')[0] : new Date().toISOString().split('T')[0],
                progressStatus: 0,
                recurrence: false,
                mainTask: null,
                dynamicRewardPoints: 0,
                approvalRequired: false,
                jiraKey: task.key,
                jiraStatus: task.jiraStatus,
              };
              return api({
                ...tasksApi.createTask,
                body: taskPayload
              });
            });

            try {
              await Promise.all(taskPromises);
              Toast({ message: `${jiraTasks.length} tasks imported successfully`, type: "success" });
            } catch (taskErr) {
              console.error("Failed to import tasks:", taskErr);
              Toast({ message: "Key Result created, but some tasks failed to import", type: "warning" });
            }
          }

          // Check if we came from reviews
          const fromReviews = urlParams.get("fromReviews") === "true";

          // Get reward points from API response
          const apiRewardPoints = data.rewardPoints || data.dynamicRewardPoints || 0;

          console.log("Key Result save success - Animation check:", {
            shouldShowGif,
            apiRewardPoints,
            isGifShown,
            isEdit
          });

          // Show animation only on first time completion (shouldShowGif was determined before API call)
          if (shouldShowGif && apiRewardPoints > 0) {
            if (!gifShownRef.current) {
              gifShownRef.current = true;

              console.log("Showing reward animation with points from API:", apiRewardPoints);
              setShowGif(true);
              setRewardPoints(apiRewardPoints); // Use reward points from API response
              setIsGifShown(true); // Mark as shown immediately
              setTimeout(() => {
                setShowGif(false);
                setRewardPoints(0);
                gifShownRef.current = false;
                // Redirect after animation completes
                setTimeout(() => {
                  if (fromReviews) {
                    history.push("/admin/reviews");
                  } else {
                    history.goBack();
                  }
                }, 1000); // Small delay after animation ends
              }, 5000);
            }
          } else {
            // If no animation, redirect immediately
            if (isEdit) {
              if (fromReviews) {
                history.push("/admin/reviews");
              } else {
                history.goBack();
              }
            } else {
              setSavedKeyResultId(data._id);
              setFormData(initialFormData); // Reset form to allow adding another
              setUploadedFileUrl(""); // Reset uploaded file URL
            }
          }
        } else {
          setError("Operation failed");
        }
      })
      .catch((err) => setError(err.message || "An error occurred"))
      .finally(() => setLoading(false));
  };

  const handleBackClick = () => {
    // Check if we came from reviews
    const fromReviews = urlParams.get("fromReviews") === "true";

    // Navigate back to reviews if we came from there, otherwise go to objectives
    if (fromReviews) {
      history.push("/admin/reviews");
    } else {
      history.push(
        `/admin/objectives/objective${isEdit ? `?isEdit=true` : ""}${isEdit ? "&" : "?"
        }${objectiveId ? `objectiveId=${objectiveId}` : ""}`
      );
    }
  };

  const handleFileChange = useCallback(async (file) => {
    if (file?.file) {
      const fileUrl = await handleUploadToCloudinary(file.file);
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, file: file.name }));
      }
    }
  }, []);

  const handleStepClick = (stepIndex) => {
    if (stepperDisabled) return;

    setActiveStep(stepIndex);
    const paths = [
      "/admin/objectives/objective",
      `/admin/objectives/details?${isEdit ? "isEdit=true" : ""
      }&objectiveId=${objectiveId}`,
      `/admin/objectives/task?${isEdit ? "isEdit=true" : ""
      }&objectiveId=${objectiveId}&keyResultId=${keyResultId}`,
    ];
    if (paths[stepIndex]) history.push(paths[stepIndex]);
  };

  return (
    <Box sx={{ padding: "0 20px" }}>
      <div className={showGif ? "gif" : "dgif"}>
        <img
          src={LottieConfettie}
          className={"lottie-img"}
          alt="LottieConfettie"
        />
        <br />
        <h3>
          {t("ObjectiveForm.EarnedRewardPoints", { points: rewardPoints })}
        </h3>
      </div>

      <Box
        mt={"20px"}
        sx={{
          width: "100%",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={handleStepClick}
          disabled={stepperDisabled}
        />
      </Box>

      <Box
        sx={{
          borderRadius: "20px",
          marginTop: "20px",
          padding: "24px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            margin: isMobile ? "0.1rem" : "0 2rem",
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
            tabindex={0}
              onClick={handleBackClick}
              sx={{ fontSize: 30, color: "#000", cursor: "pointer" }}
            />
            {isEdit
              ? t("KeyResultForm.EditKeyResult")
              : t("KeyResultForm.AddKeyResult")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Chart & Description */}
          {isEdit && (
            <Box mb={4}>
              <Typography variant="body1" color="textSecondary">
                {t("KeyResultForm.OKRName")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formData.krName}
              </Typography>
            </Box>
          )}

          <Box mb={4}>
            {/* Aligned to Company - only set when cascading; manual key results use "No" */}
            <BellCurveChart
              target={Number(formData.targetResult) || 0}
              actual={Number(formData.actualResult) || 0}
              polarity={formData.polarity}
            />
            <Box sx={{ borderBottom: "1px solid #BEA881", my: 3 }} />
          </Box>

          <Typography variant="h5" fontWeight={700} mb={2}>
            {isEdit
              ? t("KeyResultForm.EditKeyResult")
              : t("KeyResultForm.AddKeyResult")}
          </Typography>

          <Box mb={3}>
            <Typography component="label">
              {t("KeyResultForm.FormLabels.KeyResultName")}
            </Typography>
            <InputTextComponent
              value={formData.krName}
              onChange={(e) => handleInputChange("krName", e.target.value)}
              fullWidth
              disabled={loading}
              error={!formData.krName.trim()}
              helperText={
                !formData.krName.trim() ? "This field is required" : ""
              }
            />
          </Box>

          <Box mb={3}>
            <Typography component="label">
              {t("KeyResultForm.FormLabels.Weight") || "Weight (%)"}
            </Typography>
            <InputTextComponent
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              fullWidth
              type="number"
              disabled={loading}
              placeholder="Enter weight (0-100)"
            />
          </Box>

          {isTalentSpotify() && (
            <Box mb={3}>
              <Typography component="label">
                {t("KeyResultForm.FormLabels.Source")}
              </Typography>
              <SelectComponent
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                options={SOURCEOPTIONS}
                fullWidth
                disabled={loading}
              />
            </Box>
          )}

          {formData.source && (
            <Box mb={3}>
              <Typography component="label">
                {formData.source === "jira"
                  ? t("KeyResultForm.FormLabels.Stories")
                  : t("KeyResultForm.FormLabels.KPIs")}
              </Typography>
              <SelectComponent
                value={formData.source === "jira" ? formData.kpiId : formData.kpiName}
                onChange={(e) => handleInputChange("kpiName", e.target.value)}
                options={
                  formData.source === "salesforce"
                    ? (listOfKpis?.data || []).map((k) => ({ label: k.name, value: k._id }))
                    : formData.source === "jira"
                      ? (() => {
                        const options = jiraIssues.map((i) => ({ label: i.label, value: i.key }));
                        if (isEdit && formData.kpiId && !options.some((o) => o.value === formData.kpiId)) {
                          options.unshift({
                            label: formData.kpiName || formData.kpiId,
                            value: formData.kpiId,
                          });
                        }
                        return options;
                      })()
                      : KPIOPTIONS
                }
                fullWidth
                disabled={loading || (formData.source === "jira" && jiraIssuesLoading)}
                error={!formData.kpiName && !formData.kpiId}
                helperText={
                  !formData.kpiName && !formData.kpiId ? "This field is required" : ""
                }
              />
            </Box>
          )}

          {formData.source === "jira" && formData.kpiId && (
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={importTasks}
                    onChange={(e) => setImportTasks(e.target.checked)}
                    sx={{
                      color: "#73712A",
                      "&.Mui-checked": {
                        color: "#73712A",
                      },
                    }}
                  />
                }
                label={t("KeyResultForm.FormLabels.ImportTasks") || "Import Tasks"}
              />
              {importTasks && (
                <Box sx={{ ml: 4, mt: -1 }}>
                  {loadingTasks ? (
                    <CircularProgress size={20} />
                  ) : (
                    jiraTasks.length > 0 ? (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#73712A",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontWeight: 500
                        }}
                        onClick={() => setShowTasksPopup(true)}
                      >
                        {jiraTasks.length} {t("KeyResultForm.Messages.Tasks") || "tasks"}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No tasks found in this story
                      </Typography>
                    )
                  )}
                </Box>
              )}
            </Box>
          )}

          <Box
            display="flex"
            gap={3}
            mb={3}
            flexDirection={{
              xs: "column", // Mobile - all fields in column
              sm: "row", // Tablet and up - horizontal layout
            }}
          >
            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.Status")}
              </Typography>
              <SelectComponent
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                options={STATUSOPTIONS}
                fullWidth
                disabled={loading}
                error={!formData.status}
                helperText={!formData.status ? "This field is required" : ""}
              />
            </Box>

            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.UnitOfMeasurement")}
              </Typography>
              <SelectComponent
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                options={UNITOPTIONS}
                fullWidth
                disabled={loading}
              />
            </Box>

            {/* Polarity field - only shows on tablet and desktop, hidden on mobile in this row */}
            <Box
              flex={1}
              sx={{
                display: {
                  xs: "none", // Hidden on mobile
                  sm: "block", // Visible on tablet and desktop
                },
              }}
            >
              <Typography
                component="label"
                sx={{
                  mb: 2,
                  fontSize: {
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.Polarity")}
              </Typography>
              <RadioGroup
                row
                value={formData.polarity}
                onChange={(e) => handleInputChange("polarity", e.target.value)}
                sx={{
                  gap: {
                    sm: 2, // Tablet
                    md: 3, // Desktop
                  },
                }}
              >
                <FormControlLabel
                  value="positive"
                  control={<Radio />}
                  label={t("KeyResultForm.Polarity.Positive")}
                  disabled={loading}
                  sx={{
                    fontSize: {
                      sm: "0.9rem", // Tablet
                      md: "1rem", // Desktop
                    },
                  }}
                />
                <FormControlLabel
                  value="negative"
                  control={<Radio />}
                  label={t("KeyResultForm.Polarity.Negative")}
                  disabled={loading}
                  sx={{
                    fontSize: {
                      sm: "0.9rem", // Tablet
                      md: "1rem", // Desktop
                    },
                  }}
                />
              </RadioGroup>
            </Box>
          </Box>

          {/* Polarity field for mobile - shows only on mobile */}
          <Box
            sx={{
              display: {
                xs: "block", // Visible on mobile
                sm: "none", // Hidden on tablet and desktop
              },
              marginBottom: 3,
            }}
          >
            <Typography
              component="label"
              sx={{
                mb: 2,
                fontSize: "0.875rem", // Mobile
                fontWeight: 500,
                display: "block",
              }}
            >
              {t("KeyResultForm.FormLabels.Polarity")}
            </Typography>
            <RadioGroup
              row
              value={formData.polarity}
              onChange={(e) => handleInputChange("polarity", e.target.value)}
              sx={{
                gap: 2, // Mobile spacing
              }}
            >
              <FormControlLabel
                value="positive"
                control={<Radio />}
                label={t("KeyResultForm.Polarity.Positive")}
                disabled={loading}
                sx={{
                  fontSize: "0.875rem", // Mobile
                }}
              />
              <FormControlLabel
                value="negative"
                control={<Radio />}
                label={t("KeyResultForm.Polarity.Negative")}
                disabled={loading}
                sx={{
                  fontSize: "0.875rem", // Mobile
                }}
              />
            </RadioGroup>
          </Box>

          <Box
            display="flex"
            gap={3}
            mb={3}
            flexDirection={{
              xs: "column", // Mobile - stack vertically
              sm: "row", // Tablet and up - horizontal
            }}
          >
            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.TargetResult")}
              </Typography>
              <InputTextComponent
                type="text"
                value={formData.targetResult}
                onChange={(e) =>
                  handleInputChange("targetResult", e.target.value)
                }
                id="krallowZero"
                fullWidth
                disabled={loading || isApproved === "approved" || objectiveIsApproved === "approved"}
                error={
                  formData.targetResult === "" || isNaN(Number(formData.targetResult))
                }
                helperText={
                  (isApproved === "approved" || objectiveIsApproved === "approved")
                    ? t("KeyResultForm.Messages.FieldLocked") || "This field is locked (approved). Contact manager to unlock."
                    : formData.targetResult === "" || isNaN(Number(formData.targetResult))
                      ? "Valid number is required"
                      : ""
                }
              />
            </Box>
            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.ActualResult")}
              </Typography>
              <InputTextComponent
                type="text"
                value={formData.actualResult}
                id="krallowZero"
                onChange={(e) =>
                  handleInputChange("actualResult", e.target.value)
                }
                fullWidth
                disabled={loading}
                error={
                  formData.actualResult && isNaN(Number(formData.actualResult))
                }
                helperText={
                  formData.actualResult && isNaN(Number(formData.actualResult))
                    ? "Valid number is required"
                    : ""
                }
              />
            </Box>
          </Box>

          <Box
            display="flex"
            gap={3}
            mb={3}
            flexDirection={{
              xs: "column", // Mobile - stack vertically
              sm: "row", // Tablet and up - horizontal
            }}
          >
            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.TargetDate")}
              </Typography>
              <InputTextComponent
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange("targetDate", e.target.value)
                }
                fullWidth
                disabled={loading || isApproved === "approved" || objectiveIsApproved === "approved"}
                error={!formData.targetDate && isApproved !== "approved" && objectiveIsApproved !== "approved"}
                helperText={
                  (isApproved === "approved" || objectiveIsApproved === "approved")
                    ? t("KeyResultForm.Messages.FieldLocked") || "This field is locked (approved). Contact manager to unlock."
                    : !formData.targetDate
                      ? "This field is required"
                      : ""
                }
              />
            </Box>

            <Box flex={1}>
              <Typography
                component="label"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // Mobile
                    sm: "0.9rem", // Tablet
                    md: "1rem", // Desktop
                  },
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                }}
              >
                {t("KeyResultForm.FormLabels.CompletionDate")}
              </Typography>
              <InputTextComponent
                type="date"
                value={formData.completionDate}
                onChange={(e) =>
                  handleInputChange("completionDate", e.target.value)
                }
                fullWidth
                disabled={loading}
              />
            </Box>

            {isEdit && (
              <Box
                flex={1}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: {
                    xs: "center", // Mobile - center
                    sm: "flex-start", // Tablet and up - left align
                  },
                }}
              >
                <Button
                  sx={{
                    fontWeight: 500,
                    fontFamily: "Work Sans",
                    fontSize: {
                      xs: "0.875rem", // Mobile
                      sm: "0.9rem", // Tablet
                      md: "14px", // Desktop
                    },
                    color: "#333333",
                    "&:hover": {
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                  onClick={handleCommentPopup}
                >
                  {t("KeyResultForm.FormLabels.Comment")}
                </Button>
              </Box>
            )}
          </Box>

          <Box mt={2} mb={3}>
            <Typography fontWeight={500} fontSize={16}>
              {t("KeyResultForm.FormLabels.UploadFile")}
              {uploading && (
                <Typography component="span" sx={{ ml: 1, color: "#1976d2" }}>
                  {t("KeyResultForm.FileUpload.Uploading")}
                </Typography>
              )}
              {uploadedFileUrl && !uploading && (
                <Typography component="span" sx={{ ml: 1, color: "#4CAF50" }}>
                  {t("KeyResultForm.FileUpload.FileUploaded")}
                </Typography>
              )}
            </Typography>
            <FileUpload
              id="kr-upload"
              link={uploadedFileUrl}
              value={formData.file}
              onFileUpload={handleFileChange}
              disabled={loading || uploading}
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
              onClick={handleSave}
              disabled={!isFormValid || loading || uploading}
              sx={{
                color: "#73712A",
                borderColor: "#73712A",
                borderRadius: "30px",
                padding: isMobile
                  ? "16px 24px"
                  : isTablet
                    ? "14px 28px"
                    : "12px 30px",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
                minWidth: isMobile ? "100%" : "auto",
                "&:disabled": { opacity: 0.7 },
              }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading
                ? t("KeyResultForm.Buttons.Saving")
                : isEdit
                  ? t("KeyResultForm.Buttons.UpdateDetails")
                  : t("KeyResultForm.Buttons.SaveAndAddAnother")}
            </Button>

            {!isEdit && (
              <Button
                variant="contained"
                onClick={() =>
                  history.push(
                    `/admin/objectives/task?objectiveId=${objectiveId}&keyResultId=${savedKeyResultId}`
                  )
                }
                disabled={loading || !savedKeyResultId || uploading}
                sx={{
                  backgroundColor: "#73712A",
                  borderRadius: "30px",
                  padding: isMobile
                    ? "16px 24px"
                    : isTablet
                      ? "14px 28px"
                      : "12px 30px",
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                  minWidth: isMobile ? "100%" : "auto",
                  "&:disabled": { opacity: 0.7 },
                  "&:hover": { backgroundColor: "#5a581f" },
                }}
              >
                {t("KeyResultForm.Buttons.NextAddTask")}
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <CommentPopup
        show={showCommentPopup}
        onHide={() => setShowCommentPopup(false)}
        krReferenceId={keyResultId} // Use the existing keyResultId
        data={{ title: formData.krName }} // Pass the key result name as title
      />

      {/* Jira Tasks Popup */}
      <Dialog
        open={showTasksPopup}
        onClose={() => setShowTasksPopup(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#73712A" }}>
          {t("KeyResultForm.Popups.ImportedTasks") || "Imported Tasks"}
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {jiraTasks.map((task, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={<Typography fontWeight={600}>{task.summary}</Typography>}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="#73712A" fontWeight={500}>
                        {task.key} — {task.priority}
                      </Typography>
                      {task.description && (
                        <Typography variant="body2" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                          {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setShowTasksPopup(false)}
            sx={{
              color: "#73712A",
              borderColor: "#73712A",
              borderRadius: "30px",
              fontWeight: "bold",
              padding: "8px 20px"
            }}
            variant="outlined"
          >
            {t("Common.Close") || "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
