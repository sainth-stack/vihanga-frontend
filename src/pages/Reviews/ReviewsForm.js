import React, { useEffect, useState } from "react";
import "./styles.scss";
import { getReviewFormById, updateReviewForm } from "action/ReviewFormAct";
import { useDispatch } from "react-redux";
import Stepper from "./Stepper";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import ObjectivesTable from "./ObjectivesTable";
import { RatingComponent } from "./Rating";
import { useHistory, useParams } from "react-router-dom";
import {
  AuthUser,
  LoadingIndicator,
  removeDuplicates,
  companyId,
  getDateFormat,
  defaultProfilePic,
  AuthRole,
  AuthUserId,
} from "utilities";
import { getAllCompetencies } from "action/CompetencyAct";

import Button from "components/Company/Button";
import { getEmployeeById, getEmployees } from "action/EmployeeAct";
import { useQueryClient } from "@tanstack/react-query";
import GoalsTable from "./GoalsTable";
import { getTemplateById } from "action/TemplatesAct";
import { Toast } from "service/toast";
import { tableGeneratorObjective } from "./ObjectivesTable/transformTable";
import { tableGenerator } from "pages/Rewards";
import { getObjectives } from "action/UserAct";
import { getObjectives as getGoals } from "action/GoalsAct";
import { t } from "i18next";

export default function ReviewsForm() {
  const { id } = useParams();
  const history = useHistory();
  const [data2, setData2] = useState({
    datasets: [{ data: [0] }],
  });
  const [loading, setLoading] = useState(false);
  const [empData, setEmpData] = useState([]);
  const [, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [, handleSetWeight] = useState(0);
  const [, handleOverRating] = useState(0);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [orderModalShow5, setOrderModalShow5] = useState(false);
  const queryClient = useQueryClient();
  const [formsData, setFormsData] = useState([
    { competencyName: "", Feedback: "", Comments: "", type: "employee" },
  ]);
  const [formsDataManagerReview, setFormsDataManagerReview] = useState([
    { competencyName: "", Feedback: "", Comments: "", type: "manager" },
  ]);
  const [reviewForm, setReviewForm] = useState({
    employeeName: "",
    reviewPeriod: "",
    goals: [],
    competencies: [],
    companyId: companyId,
    totalAchievement: "",
    overallRating: 0,
    attachment: "",
    status: "",
    managerName: "",
    managerId: "",
    employeeFullName: "",
    templateName: "",
    templateId: "",
  });
  const [finalUpdate, setFinalUpdate] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "-",
    profilePicture: "",
    designation: "-",
    department: "-",
    grade: "-",
    manager: "-",
    managerId: "",
  });
  const [objectiveData, setLoadObjectiveData] = useState({
    id: "",
    role: "",
  });
  const [templateInfo, setTemplateInfo] = useState({
    displayOptions: [],
    displaySteps: [],
    ratingScale: "",
    goalPercentage: "",
    competenciesPercentage: "",
  });
  const [text, setText] = useState({
    cm1: "",
    cm2: "",
    cm3: "",
  });
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState([]);
  const dispatch = useDispatch();
  function handleChange(event) {
    const { name, value } = event.target;
    const newData = { ...reviewForm };
    newData[name] = value;
    setReviewForm(newData);
  }
  function handleInputChange1(event, index) {
    const { name, value } = event.target;
    const newData = { ...text };
    newData[name] = value;
    setText(newData);
  }

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    const newData = [...formsData];
    newData[index][name] = value;
    setFormsData(newData);
  }

  const getReviewById = () => {
    try {
      if (id !== "create") {
        setLoading(true);
        let response = dispatch(getReviewFormById(id));
        response.then(({ data, message, success }) => {
          if (success) {
            let updatedData = {
              ...data,
              reviewPeriod: getDateFormat(data.reviewPeriod, "YYYY-MM-DD"),
              overallRating:
                data.overallRating !== "NaN" ? data.overallRating : 0,
            };
            let result = { ...reviewForm, ...updatedData };
            setReviewForm(result);
            setText(result?.overalComments || "");
            setLoading(false);
            setLoadObjectiveData({
              id: updatedData.employeeRole,
              role: updatedData.employeeId,
            });
            if (data.competencies.length > 0) {
              setFormsData(data.competencies);
            }
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        let updatedData = {
          ...reviewForm,
          status: "Submit",
          reviewPeriod: getDateFormat(new Date(), "YYYY-MM-DD"),
        };
        setReviewForm(updatedData);
        setLoadObjectiveData({
          id: updatedData.employeeRole,
          role: updatedData.employeeId,
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const getUserDetailsById = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeeById(reviewForm.employeeId));
      response.then(({ data, message, success }) => {
        if (success) {
          let formattedData = {
            name:
              data.personalInformation.firstName +
              " " +
              data.personalInformation.lastName,
            profilePicture: data.personalInformation.profilePicture,
            designation: data.employmentInformation.designation,
            department: data.employmentInformation.department,
            grade: data.employmentInformation.grade,
            managerId: data.employmentInformation.lineManager,
          };
          setEmployeeInfo(formattedData);
          let updatedData = {
            ...reviewForm,
            employeeFullName: formattedData.name,
          };
          setReviewForm(updatedData);
          setLoading(false);
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
  const getManagerDetailsById = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeeById(employeeInfo.managerId));
      response.then(({ data, message, success }) => {
        if (success) {
          let formattedData = {
            ...employeeInfo,
            manager:
              data.personalInformation.firstName +
              " " +
              data.personalInformation.lastName,
          };
          setEmployeeInfo(formattedData);
          setLoading(false);
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

  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let selectedTab =
    localStorage.getItem("selectedTab") !== null
      ? JSON.parse(localStorage.getItem("selectedTab"))
      : null;
  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message, success }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data
            .filter((item) => {
              if (selectedTab !== null && selectedTab.tab === "me") {
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
          setEmpData(nonduplicates);
          if (id === "create" && reviewForm.employeeName === "") {
            let findUser = nonduplicates.find(
              (item) => item.value === user._id
            );
            setReviewForm((prevData) => ({
              ...prevData,
              employeeName: findUser.value,
            }));
          }
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

  const getCompetencies = () => {
    setLoading(true);
    let response = dispatch(getAllCompetencies());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map((item, index) => {
          return {
            ...item,
            Feedback: 0,
            Comments: "",
            type: "",
            startDate: window.moment(item.startDate).format("YYYY-MM-DD"),
            endDate: window.moment(item.endDate).format("YYYY-MM-DD"),
          };
        });
        setFormsData(updatedData);
        setFormsDataManagerReview(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (reviewForm.goals?.length > 0) {
      let totalEmployeeRating = reviewForm.goals.reduce((prev, current) => {
        return (
          prev +
          ((Number(current.employeeRating) * Number(current.weight)) / 100 || 0)
        );
      }, 0);

      let totalManagerRating = reviewForm.goals.reduce((prev, current) => {
        return (
          prev +
          ((Number(current.managerRating) * Number(current.weight)) / 100 || 0)
        );
      }, 0);
      totalEmployeeRating = Number(totalEmployeeRating).toFixed(2);
      totalManagerRating = Number(totalManagerRating).toFixed(2);
      const avgRating =
        totalEmployeeRating > 0
          ? (totalEmployeeRating + totalManagerRating) / 2
          : totalManagerRating;
      // setReviewForm({ ...reviewForm, overallRating: avgRating })
    }
  }, [reviewForm.goals]);

  const getTemplateDetails = () => {
    try {
      setLoading(true);
      let response = dispatch(getTemplateById(reviewForm.templateId));
      response.then(({ data, message, success }) => {
        if (success) {
          setTemplateInfo(data);
          const finData = [];
          const mainData = data?.displaySteps.map((item, index) => {
            if (item.isChecked) {
              finData.push({
                id: finData.length,
                label: item.value,
                key: item.key,
                text: item?.text || "Submit",
              });
            }
          });
          const index = finData.filter(
            (item) => item.label === reviewForm.status
          );
          setActiveStep(index.length > 0 ? index[0]?.id : finData[0]?.id);
          setStatus(index.length > 0 ? index[0]?.label : finData[0]?.label);
          setSteps(finData);
          setLoading(false);
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
    getCompetencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getReviewById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if (reviewForm.employeeFullName !== "") {
      getUserDetailsById();
    }
    if (reviewForm.templateId !== "") {
      getTemplateDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewForm.employeeFullName]);
  useEffect(() => {
    if (employeeInfo.managerId !== "") {
      getManagerDetailsById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeInfo.managerId]);
  const stepperStyles = {
    marginTop: "50px",
    "& .MuiStepConnector-alternativeLabel": { top: "10px" },
    "& .MuiStepLabel-label.Mui-active": {
      fontWeight: "550",
    },
    "& .Mui-completed": {
      fontWeight: "550",
    },
  };
  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    const index = steps.filter((item) => item.id === newActiveStep);
    setStatus(index.length > 0 ? index[0]?.label : steps[0].label);
    setActiveStep(newActiveStep);
  };
  const handleBack = () => {
    const index = steps.filter((item) => item.id === activeStep - 1);
    setStatus(index.length > 0 ? index[0]?.label : steps[0].label);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  console.log(reviewForm.competencies);

  const handleSubmit = () => {
    setLoading(true);
    let status = steps.filter((item) => item.id === activeStep)[0].label;
    reviewForm.status = status;
    console.log(status);
    if (status === "Submit") {
      reviewForm.competencies = formsData.map((item) => ({
        ...item,
        type: "employee",
        overalComments: text,
      }));
      reviewForm.managerId = employeeInfo.managerId;
      reviewForm.managerName = employeeInfo.manager;
      const kr = [];
      const allKeyresultsHaveActual = reviewForm.goals.filter((item) => {
        const data = item.children.filter(
          (childKey) =>
            childKey.actual === undefined || childKey.actual === null
        );
        kr.push(...data);
        return data.length > 0;
      });
      const finalData = kr
        .map((item) => {
          return item.keyResultName;
        })
        .join(",\n");
      if (allKeyresultsHaveActual?.length > 0) {
        Toast({
          type: "error",
          message: `Every Key Results Must have Actual Result. Below KR's don't have actual results:\n ${finalData}`,
        });
        setLoading(false);
      } else if (text.cm1 === "" || !text.cm1 || !text.cm2 || text.cm2 === "") {
        Toast({ type: "error", message: `Employee comments are mandatory` });
        setLoading(false);
      } else if (allKeyresultsHaveActual?.length === 0) {
        const allKeyResultsRatingCheck = reviewForm.goals.filter((item) => {
          if (
            item.employeeRating === undefined ||
            item.employeeRating === null ||
            !item.employeeRating
          ) {
            return true;
          }
        });
        if (allKeyResultsRatingCheck.length > 0) {
          Toast({
            type: "error",
            message: `Each okr must have employee rating`,
          });
          setLoading(false);
        } else {
          reviewForm.status = "Manager Review";
          let response = dispatch(
            updateReviewForm(reviewForm._id, {
              ...reviewForm,
              overalComments: text,
            })
          );
          response.then(({ success, message }) => {
            if (success) {
              setLoading(false);
              let newActiveStep = activeStep + 1;
              setActiveStep(newActiveStep);
              // getReviewById();
              history.push("/admin/reviews");
              queryClient.invalidateQueries("reviewsForm");
            } else {
              setLoading(false);
            }
          });
        }
      }
    } else if (status === "Manager Review") {
      const allKeyResultsRatingCheck = reviewForm.goals.filter((item) => {
        if (
          item.managerRating === undefined ||
          item.managerRating === null ||
          !item.managerRating
        ) {
          return true;
        }
      });
      if (allKeyResultsRatingCheck.length > 0) {
        Toast({ type: "error", message: `Each okr must have manager rating` });
        setLoading(false);
      } else if (!text.cm3 || text.cm3 === "") {
        Toast({ type: "error", message: `Manager comments are mandatory` });
        setLoading(false);
      } else {
        let status = steps.filter((item) => item.id === activeStep + 1)[0]
          .label;
        reviewForm.status = status;
        let response = dispatch(
          updateReviewForm(reviewForm._id, {
            ...reviewForm,
            overalComments: text,
          })
        );
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            let newActiveStep = activeStep + 1;
            setActiveStep(newActiveStep);
            Toast({
              type: "success",
              message: "Review Form Updated Successfully!",
              time: 5000,
            });
            // getReviewById();
            history.push("/admin/reviews");
            queryClient.invalidateQueries("reviewsForm");
          } else {
            setLoading(false);
          }
        });
      }
    } else {
      let status = steps.filter((item) => item.id === activeStep + 1)[0].label;
      reviewForm.status = status;
      let response = dispatch(
        updateReviewForm(reviewForm._id, { ...reviewForm })
      );
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          let newActiveStep = activeStep + 1;
          setActiveStep(newActiveStep);
          // getReviewById();
          history.push("/admin/reviews");
          queryClient.invalidateQueries("reviewsForm");
        } else {
          setLoading(false);
        }
      });
    }
  };
  const handleSave = () => {
    setLoading(true);
    const kr = [];
    const allKeyresultsHaveActual = reviewForm.goals.filter((item) => {
      const data = item.children.filter(
        (childKey) => childKey.actual === undefined || childKey.actual === null
      );
      kr.push(...data);
      return data.length > 0;
    });
    const finalData = kr
      .map((item) => {
        return item.keyResultName;
      })
      .join(",\n");
    if (allKeyresultsHaveActual?.length > 0) {
      Toast({
        type: "error",
        message: `Every Key Results Must have Actual Result. Below KR's don't have actual results:\n ${finalData}`,
      });
      setLoading(false);
    } else if (allKeyresultsHaveActual?.length === 0) {
      const allKeyResultsRatingCheck = reviewForm.goals.filter((item) => {
        if (
          item.employeeRating === undefined ||
          item.employeeRating === null ||
          !item.employeeRating
        ) {
          return true;
        }
      });
      if (allKeyResultsRatingCheck.length > 0) {
        Toast({ type: "error", message: `Each okr must have employee rating` });
        setLoading(false);
      } else {
        let response = dispatch(
          updateReviewForm(reviewForm._id, {
            ...reviewForm,
            overalComments: text,
          })
        );
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            history.push("/admin/reviews");
            queryClient.invalidateQueries("reviewsForm");
          } else {
            setLoading(false);
          }
        });
      }
    }
  };
  const handleCancel = () => {
    history.push("/admin/reviews");
  };

  const nonAllowed = ["Manager", "HR Admin", "Super Admin"];
  const handleUpdateGoals = (id, row) => {
    setLoading(true);
    let index = reviewForm.goals.findIndex((item) => item._id === id);
    let updatedGoals = [...reviewForm.goals];
    updatedGoals[index] = row;
    setReviewForm({ ...reviewForm, goals: updatedGoals });
    if (activeStep === 1) {
      let response = dispatch(
        updateReviewForm(
          reviewForm._id,
          { ...reviewForm, goals: updatedGoals },
          true
        )
      );
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          getReviewById();
        } else {
          setLoading(false);
        }
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  let isFullNameEnabled =
    templateInfo?.displayOptions?.length > 0 &&
    templateInfo?.displayOptions?.find((item) => item.value === "firstName")
      .isChecked &&
    templateInfo?.displayOptions?.find((item) => item.value === "lastName")
      .isChecked;
  let isDepartmentEnabled =
    templateInfo?.displayOptions?.length > 0 &&
    templateInfo?.displayOptions?.find((item) => item.value === "department")
      .isChecked;
  let isGradeEnabled =
    templateInfo?.displayOptions?.length > 0 &&
    templateInfo?.displayOptions?.find((item) => item.value === "grade")
      .isChecked;
  let isManagerEnabled =
    templateInfo?.displayOptions?.length > 0 &&
    templateInfo?.displayOptions?.find((item) => item.value === "manager")
      .isChecked;
  let isDesignationEnabled =
    templateInfo?.displayOptions?.length > 0 &&
    templateInfo?.displayOptions?.find((item) => item.value === "designation")
      .isChecked;
  const getText = (status) => {
    const data = steps.filter((item) => item?.label === status)[0];
    const nextData = steps.filter((item) => item?.id === data?.id + 1)[0];
    return nextData?.text || "Submit";
  };

  const refreshData = async (id = null, hardRefresh = false) => {
    try {
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      if (user !== null) {
        let data2 = [];
        let privileges2 = [];
        let message2 = "";
        if (templateInfo.percentageType == "goal") {
          const { data: objectivesResponse, isLoading: objectivesLoading } =
            await dispatch(getGoals(objectiveData.id, objectiveData.role));
          const { data = [], privileges, message } = objectivesResponse;
          data2 = data;
          privileges2 = privileges;
          message2 = message;
        } else {
          // const { data = [], privileges, message } = objectivesResponse2;
          let response = await dispatch(
            getObjectives(objectiveData.id, objectiveData.role)
          );
          const finalData = response?.data?.filter((item) => {
            if (item?.employeeReferenceId === objectiveData?.role) {
              return true;
            }
          });
          data2 = finalData;
          privileges2 = response.privileges;
          message2 = response.message;
        }

        if (privileges2 && privileges2.length > 0) {
          // setPrivileges(privileges2[0].privileges)
        }
        if (
          data2 !== undefined &&
          data2.length > 0 &&
          (reviewForm?.goals?.length == 0 || hardRefresh)
        ) {
          let existingUser =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          let filteredData = data2.filter(
            (item) =>
              item.employeeName ===
              (existingUser !== null ? existingUser.ownerName : AuthUser.name)
          );
          let result =
            templateInfo.percentageType == "goal"
              ? tableGenerator(
                  data2.length > 0 ? data2 : filteredData,
                  data2.length > 0 ? data2.length : filteredData.length,
                  data2.length > 0 ? data2 : filteredData
                )
              : tableGeneratorObjective(
                  data2.length > 0 ? data2 : filteredData,
                  data2.length > 0 ? data2.length : filteredData.length,
                  data2.length > 0 ? data2 : filteredData
                );
          setReviewForm({ ...reviewForm, goals: result });
        } else if (data2.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message2);
        }
      }
    } catch (error) {
      setError(error.toString());
    }
  };

  const handleRefresh = () => {
    refreshData(null, true);
  };

  useEffect(() => {
    if (objectiveData.id !== "") {
      refreshData();
    }
  }, [objectiveData.id]);

  function handleInputChangeMReview(event, index) {
    const { name, value } = event.target;
    const newData = [...formsDataManagerReview];
    newData[index][name] = value;
    setFormsDataManagerReview(newData);
    if (name === "Feedback" && activeStep === 1) {
      setLoading(true);
      reviewForm.competencies = [
        ...reviewForm.competencies.filter((item) => item.type === "employee"),
        ...newData.map((item) => ({ ...item, type: "manager" })),
      ];
      let response = dispatch(
        updateReviewForm(reviewForm._id, reviewForm, true)
      );
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          getReviewById();
        } else {
          setLoading(false);
        }
      });
    }
  }

  return (
    <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="head">Review Form</h1>
        <div className="d-flex">
          <button
            className="btn btn-primary bg-green mr-2"
            onClick={() => {
              history.push("/admin/reviews");
            }}
          >
            Go Back
          </button>
          {activeStep === 5 && (
            <a
              className="btn btn-primary bg-green"
              href={`/admin/reviews-report/${reviewForm._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Report
            </a>
          )}
        </div>
      </div>
      <div className="company-form">
        <div>
          <Stepper
            {...{
              sx: { ...stepperStyles },
              steps: steps,
              isIconStepper: false,
              activeStep: activeStep,
              setActiveStep: setActiveStep,
              handleBack: handleBack,
              handleNext: handleNext,
            }}
          />
        </div>
        <div className="mt-5">
          <div className="d-flex justify-content-center">
            <div>
              <p className="midcon">
                Form Employee Name - Review Period ({reviewForm?.startDate} -{" "}
                {reviewForm?.endDate})
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="  p-0">
              {isFullNameEnabled && (
                <p>{reviewForm.employeeFullName} - &nbsp; </p>
              )}
            </div>
            <div className="  p-0">
              <p>{reviewForm.reviewPeriod}</p>
            </div>
          </div>
        </div>
        <p className="text-dark mt-4 ml-3 font-weight-bold">
          Employee Information
        </p>
        <div className="w-100 ml-4">
          <div className="row">
            <div className="card1 col-3 p-0">
              <div className="top1 d-flex justify-content-center">
                <img
                  src={
                    employeeInfo.profilePicture
                      ? employeeInfo.profilePicture
                      : defaultProfilePic
                  }
                  alt="none"
                  className="imagepro"
                />
              </div>
              <div className="d-flex justify-content-center mt-5">
                <div>
                  {isFullNameEnabled && (
                    <p className="e1">{employeeInfo.name}</p>
                  )}
                  {isDesignationEnabled && (
                    <p className="e-2">{employeeInfo.designation}</p>
                  )}
                </div>
              </div>
              <div class="mt-3">
                <div class="col">
                  {isDepartmentEnabled && (
                    <div className="row">
                      <div class="col m-1">Function </div>
                      <div class="col m-1">{employeeInfo.department}</div>
                    </div>
                  )}
                  {isGradeEnabled && (
                    <div className="row">
                      <div class="col m-1">Grade</div>
                      <div class="col m-1">{employeeInfo.grade}</div>
                    </div>
                  )}

                  {isManagerEnabled && (
                    <div className="row">
                      <div class="col m-1">Manager</div>
                      <div class="col m-1">{employeeInfo.manager}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-8 ml-1">
              <div className="card2 ml-1 p-2">
                <p className="larghead">Guidelines</p>
                <p className="largecon">
                  The below links / documents provide information to assist
                  managers and employees with the following: Appraisal Process :
                  Provides guidance un writing performance feedback based on
                  achievements that are factual, constractive and supported by
                  evidence. Rating Guidelines : Provides guidance on how to
                  appropriately rate an employee based on the 5-Star rating
                  scale. User Manual : Provides guidence on system navigation
                </p>
              </div>
              <div className="d-flex row ml-1 mt-4 justify-content-between">
                <div
                  className={`card3 col-${
                    reviewForm.overallRating > 0 ? "5" : "5"
                  } d-flex justify-content-center align-items-center p-1`}
                >
                  <div className="tweight">Total Weight Achievement%</div>
                  {loading ? (
                    <LoadingIndicator />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        background: "teal",
                        color: "white",
                      }}
                    >
                      <p className="text-white text-center mt-2 pt-1">
                        {data2?.datasets[0]?.data[0] + "%"}
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className={` card3 col-6 d-flex justify-content-between align-items-center p-1 ${
                    Number(reviewForm?.overallRating) > 0 ? "" : ""
                  }`}
                >
                  <div>
                    <p className="or">Overall Rating</p>
                  </div>
                  <div>
                    {loading ? (
                      <LoadingIndicator />
                    ) : (
                      <div>
                        {
                          <div>
                            <RatingComponent
                              readonly
                              value={reviewForm.overallRating || 0}
                            />
                            {reviewForm.overallRating || 0} out of 5
                          </div>
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              {reviewForm.goals.length > 0 ? (
                <GoalsTable
                  refresh={true}
                  refresh2={true}
                  ownerDet={empData}
                  orderModalShow3={orderModalShow3}
                  orderModalShow5={orderModalShow5}
                  setOrderModalShow3={(status) => setOrderModalShow3(status)}
                  setOrderModalShow5={(status) => setOrderModalShow5(status)}
                  companyInfo={{ employeeNames: AuthUser.name }}
                  setDataWeights={(data) => {}}
                  setDataWeightsPercent={(data) => setData2(data)}
                  setDataQ1={(data) => {}}
                  setDataQ2={(data) => {}}
                  setDataQ3={(data) => {}}
                  setDataQ4={(data) => {}}
                  refresher={handleRefresh}
                  handlecallback={(data) => {
                    // let updatedForm = { ...reviewForm, goals: data };
                    // setLoading(true);
                    // handleChange({ target: { name: "goals", value: updatedForm.goals } });
                    // setTimeout(() => {
                    //   setLoading(false);
                    // }, 500);
                  }}
                  templateInfo={templateInfo}
                  handleUpdateGoals={handleUpdateGoals}
                  handleCallback2={() => {}}
                  goals={reviewForm.goals}
                  hideColumns={employeeInfo.managerId}
                  hideHeaders
                  status={reviewForm.status}
                  isEmployee={reviewForm.employeeName}
                  isManager={employeeInfo.managerId}
                  handleSetWeight={(weight) => handleSetWeight(weight)}
                  handleOverRating={(rating) => handleOverRating(rating)}
                  stepStatus={steps}
                />
              ) : (
                <ObjectivesTable
                  refresh={true}
                  refresh2={true}
                  ownerDet={empData}
                  orderModalShow3={orderModalShow3}
                  orderModalShow5={orderModalShow5}
                  setOrderModalShow3={(status) => setOrderModalShow3(status)}
                  setOrderModalShow5={(status) => setOrderModalShow5(status)}
                  companyInfo={{ employeeNames: AuthUser.name }}
                  setDataWeights={(data) => {}}
                  setDataWeightsPercent={(data) => setData2(data)}
                  setDataQ1={(data) => {}}
                  setDataQ2={(data) => {}}
                  setDataQ3={(data) => {}}
                  setDataQ4={(data) => {}}
                  templateInfo={templateInfo}
                  handlecallback={(data) => {
                    let updatedForm = {
                      ...reviewForm,
                      goals: data.map((item) => ({ ...item })),
                    };
                    // setLoading(true);
                    handleChange({
                      target: { name: "goals", value: updatedForm.goals },
                    });
                    setFinalUpdate(true);
                    // setTimeout(() => {
                    //   setLoading(false);
                    // }, 500);
                  }}
                  handleCallback2={() => {}}
                  goals={reviewForm.goals.length > 0 ? reviewForm.goals : []}
                  hideColumns={employeeInfo.managerId}
                  hideHeaders
                  status={reviewForm.status}
                  isEmployee={reviewForm.employeeName}
                  stepStatus={steps}
                  objectiveData={objectiveData}
                  isManager={employeeInfo.managerId}
                />
              )}
            </>
          )}
        </div>

        <div className="d-flex" style={{ gap: "20px" }}>
          {activeStep === 0 && (
            <div className="col-md-5">
              <div>
                <p className="Comphead h4">Employee Competencies Review</p>
              </div>
              {(reviewForm.status !== "Submit"
                ? formsData.filter((item) => item.type === "employee")
                : formsData
              ).map((data, index) => (
                <div className="mb-3">
                  <div className="col-12 p-0 mt-3 mb-3">
                    <p className="">{data.competencyName}</p>
                  </div>
                  <div className="row pl-3 mt-3 mb-3">
                    <p className="feedback mr-3 mt-2">Feedback</p>
                    <RatingComponent
                      value={data.Feedback}
                      readonly={reviewForm.status !== "Submit"}
                      name="Feedback"
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  </div>
                  <div className="form-group d-flex justify-content-between col-12 p-0 pl-1">
                    <label htmlFor="taskDescription" className="taskdesc">
                      Comments
                    </label>
                    <textarea
                      id="description"
                      className={"form-control p-2 col-9 ml-1"}
                      style={{ borderRadius: "20px" }}
                      rows="5"
                      name="Comments"
                      value={data.Comments}
                      disabled={reviewForm.status !== "Submit"}
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  </div>
                </div>
              ))}
              {
                <div className="form-group d-flex col-12 p-0 pl-1 pt-4">
                  <label htmlFor="taskDescription" className="taskdesc">
                    What is your key accomplishments in the last quarter? *
                  </label>
                  <textarea
                    id="description"
                    className={"form-control p-2 col-9 ml-1"}
                    style={{ borderRadius: "20px" }}
                    rows="5"
                    name="cm1"
                    value={text?.cm1}
                    onChange={handleInputChange1}
                    disabled={!(status === "Submit")}
                  />
                </div>
              }
              {
                <div className="form-group d-flex col-12 p-0 pl-1 pt-4">
                  <label htmlFor="taskDescription" className="taskdesc">
                    What is your plan for the next quarter? *
                  </label>
                  <textarea
                    id="description"
                    className={"form-control p-2  col-9 ml-1"}
                    style={{ borderRadius: "20px" }}
                    rows="5"
                    name="cm2"
                    value={text?.cm2}
                    onChange={handleInputChange1}
                    disabled={!(status === "Submit")}
                  />
                </div>
              }
              <div className="col-12">
                <label
                  htmlFor="taskdesc col-2"
                  onChange={(event) =>
                    handleInputChange(
                      event
                      // index
                    )
                  }
                >
                  {t("Tasks.Upload Files")}
                </label>
                {reviewForm.attachment ? (
                  <a
                    href={reviewForm.attachment}
                    target="_blank"
                    className="ml-2"
                  >
                    View Attachment
                  </a>
                ) : activeStep === 0 &&
                  (reviewForm.status !== "Submit" ||
                    !reviewForm.attachment.length) ? (
                  <BrowseFilesNormal
                    // onChange={(event) => handleInputChange(event, index)}
                    className="col-12"
                    value={reviewForm.attachment}
                    setData={({ url }) => {
                      handleChange(
                        {
                          target: {
                            name: "attachment",
                            value: reviewForm.attachment
                              ? reviewForm.attachment
                              : url,
                          },
                        }
                        // index
                      );
                      // setShowAttachment(!showAttachment);
                    }}
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* manager view from step-2 */}
          {activeStep > 0 && (
            <div className="col-md-5">
              <div className="mt-2">
                <p className="Comphead h4">Manager Competencies Review</p>
              </div>
              {AuthUserId === employeeInfo.managerId || activeStep > 1
                ? (activeStep > 1
                    ? reviewForm.competencies.filter(
                        (item) => item.type === "manager"
                      )
                    : formsDataManagerReview
                  ).map((data, index) => (
                    <div className="mb-3">
                      <div className="col-12 p-0 mt-3 mb-3">
                        <p className="">{data.competencyName}</p>
                      </div>
                      <div className="row pl-3 mt-3 mb-3">
                        <p className="feedback mr-3 mt-2">Feedback</p>
                        <RatingComponent
                          readonly={activeStep > 1}
                          value={data.Feedback}
                          name="Feedback"
                          onChange={(event) =>
                            handleInputChangeMReview(event, index)
                          }
                        />
                      </div>
                      <div className="form-group d-flex justify-content-between col-12 p-0 pl-1">
                        <label htmlFor="taskDescription" className="taskdesc">
                          Comments
                        </label>
                        <textarea
                          id="description"
                          className={"form-control p-2  col-9 ml-1"}
                          rows="5"
                          style={{ borderRadius: "20px" }}
                          name="Comments"
                          disabled={activeStep > 1}
                          onChange={(event) =>
                            handleInputChangeMReview(event, index)
                          }
                          value={data.Comments}
                        />
                      </div>
                    </div>
                  ))
                : "Manager Competencies Review is not available"}
              {status !== "Submit" && (
                <div className="form-groupx d-flex col-12 p-0 pl-1 pt-4">
                  <label htmlFor="taskDescription" className="taskdesc">
                    Overall Manager comments *
                  </label>
                  <textarea
                    id="description"
                    className={"form-control p-2  col-9 ml-1"}
                    style={{ borderRadius: "20px" }}
                    rows="5"
                    name="cm3"
                    value={text?.cm3}
                    onChange={handleInputChange1}
                    disabled={
                      !(status === "Manager Review" && AuthRole === "Manager")
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* readonly and manager view from step-2 */}
          {activeStep > 0 && reviewForm.competencies.length > 0 && (
            <div className="col-md-5">
              <div>
                <p className="Comphead h4">Employee Competencies Review</p>
              </div>
              {reviewForm.competencies
                .filter((item) => item.type === "employee")
                .map((data, index) => (
                  <div className="mb-3">
                    <div className="col-12 p-0 mt-3 mb-3">
                      <p className="">{data.competencyName}</p>
                    </div>
                    <div className="row pl-3 mt-3 mb-3">
                      <p className="feedback mr-3 mt-2">Feedback</p>
                      {/*<img src={star} alt="none" className="ml-5 pl-5 " />*/}
                      <RatingComponent
                        readonly
                        value={data.Feedback}
                        onChange={(event) => handleInputChange(event, index)}
                      />
                    </div>
                    <div className="form-group d-flex justify-content-between col-12 p-0 pl-1">
                      <label htmlFor="taskDescription" className="taskdesc">
                        Comments
                      </label>
                      <textarea
                        id="description"
                        className={"form-control p-2  col-10 ml-1"}
                        rows="5"
                        style={{ borderRadius: "20px" }}
                        name="description"
                        value={data.Comments}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              {
                <div className="form-group d-flex col-12 p-0 pl-1 pt-4">
                  <label htmlFor="taskDescription" className="taskdesc">
                    What is your key accomplishments in the last quarter? *
                  </label>
                  <textarea
                    id="description"
                    className={"form-control p-2 col-9 ml-1"}
                    style={{ borderRadius: "20px" }}
                    rows="5"
                    name="cm1"
                    value={text?.cm1}
                    onChange={handleInputChange1}
                    disabled={!(status === "Submit")}
                  />
                </div>
              }
              {
                <div className="form-group d-flex col-12 p-0 pl-1 pt-4">
                  <label htmlFor="taskDescription" className="taskdesc">
                    What is your plan for the next quarter? *
                  </label>
                  <textarea
                    id="description"
                    className={"form-control p-2  col-9 ml-1"}
                    style={{ borderRadius: "20px" }}
                    rows="5"
                    name="cm2"
                    value={text?.cm2}
                    onChange={handleInputChange1}
                    disabled={!(status === "Submit")}
                  />
                </div>
              }
              <div className="col-12 p-0">
                <a
                  href={reviewForm.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-12 p-0"
                >
                  View Attachment
                </a>
              </div>
            </div>
          )}
        </div>

        {(status === "Employee SignOff" ||
          status === "Manager SignOff" ||
          status === "Completed") && (
          <div className="m-3">
            <p>Manager : {employeeInfo.manager}</p>
            <p>
              SignOff :{" "}
              {window
                .moment(reviewForm?.managerSubmissionDate)
                .format("YYYY-MM-DD")}
            </p>
          </div>
        )}

        {(status === "Employee SignOff" || status === "Completed") && (
          <div className="m-3">
            <p>Employee : {employeeInfo.name}</p>
            <p>
              SignOff :{" "}
              {window
                .moment(reviewForm?.employeeSubmissionDate)
                .format("YYYY-MM-DD")}
            </p>
          </div>
        )}
        <div>
          <div className="buttons ">
            {(activeStep === 0 ||
              (activeStep === 1 && AuthUserId === employeeInfo.managerId) ||
              (activeStep === 2 &&
                (AuthRole === "HR Admin" || AuthRole === "Manager")) ||
              (activeStep === 3 && AuthUserId === employeeInfo.managerId) ||
              (activeStep === 4 && !nonAllowed.includes(AuthRole))) && (
              <Button
                text="Cancel"
                className="bg-white border-grey"
                handleClick={handleCancel}
              />
            )}
            {
              <Button
                text={"Save & Close"}
                className="bg-green border text-white"
                handleClick={handleSave}
              />
            }
            {status === "Submit" && (
              <Button
                text={getText("Self Submission (Employee)")}
                className="bg-green border text-white"
                handleClick={handleSubmit}
              />
            )}
            {status === "Manager Review" &&
              AuthUserId === employeeInfo.managerId && (
                <Button
                  text={getText("Manager Review")}
                  className="bg-green border text-white"
                  handleClick={handleSubmit}
                />
              )}
            {status === "HR Review" &&
              (AuthRole === "HR Admin" || AuthRole === "Manager") && (
                <Button
                  text={getText("HR Review")}
                  className="bg-green border text-white"
                  handleClick={handleSubmit}
                />
              )}
            {status === "Manager SignOff" &&
              AuthUserId === employeeInfo.managerId && (
                <Button
                  text={getText("Manager SignOff")}
                  className="bg-green border text-white"
                  handleClick={handleSubmit}
                />
              )}
            {status === "Employee SignOff" &&
              AuthUserId !== employeeInfo.managerId && (
                <Button
                  text={getText("Employee SignOff")}
                  className="bg-green border text-white"
                  handleClick={handleSubmit}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
