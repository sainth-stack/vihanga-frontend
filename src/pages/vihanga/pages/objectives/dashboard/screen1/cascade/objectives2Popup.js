/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { Col, Row } from "react-bootstrap";
import SelectInput from "components/Company/SelectInput";
import { getKeyResults } from "action/keyResultAct";
import { useDispatch } from "react-redux";
import { getObjectives } from "action/UserAct";
import { LoadingIndicator, removeDuplicates } from "utilities";
import TextInput from "components/Company/TextInput";
import { useTranslation } from "react-i18next";

const Objectives2Popup = (props) => {
  const [, setLoading] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [keyResults, setKeyResults] = useState([]);
  const [keyResults2, setKeyResults2] = useState([]);
  
  // Extract objective IDs from selected objectives
  const extractObjectiveIdsFromSelectedObjectives = (selectedObj) => {
    
    if (!selectedObj) return [];
    
    let objectiveIds = [];
    
    // Handle both single object and array
    const objectivesArray = Array.isArray(selectedObj) ? selectedObj : [selectedObj];
    
    objectivesArray.forEach((objective) => {
      
      // Extract objective ID from the objective data
      const objectiveId = objective.objectiveId || objective.id || objective._id;
      if (objectiveId) {
        objectiveIds.push(objectiveId);
      }
    });
    
    return objectiveIds;
  };
  
  const [keyResultsData, setKeyResultsData] = useState([]);
  const [selectedKeyResults, setSelectedKeyResults] = useState([]);
  const [, setError] = useState(false);
  const dispatch = useDispatch();

  // Update keyResultsData when props.selectedObjective changes
  useEffect(() => {
    const objectiveIds = extractObjectiveIdsFromSelectedObjectives(props.selectedObjective);
    if (objectiveIds.length > 0) {
      fetchKeyResultsForObjectives(objectiveIds);
    } else {
      setKeyResultsData([]);
      setKeyResults([]);
    }
  }, [props.selectedObjective]);

  useEffect(() => {
    // Only fetch data when the component is actually shown (props.show is true)
    if (props.show) {
      // Initialize with extracted objective IDs and fetch key results
      const objectiveIds = extractObjectiveIdsFromSelectedObjectives(props.selectedObjective);
      if (objectiveIds.length > 0) {
        fetchKeyResultsForObjectives(objectiveIds);
      }
    }
    //eslint-disable-next-line
  }, [props.show, props.selectedObjective]);

  const fetchKeyResultsForObjectives = (objectiveIds) => {
    if (!objectiveIds || objectiveIds.length === 0) {
      return;
    }
    
    try {
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          
          // Filter key results based on objective IDs
          const filteredKeyResults = data.filter((keyResult) => {
            const matchesObjective = objectiveIds.includes(keyResult.objectiveId);
            return matchesObjective;
          });
          
          // Transform the data for display and create initial keyResultsData
          const transformedKeyResults = filteredKeyResults.map((keyResult) => ({
            keyResultId: keyResult._id,
            keyResultName: keyResult.keyResultName,
            weight: keyResult.weight || 0,
            objectiveId: keyResult.objectiveId,
            objectiveName: keyResult.objectiveName || "N/A",
            description: keyResult.dimension || keyResult.description,
            progress: keyResult.percent || 0,
            dueDate: keyResult.targetDate,
            owner: keyResult.owner,
            ownerName: keyResult.ownerName,
            status: keyResult.status,
            isAlignedToCompany: keyResult.isAlignedToCompany
          }));
          
          setKeyResultsData(transformedKeyResults);
          setKeyResults2(data);
          
          // Create dropdown options for SelectInput - show all key results
          const allDropdownOptions = data.map((kr) => ({
            key: kr.keyResultName,
            value: kr._id,
            ...kr
          }));
          setKeyResults(allDropdownOptions);
          
          // Set the filtered key results as default selected
          setKeyResultsData(transformedKeyResults);
          
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



  const SubmitData = () => {
    
    let resultKeyResults = keyResultsData.map((singleItem) => {
      let requestBody = {
        employeeName: singleItem.ownerName || singleItem.owner,
        okrPeriod: "Q1", // Default value, can be updated if available
        okrYear: new Date().getFullYear().toString(),
        objective: singleItem.keyResultName, // Using keyResultName as objective
        dueDate: singleItem.dueDate,
        owner: singleItem.owner,
        successMetrics: singleItem.description || "N/A",
        progressStatus: singleItem.progress || 0,
        feedAttachment: "",
        comments: "",
        employeeReferenceId: singleItem.owner || "N/A",
        dimension: singleItem.description || "N/A",
        weight: singleItem.weight || 0,
        keyResults: [], // No nested key results when cascading key results as objectives
        objId: singleItem.keyResultId,
        isAlignedToCompany: singleItem.isAlignedToCompany || "Yes",
      };
      return requestBody;
    });
    
    props.handleSaveData2(resultKeyResults);
  };

  const handleChange = ({ target: { name, value } }, index) => {
    if (!keyResultsData || keyResultsData.length === 0) return;
    
    let updatedData = [...keyResultsData];
    
    if (name === "keyResultId") {
      // Find the selected key result from all key results
      const selectedKeyResult = keyResults2.find(kr => kr._id === value);
      if (selectedKeyResult) {
        updatedData[index] = {
          keyResultId: selectedKeyResult._id,
          keyResultName: selectedKeyResult.keyResultName,
          weight: updatedData[index].weight || 0,
          objectiveId: selectedKeyResult.objectiveId,
          objectiveName: selectedKeyResult.objectiveName || "N/A",
          description: selectedKeyResult.dimension || selectedKeyResult.description,
          progress: selectedKeyResult.percent || 0,
          dueDate: selectedKeyResult.targetDate,
          owner: selectedKeyResult.owner,
          ownerName: selectedKeyResult.ownerName,
          status: selectedKeyResult.status,
          isAlignedToCompany: selectedKeyResult.isAlignedToCompany
        };
      }
    } else {
      updatedData[index][name] = value;
    }
    
    setKeyResultsData(updatedData);
    SubmitData();
  };

  const { t } = useTranslation();
  return (
    <div>
      <h5 className="m-3">
        {t("OKR Details.Cascade Key Result As Objective")}
      </h5>
      <div className="mt-3 mb-3">
        {keyResultsData.length === 0 ? (
          <div className="text-center">
            <p>No key results found for selected objectives.</p>
          </div>
        ) : keyResultsData.length > 0 ? (
          keyResultsData.map((keyResult, index) => {
            return (
              <Row className="mb-2" key={index}>
                <Col>
                  <SelectInput
                    label={t("OKR Details.Key Results")}
                    index={index}
                    placeholder="--Select--"
                    name="keyResultId"
                    options={keyResults}
                    value={keyResult.keyResultId}
                    onChangeText={handleChange}
                  />
                  <small className="text-muted">
                    Default: {keyResult.keyResultName} (from objective: {keyResult.objectiveName})
                  </small>
                </Col>
                <Col>
                  <div>
                    <TextInput
                      dateType="Number"
                      label={t("OKR Details.Weight")}
                      value={keyResult.weight}
                      placeholder="Enter between 1 to 100"
                      name="weight"
                      index={index}
                      onChangeText={(e) => handleChange(e, index)}
                    />
                  </div>
                </Col>
              </Row>
            );
          })
        ) : (
          <div className="text-center">
            <LoadingIndicator size={3} />
            <p>Loading Key Results...</p>
          </div>
        )}
      </div>
      <div className="buttons"></div>
    </div>
  );
};

export default Objectives2Popup;
