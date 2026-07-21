import { getAllReviewsForm, updateReviewFormMultiple } from 'action/ReviewFormAct';
import { getSessionById } from 'action/SessionAct';
import { getAllTemplates } from 'action/TemplatesAct';
import Button from 'components/Company/Button';
import SelectInput from 'components/Company/SelectInput';
import { BinChart } from 'components/DashboardComponents/BinChart'
import Calibration from 'pages/Reviews/Calibration'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingIndicator } from 'utilities';
import { canEdit } from "utilities/privilegeHelper";

export default function SessionCalibration() {
  const { id } = useParams();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setRefreshed] = useState(true);
  const [status, setStatus] = useState("HR Review");
  const dispatch = useDispatch();
  const [refreshData, setRefreshData] = useState(false)
  const [templateInfo, setTemplateInfo] = useState({
    templateName: "",
  });
  const [ratingInfo, setRatingInfo] = useState({
    overallFormRating: [],
    templateName: "",
    ratingLabels: [],
    ratingValues: [],
    empPercentages: [],
    ratingNumbers: [],
    employees: []
  });
  const [sessionInfo, setSessionInfo] = useState({
    templateName: "",
    sessionName: "",
    employees: [],
    performance: []
  });
  
  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data?.map(item => ({ key: item?.templateName, value: item?._id })) || [];
        setTemplates(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  const getSingleSession = () => {
    setLoading(true);
    let response = dispatch(getSessionById(id));
    response.then(({ success, message, data }) => {
      if (success) {
        setSessionInfo(data || {});
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  const getOverallRating = () => {
    let findRating = sessionInfo?.performance?.length > 0 ? sessionInfo.performance.filter(item => item?.templateName === templateInfo?.templateName) : [];
    console.log(findRating,'ampl111')
    if (findRating?.length > 0) {
      let ratingLabels = findRating[0]?.overallFormRating?.map(item => item?.ratingLabel ? item.ratingLabel : item?.rating) || [];
      let ratingNumbers = findRating[0]?.overallFormRating?.map(item => item?.rating) || [];
      let ratingValues = findRating[0]?.overallFormRating?.map(item => item?.distribution) || [];
      console.log(ratingLabels,ratingNumbers,ratingValues,'ampl2222')
      setRatingInfo({ ...ratingInfo, ...findRating[0], ratingLabels, ratingValues, ratingNumbers });
    }
  }

  const getReviewForms = () => {
    setLoading(true);
    let response = dispatch(getAllReviewsForm());
    response.then(({ success, message, data }) => {
      if (success) {
        let filteredEmployees = data?.filter((item) => {
          return sessionInfo?.employees?.includes(item?.employeeName) && templateInfo?.templateName === item?.templateId;
        }) || [];
        
        let groupByRatings = ratingInfo?.ratingNumbers?.map(item => {
          let filtered = filteredEmployees.filter(emp => Number(Math.round(emp?.managersRating)).toFixed(2) === Number(item).toFixed(2));
          let formattedEmployees = filtered.map((emp, index) => ({
            ...emp,
            id: index + 1,
            name: emp?.employeeFullName,
            overallRating: item,
          }))
          let employeeLength = filtered?.length || 0;
          return { rating: item, numberOfRatings: employeeLength, employees: formattedEmployees }
        }) || [];
        
        let totalEmployees = sessionInfo?.employees?.length || 0;
        let groupByPercentages = groupByRatings.map(item => {
          let percentage = Number((Number(item?.numberOfRatings || 0) / Number(totalEmployees || 1)) * 100).toFixed(2);
          return {
            ...item,
            percentage
          }
        })
        
        let result = {
          totalEmployees: sessionInfo?.employees?.length || 0,
          groupByRatings: groupByRatings.map(item => item?.numberOfRatings || 0),
          empPercentages: groupByPercentages.map(item => item?.percentage || "0.00"),
          employees: groupByRatings.reduce((acc, item) => [...acc, ...(item?.employees || [])], [])
        }
        setRatingInfo({ ...ratingInfo, ...result })
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  }

  useEffect(() => {
    getTemplates();
    getSingleSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  
  useEffect(() => {
    getOverallRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateInfo?.templateName, refreshData])
  
  useEffect(() => {
    if (ratingInfo?.ratingNumbers?.length > 0) {
      getReviewForms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingInfo?.ratingNumbers])
  
  useEffect(() => {
    if (ratingInfo?.employees?.length > 0) {
      if (ratingInfo.employees.filter(item => item?.status === "HR Review")?.length > 0) {
        setStatus("HR Review");
      } else {
        setStatus("Manager SignOff");
      }
    }
  }, [ratingInfo?.employees])
  
  const handleSubmit = () => {
    setLoading(true);
    let employeesData = ratingInfo?.employees?.map(item => ({
      _id: item?._id,
      status: "Manager SignOff",
    })) || [];
    
    let response = dispatch(updateReviewFormMultiple({ data: employeesData }));
    response.then(({ success, message, data }) => {
      if (success) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  return (
    <div className='p-3'>
      <h3>Calibration</h3>
      {loading ? <LoadingIndicator /> :
        <>
          <SelectInput
            placeholder="Please select a template..."
            name="templateName"
            options={templates}
            value={templateInfo?.templateName || ""}
            onChangeText={handleInput}
          />
          {ratingInfo?.ratingLabels?.length > 0 && isRefreshed && (
            <BinChart 
              ratingLabels={ratingInfo.ratingLabels} 
              values={ratingInfo.ratingValues} 
              empPercentages={ratingInfo.empPercentages} 
            />
          )}
          {ratingInfo?.employees?.length > 0 && (
            <Calibration 
              employeesData={ratingInfo.employees} 
              ratingLabels={ratingInfo.ratingLabels} 
              setRefreshed={setRefreshed} 
              status={status} 
              setRefreshData={setRefreshData}
            />
          )}
          {ratingInfo?.employees?.length > 0 && status === "HR Review" && canEdit() && (
            <div className='container d-flex justify-content-end'>
              <Button
                text={`Move to manager sign off`}
                className="bg-green border text-white"
                handleClick={handleSubmit}
              />
            </div>
          )}
        </>
      }
    </div>
  )
}