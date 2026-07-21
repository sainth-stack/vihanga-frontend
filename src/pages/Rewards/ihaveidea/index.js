import React, { useEffect, useState, useRef } from "react";
import "../../Reviews/styles.scss";
import { getReviewFormById, updateReviewForm } from "action/ReviewFormAct";
import { useDispatch } from "react-redux";
import Stepper from "../../Reviews/Stepper";
import { RatingComponent } from "../../Reviews/Rating";
import { useHistory, useParams } from "react-router-dom";
import useWindowSize from "components/UseWindowSize";
import './index.css'
import {
    AuthUser,
    LoadingIndicator,
    removeDuplicates,
    companyId,
    getDateFormat,
    defaultProfilePic,
    AuthRole,
    AuthUserId
} from "utilities";
import { getAllCompetencies } from "action/CompetencyAct";

import Button from "components/Company/Button";
import { getEmployeeById, getEmployees } from "action/EmployeeAct";
import { useQueryClient } from "@tanstack/react-query";
import { getTemplateById } from "action/TemplatesAct";
import { Toast } from "service/toast";
import SelectInput from "components/Company/SelectInput";
import TextInput from "components/Company/TextInput";

export default function ReviewsForm() {
    const { id } = useParams();
    const history = useHistory();
    const [data2, setData2] = useState({
        datasets: [{ data: [0] }]
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
    const [formsData, setFormsData] = useState([{ competencyName: '', Feedback: '', Comments: '', type: "employee" }]);
    const [formsDataManagerReview, setFormsDataManagerReview] = useState([{ competencyName: '', Feedback: '', Comments: '', type: 'manager' }]);
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
    const [employeeInfo, setEmployeeInfo] = useState({
        name: "-",
        profilePicture: "",
        designation: "-",
        department: "-",
        grade: "-",
        manager: "-",
        managerId: ""
    });
    const defaultData = {
        SRnumber: 2,
        priority: "High",
        problemArea: '',
        raisedBy: 'nmae',
        status: 'IdeaType1',
        description: '',
        userId: 'heyy',
        attachments: '',
        companyId: 'nma',
        feed: [],
        update: '',
        url: ''
    }
    const [task, setTask] = useState(defaultData);

    const [templateInfo, setTemplateInfo] = useState({
        displayOptions: [],
        ratingScale: "",
        goalPercentage: "",
        competenciesPercentage: ""
    });

    const ideatype = [
        { key: 'IdeaType 1', value: 'IdeaType 1' },
        { key: 'IdeaType 2', value: 'IdeaType 2' },
        { key: 'IdeaType 3', value: 'IdeaType 3' },
    ]

    const idea = [
        { key: 'Idea 1', value: 'Idea 1' },
        { key: 'Idea 2', value: 'Idea 2' },
        { key: 'Idea 3', value: 'Idea 3' },
    ]
    const dispatch = useDispatch();
    const handleChange = ({ target: { name, value } }) => {
        let updatedData = { ...task };
        updatedData[name] = value;
        setTask(updatedData);
    };
    function handleChange2(event) {
        const { name, value } = event.target;
        const newData = { ...reviewForm };
        newData[name] = value;
        setReviewForm(newData);
    }
    function handleInputChange(event, index) {
        const { name, value } = event.target;
        const newData = [...formsData];
        newData[index][name] = value;
        setFormsData(newData);
    }
    function handleInputChangeMReview(event, index) {
        const { name, value } = event.target;
        const newData = [...formsDataManagerReview];
        newData[index][name] = value;
        setFormsDataManagerReview(newData);
        if (name === "Feedback" && activeStep === 1) {
            setLoading(true);
            reviewForm.competencies = [...reviewForm.competencies.filter(item => item.type === "employee"), ...newData.map(item => ({ ...item, type: "manager" }))];
            let response = dispatch(updateReviewForm(reviewForm._id, reviewForm, true));
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
                            overallRating: data.overallRating !== "NaN" ? data.overallRating : 0
                        }
                        let result = { ...reviewForm, ...updatedData };
                        setReviewForm(result);
                        setLoading(false);
                        if (data.competencies.length > 0) {
                            setFormsData(data.competencies);
                        }
                        let activeSteps = ["Submit", "Manager Review", "HR Review", "Manager SignOff", "Employee SignOff", "Completed"]
                        setActiveStep(activeSteps.findIndex(item => item === data.status));
                    } else {
                        setLoading(false);
                        setError(message);
                    }
                });
            } else {
                let updatedData = { ...reviewForm, status: "Submit", reviewPeriod: getDateFormat(new Date(), "YYYY-MM-DD") }
                setReviewForm(updatedData);
            }
        } catch (error) {
            setLoading(false);
            setError(error.toString());
        }
    };
    const getUserDetailsById = () => {
        try {
            setLoading(true);
            let response = dispatch(getEmployeeById(reviewForm.employeeName));
            response.then(({ data, message, success }) => {
                if (success) {
                    let formattedData = {
                        name: data.personalInformation.firstName + " " + data.personalInformation.lastName,
                        profilePicture: data.personalInformation.profilePicture,
                        designation: data.employmentInformation.designation,
                        department: data.employmentInformation.department,
                        grade: data.employmentInformation.grade,
                        managerId: data.employmentInformation.lineManager,
                    }
                    setEmployeeInfo(formattedData);
                    let updatedData = { ...reviewForm, employeeFullName: formattedData.name }
                    setReviewForm(updatedData)
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
                        manager: data.personalInformation.firstName + " " + data.personalInformation.lastName,
                    }
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

    let selectedTab = localStorage.getItem("selectedTab") !== null ? JSON.parse(localStorage.getItem("selectedTab")) : null;
    const fetchEmployees = () => {
        try {
            setLoading(true);
            let response = dispatch(getEmployees());
            response.then(({ data, message, success }) => {
                if (data !== undefined && data.length > 0) {
                    let updatedData = data.filter(item => {
                        if (selectedTab !== null && selectedTab.tab === "me") {
                            if (user !== null && item._id === user._id) {
                                return item;
                            }
                        } else {
                            if (user !== null && item.employmentInformation && item.employmentInformation.lineManager && item.employmentInformation.lineManager === user._id || item._id === user._id) {
                                return item;
                            }
                        }
                    }).map((item) => {
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
                        let findUser = nonduplicates.find(item => item.value === user._id);
                        setReviewForm((prevData) => ({ ...prevData, employeeName: findUser.value }))
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
            })
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
                    }
                })
                setFormsData(updatedData);
                setFormsDataManagerReview(updatedData);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
    }

    const getTemplateDetails = () => {
        try {
            setLoading(true);
            let response = dispatch(getTemplateById(reviewForm.templateId));
            response.then(({ data, message, success }) => {
                if (success) {
                    setTemplateInfo(data);
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
        if (reviewForm.employeeName !== "") {
            getUserDetailsById();
        }
        if (reviewForm.templateId !== "") {
            getTemplateDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewForm.employeeName]);
    useEffect(() => {
        if (employeeInfo.managerId !== "") {
            getManagerDetailsById();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeInfo.managerId]);
    const stepperStyles = {
        marginTop: "50px",
        '& .MuiStepConnector-alternativeLabel': { top: "10px" },
        '& .MuiStepLabel-label.Mui-active': {
            fontWeight: "550"
        },
        '& .Mui-completed': {
            fontWeight: "550"
        }
    }
    const handleNext = () => {
        const newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const steps = [
        { id: 1, label: `Idea Submission` },
        { id: 2, label: "Screening" },
        { id: 3, label: "Stage-1 Evaluation" },
        { id: 4, label: "Stage-2 Evaluation" },
        { id: 5, label: "Final Evaluation" },
    ];
    const handleSubmit = () => {
        setLoading(true);
        let status = "";
        switch (activeStep) {
            case 0:
                status = "Idea Submission";
                break;
            case 1:
                status = "Screening";
                break;
            case 2:
                status = "Stage-1 Evaluation";
                break;
            case 3:
                status = "Stage-2 Evaluation";
                break;
            default:
                status = "Final Evaluation";
                break;
        }
        reviewForm.status = status;
        if (activeStep === 0) {
            reviewForm.competencies = formsData.map(item => ({ ...item, type: "employee" }));
            reviewForm.managerId = employeeInfo.managerId;
            reviewForm.managerName = employeeInfo.manager;
            let response = dispatch(updateReviewForm(reviewForm._id, reviewForm));
            response.then(({ success, message }) => {
                if (success) {
                    setLoading(false);
                    let newActiveStep = activeStep + 1;
                    setActiveStep(newActiveStep);
                    getReviewById();
                } else {
                    setLoading(false);
                }
            });
        } else if (activeStep === 1) {
            let response = dispatch(updateReviewForm(reviewForm._id, reviewForm));
            response.then(({ success, message }) => {
                if (success) {
                    setLoading(false);
                    let newActiveStep = activeStep + 1;
                    setActiveStep(newActiveStep);
                    Toast({ type: "success", message: "Review Form Updated Successfully!", time: 5000 });
                    getReviewById();
                } else {
                    setLoading(false);
                }
            });
        } else {
            let response = dispatch(updateReviewForm(reviewForm._id, reviewForm));
            response.then(({ success, message }) => {
                if (success) {
                    setLoading(false);
                    let newActiveStep = activeStep + 1;
                    setActiveStep(newActiveStep);
                    getReviewById();
                } else {
                    setLoading(false);
                }
            });
        }
        history.push('/admin/reviews');
        queryClient.invalidateQueries("reviewsForm")
    }
    const handleCancel = () => {
        history.push('/admin/reviews');
    }

    const nonAllowed = ["Manager", "HR Admin", "Super Admin"];

    let isFullNameEnabled = templateInfo.displayOptions.length > 0 && templateInfo.displayOptions.find(item => item.value === "firstName").isChecked && templateInfo?.displayOptions.find(item => item.value === "lastName").isChecked;
    const fileInputRef = useRef(null);
    const isMobile = useWindowSize();


    let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
    const handleButtonClick = () => {
        // Trigger click event on file input
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // You can perform further actions with the selected file if needed
        setTask({
            ...task, attachments: selectedFile
        })
    };
    return (
        <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="head">Idea Submission</h1>
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
                            handleNext: handleNext
                        }}
                    />
                </div>
                <div className="mt-5">
                    <div className="d-flex justify-content-start">
                        <div style={{ width: '560px' }}>
                            <div className="row mt-4">
                                <label
                                    htmlFor="taskDescription"
                                    className={isMobile ? "m-0 p-0" : "col-md-4"}
                                    style={{ fontSize: '14px' }}
                                >
                                    Idea
                                </label>
                                <input
                                    id="taskDescription"
                                    className={`form-control col-md-8`}
                                    name="description"
                                    value={task.name}
                                    onChange={handleChange}
                                    style={{ borderRadius: '0px' }}
                                />
                            </div>
                            <div className="row mt-4">
                                <label
                                    htmlFor="taskDescription"
                                    className={isMobile ? "m-0 p-0" : "col-md-4"}
                                    style={{ fontSize: '14px' }}
                                >
                                    Idea Description
                                </label>
                                <textarea
                                    id="taskDescription"
                                    className={`form-control col-md-8`}
                                    rows="5"
                                    name="description"
                                    value={task.description}
                                    onChange={handleChange}
                                    style={{ borderRadius: '0px' }}
                                />
                            </div>
                            <div className="row mt-4">
                                <label
                                    htmlFor="taskDescription"
                                    className={isMobile ? "m-0 p-0" : "col-md-4"}
                                    style={{ fontSize: '14px' }}
                                >
                                    Benefit/Impact of idea
                                </label>
                                <textarea
                                    id="taskDescription"
                                    className={`form-control col-md-8`}
                                    rows="5"
                                    name="update"
                                    value={task.update}
                                    onChange={handleChange}
                                    style={{ borderRadius: '0px' }}
                                />
                            </div>
                            <div className="row mt-4" >
                                <label
                                    htmlFor="taskDescription"
                                    className={isMobile ? "col-md-4 m-0 p-0" : "col-md-4"}
                                    style={{ fontSize: '14px' }}
                                >
                                    Pitch Deck
                                </label>
                                <div className="d-flex col-md-8 row">
                                    <input
                                        type="text"
                                        placeholder=""
                                        id="title"
                                        className={`form-control searchBox text-dark fs14 ${isMobile ? "mr-1" : "col-md-9"
                                            }`}
                                        name="title"
                                        disabled={true}
                                        style={{ borderRadius: '0px' }}
                                        value={task.attachments?.name || ''}
                                    />
                                    <div className="col-md-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                        <button className="btn btn-primary ml-2" onClick={handleButtonClick}>Browse</button>
                                    </div>
                                </div>
                            </div>
                            {activeStep === 0 && <div className="d-flex justify-content-end mt-4 extraspacemargin">
                                <button className="btn btn-secondary" onClick={() => { }}>Cancel</button>
                                <button className="btn btn-primary ml-2" onClick={() => { setActiveStep(activeStep + 1) }}>{task.feed.length == 0 ? 'Submit' : 'Update'}</button>
                            </div>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="  p-0">
                            {isFullNameEnabled && <p>{reviewForm.employeeFullName} - &nbsp; </p>}
                        </div>
                        <div className="  p-0">
                            <p>{reviewForm.reviewPeriod}</p>

                        </div>
                    </div>
                </div>
                <div className="d-flex">

                    {activeStep > 0 && <div className="col-md-6">
                        {/* <div className="mt-2">
                            <p className="Comphead h4">Manager Competencies Review</p>
                        </div> */}
                        {(formsDataManagerReview).map((data, index) => (
                            <div className="mb-3" style={{ width: 550 }}>
                                <div className="col-12 p-0 mt-3 mb-3">
                                    <p className="">{data.competencyName}</p>
                                </div>
                                <div className="row mt-3 mb-3">
                                    <p className="feedback col-md-4 p-0 m-0">Feedback</p>
                                    <div className="col-md-8 p-0 m-0">
                                        <RatingComponent
                                            readonly
                                            value={data.Feedback}
                                            onChange={(event) => handleInputChange(event, index)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group  row p-0">
                                    <label
                                        htmlFor="taskDescription"
                                        className="taskdesc col-md-4 p-0 m-0"
                                    >
                                        Comments
                                    </label>
                                    <textarea
                                        id="Comments"
                                        className={`form-control col-md-8`}
                                        rows="5"
                                        name="update"
                                        value={task?.Comments}
                                        onChange={handleChange}
                                        style={{ borderRadius: '0px' }}
                                    />

                                </div>
                                {/* {activeStep == 0 && <div>
                                  <div className="buttons ">
                                      {(activeStep === 0 || (activeStep === 1 && (AuthUserId === employeeInfo.managerId)) || (activeStep === 2 && (AuthRole === "HR Admin" || AuthRole === "Manager")) || (activeStep === 3 && (AuthUserId === employeeInfo.managerId)) || (activeStep === 4 && !nonAllowed.includes(AuthRole))) && <Button
                                          text="Cancel"
                                          className="bg-white border-grey"
                                          handleClick={handleCancel}
                                      />}
                                      {activeStep === 0 && <Button
                                          text={"Submit to Manager"}
                                          className="bg-green border text-white"
                                          handleClick={handleSubmit}
                                      />}
                                      {activeStep === 1 && (AuthUserId === employeeInfo.managerId) && <Button
                                          text={"Submit to HR"}
                                          className="bg-green border text-white"
                                          handleClick={handleSubmit}
                                      />}
                                      {activeStep === 2 && (AuthRole === "HR Admin" || AuthRole === "Manager") && <Button
                                          text={"Submit to Manager SignOff"}
                                          className="bg-green border text-white"
                                          handleClick={handleSubmit}
                                      />}
                                      {activeStep === 3 && (AuthUserId === employeeInfo.managerId) && <Button
                                          text={"Submit to Employee Sign Off"}
                                          className="bg-green border text-white"
                                          handleClick={handleSubmit}
                                      />}
                                      {activeStep === 4 && !nonAllowed.includes(AuthRole) && <Button
                                          text={"Sign Off To Complete"}
                                          className="bg-green border text-white"
                                          handleClick={handleSubmit}
                                      />}
                                  </div>
                              </div>} */}
                            </div>
                        ))}
                        {activeStep > 0 && <div className="d-flex justify-content-center mt-3 extraspacemargin" style={{marginRight:'20px'}}>
                            <button className="btn btn-secondary" onClick={() => { }}>Cancel</button>
                            <button className="btn btn-primary ml-2" onClick={() => { setActiveStep(activeStep + 1) }}>{task.feed.length == 0 ? 'Submit' : 'Update'}</button>
                        </div>}
                    </div>}

                    {activeStep > 0 && <div className="">
                        {reviewForm.competencies.filter(item => item.type === "employee").map((data, index) => (
                            <div className="mb-3" style={{ width: 550 }}>
                                <div className="col-12 p-0 mt-3 mb-3">
                                    <p className="">{data.competencyName}</p>
                                </div>
                                <div className="row mt-3 mb-3">
                                    <p className="feedback col-md-4">Feedback</p>
                                    <div className="col-md-8">
                                        <RatingComponent
                                            readonly
                                            value={data.Feedback}
                                            onChange={(event) => handleInputChange(event, index)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group  row p-0">
                                    <label
                                        htmlFor="taskDescription"
                                        className="taskdesc col-md-4"
                                    >
                                        Comments
                                    </label>
                                    <textarea
                                        id="Comments"
                                        className={`form-control col-md-8`}
                                        rows="5"
                                        name="update"
                                        value={task?.Comments}
                                        onChange={handleChange}
                                        style={{ borderRadius: '0px' }}
                                    />

                                </div>
                                {/* {activeStep == 0 && <div>
                                    <div className="buttons ">
                                        {(activeStep === 0 || (activeStep === 1 && (AuthUserId === employeeInfo.managerId)) || (activeStep === 2 && (AuthRole === "HR Admin" || AuthRole === "Manager")) || (activeStep === 3 && (AuthUserId === employeeInfo.managerId)) || (activeStep === 4 && !nonAllowed.includes(AuthRole))) && <Button
                                            text="Cancel"
                                            className="bg-white border-grey"
                                            handleClick={handleCancel}
                                        />}
                                        {activeStep === 0 && <Button
                                            text={"Submit to Manager"}
                                            className="bg-green border text-white"
                                            handleClick={handleSubmit}
                                        />}
                                        {activeStep === 1 && (AuthUserId === employeeInfo.managerId) && <Button
                                            text={"Submit to HR"}
                                            className="bg-green border text-white"
                                            handleClick={handleSubmit}
                                        />}
                                        {activeStep === 2 && (AuthRole === "HR Admin" || AuthRole === "Manager") && <Button
                                            text={"Submit to Manager SignOff"}
                                            className="bg-green border text-white"
                                            handleClick={handleSubmit}
                                        />}
                                        {activeStep === 3 && (AuthUserId === employeeInfo.managerId) && <Button
                                            text={"Submit to Employee Sign Off"}
                                            className="bg-green border text-white"
                                            handleClick={handleSubmit}
                                        />}
                                        {activeStep === 4 && !nonAllowed.includes(AuthRole) && <Button
                                            text={"Sign Off To Complete"}
                                            className="bg-green border text-white"
                                            handleClick={handleSubmit}
                                        />}
                                    </div>
                                </div>} */}
                            </div>

                        ))}
                        {/* <div className="col-12 p-0">
                            <a href={reviewForm.attachment} target="_blank" rel="noopener noreferrer" className="col-12 p-0">View Attachment</a>
                        </div> */}
                    </div>}
                </div>
                {(activeStep === 3 || activeStep === 4) && <div className="m-3">
                    <p>{AuthUser.name}</p>
                    <p>{window.moment(new Date()).format("YYYY-MM-DD")}</p>
                </div>}
            </div>

        </div>
    )
}
