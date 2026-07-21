import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Checkbox,
  InputLabel,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { createTask, getTasksById, updateTask, getTasks } from "action/TasksAct";
import { getKeyResults } from "action/keyResultAct";
import { getEmployees } from "action/EmployeeAct";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import { useHistory } from "react-router-dom";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { Toast } from "service/toast";
import  FileUpload  from 'pages/vihanga/components/filesUplode/draganddropFile';
import Progress from "../../components/pages/Progress";
import axios from "axios";
import { appURL } from "utilities";
import { createComment, getAllCommentsByReferenceId } from "action/TasksCommentsAct";

// Placeholder Recurrence component (replace with actual implementation)
const Recurrence = ({ open, setOpen, setRecurrenceDetails }) => {
  const [details, setDetails] = useState("");

  const handleSave = () => {
    try {
      // Validate as JSON or specific format if required
      JSON.parse(details);
      setRecurrenceDetails(details);
      setOpen(false);
    } catch {
      // Toast({ type: "error", message: "Invalid recurrence details format", time: 3000 });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Recurrence Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Recurrence Details (JSON)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          fullWidth
          multiline
          rows={4}
          placeholder='e.g., {"type": "daily", "interval": 1}'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const AddTaskForm = ({  onClose }) => {

  const { propTaskId,subTaskId,fromTask } = useParams();
 

  
  const isEdit= Boolean(propTaskId);

  const isSubTask = Boolean(subTaskId);
  
  console.log("taskId--- and edit ", propTaskId,isEdit);
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [showGif, setShowGif] = useState(false);
  const [openRecurrence, setOpenRecurrence] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [commentsHistory, setCommentsHistory] = useState([]);
  const [formData, setFormData] = useState(() => {
    const user = getItemFromLocalStorage("userData") || {};
    const savedData = JSON.parse(sessionStorage.getItem("taskFormData")) || {};
    return {
      title: savedData.title || "",
      description: savedData.description || "",
      startDate: savedData.startDate || "",
      dueDate: savedData.dueDate || "",
      actualCompletionDate: savedData.actualCompletionDate || "",
      assignTo: savedData.assignTo || user?.ownerId || "",
      priority: savedData.priority || "",
      status: savedData.status || "notstarted",
      progress: savedData.progress || 0,
      mainTask: isSubTask ? subTaskId : savedData.mainTask || "",
      comments:  savedData.comments || "",
      recurrence: savedData.recurrence || false,
      recurrenceDetails: savedData.recurrenceDetails || "",
      file: savedData.file || null,
    };
  });

  const userId = getItemFromLocalStorage("user")?._id || null;
  const companyId = getItemFromLocalStorage("companyId");

  const fetchCommentsForTask = useCallback(
    async (referenceId) => {
      if (!referenceId) {
        setCommentsHistory([]);
        return;
      }
      try {
        const result = await dispatch(getAllCommentsByReferenceId(referenceId));
        if (result?.data) {
          const sortedComments = [...result.data].sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt || 0) -
              new Date(a.updatedAt || a.createdAt || 0)
          );
          setCommentsHistory(sortedComments);
        } else {
          setCommentsHistory([]);
        }
      } catch (error) {
        setCommentsHistory([]);
      }
    },
    [dispatch]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = {
      title: "Task title is required",
      description: "Task description is required",
      startDate: "Start date is required",
      dueDate: "Due date is required",
      assignTo: "Assignee is required",
      priority: "Priority is required",
      status: "Status is required",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = message;
      }
    });

    if (formData.startDate && !isValidDate(formData.startDate)) {
      newErrors.startDate = "Invalid start date format";
    }

    if (formData.dueDate && !isValidDate(formData.dueDate)) {
      newErrors.dueDate = "Invalid due date format";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      isValidDate(formData.startDate) &&
      isValidDate(formData.dueDate) &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "Due date must be after start date";
    }

    if (formData.actualCompletionDate && !isValidDate(formData.actualCompletionDate)) {
      newErrors.actualCompletionDate = "Invalid completion date format";
    }

    if (formData.recurrence && !formData.recurrenceDetails) {
      newErrors.recurrenceDetails = "Recurrence details are required";
    }

    if (formData.recurrence && formData.recurrenceDetails) {
      try {
        JSON.parse(formData.recurrenceDetails);
      } catch {
        newErrors.recurrenceDetails = "Invalid recurrence details format (must be JSON)";
      }
    }

    if (formData.file && formData.file.size > 5 * 1024 * 1024) {
      newErrors.file = "File size must be less than 5MB";
    }

    if (formData.file && !["application/pdf", "image/jpeg", "image/png"].includes(formData.file.type)) {
      newErrors.file = "File must be a PDF, JPEG, or PNG";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValidDate = (dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
  };

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [employeesRes, tasksRes] = await Promise.all([
        dispatch(getEmployees()),
        dispatch(getTasks()),
      ]);

      if (employeesRes.data) {
        const employeeOptions = employeesRes.data.map((item) => ({
          value: item._id,
          label: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
        }));
        setEmployees([...new Set(employeeOptions.map(JSON.stringify))].map(JSON.parse));
      } else {
        throw new Error("Failed to fetch employees");
      }

      if (tasksRes.data) {
        setTasks([
          { value: "", label: "--Default--" },
          ...tasksRes.data.map((item) => ({
            value: item._id,
            label: item.title,
          })),
        ]);
      } else {
        throw new Error("Failed to fetch tasks");
      }

      if (propTaskId && isEdit) {
        const taskRes = await axios.get(`${appURL}/tasks2/getTasksById/${propTaskId}`);
        if (taskRes.data.success && taskRes.data.data) {
          const taskData = taskRes.data.data;
          setFormData({
            title: taskData.title || "",
            description: taskData.description || "",
            startDate: taskData.startDate ? taskData.startDate.split("T")[0] : "",
            dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
            actualCompletionDate: taskData.actualCompletionDate
              ? taskData.actualCompletionDate.split("T")[0]
              : "",
            assignTo: taskData.assignTo?.[0] || "",
            priority: taskData.priority || "",
            status: taskData.status || "notstarted",
            progress: taskData.progressStatus || 0,
            mainTask: isSubTask ? subTaskId : taskData.mainTask || "",
            comments: "",
            recurrence: taskData.recurrence || false,
            recurrenceDetails: taskData.recurrenceDetails || "",
            file: taskData.attachments?.[0] || null,
          });
          fetchCommentsForTask(propTaskId);
        } else {
          throw new Error("Failed to fetch task data");
        }
      }
      
    } catch (err) {
      setErrorMessage(err.message || "Failed to fetch data");
      Toast({ type: "error", message: err.message || "Failed to fetch data", time: 3000 });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, propTaskId, isEdit, fetchCommentsForTask]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsFormDirty(true);
    sessionStorage.setItem("taskFormData", JSON.stringify({ ...formData, [field]: value }));
  }, [formData]);

  const handleFileChange = useCallback((file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size must be less than 5MB" }));
        return;
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({ ...prev, file: "File must be a PDF, JPEG, or PNG" }));
        return;
      }
    }
    handleChange("file", file);
    Toast({ type: "success", message: `File ${file?.name || "removed"} successfully`, time: 2000 });
  }, [handleChange]);

  const handleRecurrenceChange = (event) => {
    const checked = event.target.checked;
    setOpenRecurrence(checked);
    handleChange("recurrence", checked);
    if (!checked) {
      handleChange("recurrenceDetails", "");
    }
  };


  

  const handleSubmit = async (addAnother = false) => {
    // if (!validateForm()) {
    //   Toast({ type: "error", message: "Please fix form errors", time: 3000 });
    //   return;
    // }
  
    setIsLoading(true);
    setErrorMessage(null);
  
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        actualCompletionDate: formData.actualCompletionDate || null,
        assignTo: Array.isArray(formData.assignTo) ? formData.assignTo : [formData.assignTo],
        priority: formData.priority,
        status: formData.status,
        comments: formData.comments || "",
        recurrence: formData.recurrence,
        recurrenceDetails: formData.recurrenceDetails || "",
        progressStatus: isNaN(Number(formData.progress)) ? 0 : Number(formData.progress),
        mainTask: isSubTask ? subTaskId: formData.mainTask || "",
        companyId: companyId,
        userId: userId,
      };
  
      // File Upload Logic — Optional
      if (formData.file) {
        // Example: Upload the file and get URL
        // const fileUploadResponse = await uploadFile(formData.file);
        // payload.fileUrl = fileUploadResponse.url;
      }
  
      console.log("Payload for task submission:", payload);
  
      const response = isEdit
      ? await axios.put(`${appURL}/tasks2/updateTask/${propTaskId}`, payload)
      : await axios.post(`${appURL}/tasks2/createTask`, payload);
  
      if (response.data.success) {
        if (Number(formData.progress) >= 80) {
          setShowGif(true);
          setTimeout(() => setShowGif(false), 5000);
        }
        sessionStorage.removeItem("taskFormData");
        queryClient.invalidateQueries("tasks");

        const createdTaskId =
          response?.data?.data?._id ||
          response?.data?.data?.id ||
          response?.data?._id ||
          response?.data?.id ||
          null;
        const referenceId = isEdit ? propTaskId : createdTaskId;
        const trimmedComment = formData.comments?.trim();

        if (referenceId && trimmedComment) {
          const user = getItemFromLocalStorage("user") || {};
          const employeeName =
            user?.name ||
            [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
          const commentPayload = {
            employeeId: user?._id || user?.id || "",
            employeeName: employeeName || "User",
            comment: trimmedComment,
            referenceId,
            attachment: "",
          };

          try {
            const commentResponse = await dispatch(createComment(commentPayload));
            if (!commentResponse?.success) {
              Toast({
                type: "error",
                message: commentResponse?.message || "Failed to save comment",
                time: 3000,
              });
            }
          } catch (commentError) {
            Toast({
              type: "error",
              message: "Failed to save comment",
              time: 3000,
            });
          } finally {
            await fetchCommentsForTask(referenceId);
          }
        }

        if (addAnother && !isEdit) {
          setFormData({
            title: "",
            description: "",
            startDate: "",
            dueDate: "",
            actualCompletionDate: "",
            assignTo: getItemFromLocalStorage("user")?._id || "",
            priority: "",
            status: "notstarted",
            progress: 0,
            mainTask: "",
            comments: "",
            recurrence: false,
            recurrenceDetails: "",
            file: null,
          });
          setIsFormDirty(false);
          setCommentsHistory([]);
        } else {
          setFormData((prev) => ({ ...prev, comments: "" }));
          setIsFormDirty(false);
          onClose ? onClose() : history.push("/admin/tasks");
        }
      } else {
        throw new Error(response.data.message || "Failed to save task");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error saving task");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleCancel = () => {
    if (isFormDirty) {
      setCancelConfirmOpen(true);
    } else {
      sessionStorage.removeItem("taskFormData");
      onClose ? onClose() : history.push("/admin/tasks");
    }
  };

  const confirmCancel = () => {
    sessionStorage.removeItem("taskFormData");
    setCancelConfirmOpen(false);
    setIsFormDirty(false);
    onClose ? onClose() : history.push("/admin/tasks");
  };

  const latestComment = commentsHistory[0];
  const latestCommentTimestamp = latestComment?.updatedAt || latestComment?.createdAt;
  const latestCommentFormattedDate = latestCommentTimestamp
    ? new Date(latestCommentTimestamp).toLocaleString()
    : "—";

  return (
    <Box sx={{ padding: "20px",
     boxShadow:"0px 0.1px 0px rgba(0,0,0,0.2)" }} >
      {showGif && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img src={LottieConfettie} alt="LottieConfettie" style={{ width: "100px" }} />
          <Typography>You have earned 10 reward points</Typography>
        </Box>
      )}

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "20px",
           boxShadow:"0px 0.1px 0px rgba(0,0,0,0.2)"
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
        {isEdit &&  <ArrowBackIosIcon
            sx={{ fontSize: 32, mt: "-4px", mr: 1, cursor: "pointer" }}
            onClick={handleCancel}
            aria-label="Go back"
          />}
          <Typography sx={{ fontSize: "32px", fontWeight: 700, fontFamily: "Montserrat" }}>
            {isEdit ? "Edit Task"  :"Add Task"}
    
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : errorMessage ? (
          <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" py={4}>
            <Typography color="error">{errorMessage}</Typography>
            <Button onClick={fetchInitialData} sx={{ mt: 2 }} variant="outlined">
              Retry
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel>Task Title *</InputLabel>
              <InputTextComponent
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                aria-label="Task title"
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Task Description *</InputLabel>
              <InputTextComponent
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                fullWidth
                aria-label="Task description"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel>Start Date *</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
                aria-label="Start date"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel>Due Date *</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
                aria-label="Due date"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel>Actual Completion Date</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.actualCompletionDate}
                onChange={(e) => handleChange("actualCompletionDate", e.target.value)}
                error={!!errors.actualCompletionDate}
                helperText={errors.actualCompletionDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
                aria-label="Actual completion date"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Assign To *</InputLabel>
              <SelectComponent
                value={formData.assignTo}
                onChange={(e) => handleChange("assignTo", e.target.value)}
                options={employees}
                error={!!errors.assignTo}
                helperText={errors.assignTo}
                fullWidth
                aria-label="Assign to"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Priority *</InputLabel>
              <SelectComponent
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                options={[
                  { value: "High Level", label: "High Level" },
                  { value: "Medium Level", label: "Medium Level" },
                  { value: "Low Level", label: "Low Level" },
                ]}
                error={!!errors.priority}
                helperText={errors.priority}
                fullWidth
                aria-label="Priority"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Status *</InputLabel>
              <SelectComponent
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={[
                  { value: "notstarted", label: "Not Started" },
                  { value: "inprogress", label: "In Progress" },
                  { value: "onhold", label: "On Hold" },
                  { value: "completed", label: "Completed" },
                ]}
                error={!!errors.status}
                helperText={errors.status}
                fullWidth
                aria-label="Status"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Main Task</InputLabel>
              <SelectComponent
                value={formData.mainTask}
                onChange={(e) => handleChange("mainTask", e.target.value)}
                options={tasks}
                fullWidth
                aria-label="Main task"
              />
            </Grid>

            <Grid item xs={12} sm={6} marginTop="30px">
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={formData.recurrence}
                  onChange={handleRecurrenceChange}
                  icon={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #535353",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#837F39",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                    </Box>
                  }
                  sx={{ padding: 0 }}
                  aria-label="Recurrence"
                />
                <Typography sx={{ marginLeft: 1 }}>Recurrence</Typography>
              </Box>
              {errors.recurrenceDetails && (
                <Typography color="error" variant="caption">
                  {errors.recurrenceDetails}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Progress
                value={Number(formData.progress)}
                onChange={(e) => handleChange("progress", e.target.value)}
                aria-label="Progress"
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Comment</InputLabel>
              <InputTextComponent
                value={formData.comments}
                onChange={(e) => handleChange("comments", e.target.value)}
                placeholder="Enter your comment here..."
                multiline
                rows={3}
                fullWidth
                aria-label="Comment"
              />
          {latestComment && (
            <Box
              sx={{
                backgroundColor: "#F8F8F8",
                borderRadius: "12px",
                padding: "12px 16px",
                marginTop: "12px",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Latest Comment
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "4px" }}>
                {latestComment?.comment}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", marginTop: "6px" }}
              >
                {`by ${latestComment?.employeeName || "Unknown"} on ${latestCommentFormattedDate}`}
              </Typography>
            </Box>
          )}
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Upload File</InputLabel>
              <FileUpload
                id="task-upload"
                value={formData.file}
                onFileUpload={handleFileChange}
                sx={{ width: "100%" }}
                aria-label="Upload file"
              />
              {formData.file && (
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Selected: {formData.file.name}
                </Typography>
              )}
              {errors.file && (
                <Typography color="error" variant="caption">
                  {errors.file}
                </Typography>
              )}
            </Grid>

          

            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
             
              <Button
                variant="outlined"
                onClick={() => handleSubmit(false)}
            
                sx={{
                  color: "#73712A",
                  borderColor: "#73712A",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "bold",
                }}
                aria-label={isEdit ? "Update task" : "Save task"}
              >
                {isLoading ? "Processing..." : isEdit ? "Update Task" : "Save Task"}
              </Button>
              <Button
                variant="contained"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{
                  backgroundColor: "#73712A",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>

      <Dialog open={openRecurrence} onClose={() => setOpenRecurrence(false)}>
        <Recurrence
          open={openRecurrence}
          setOpen={setOpenRecurrence}
          setRecurrenceDetails={(details) => handleChange("recurrenceDetails", details)}
        />
      </Dialog>

      <Dialog open={cancelConfirmOpen} onClose={() => setCancelConfirmOpen(false)}>
        <DialogTitle>Confirm Cancel</DialogTitle>
        <DialogContent>
          <Typography>You have unsaved changes. Are you sure you want to cancel?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelConfirmOpen(false)} aria-label="Continue editing">
            Continue Editing
          </Button>
          <Button onClick={confirmCancel} color="error" autoFocus aria-label="Discard changes">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddTaskForm;