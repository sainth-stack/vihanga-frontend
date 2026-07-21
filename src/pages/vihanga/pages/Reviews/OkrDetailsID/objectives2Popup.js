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
  const [objectivesData, setObjectivesData] = useState(props.selectedObjective);
  const [, setSelectedObjective] = useState({
    objectiveId: props.selectedObjective[0].objectiveId,
    weight: props.selectedObjective[0].weight,
  });
  const [selectedKeyResults, setSelectedKeyResults] = useState([]);

  const [, setError] = useState(false);

  const dispatch = useDispatch();
  const fetchObjectives = () => {
    try {
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let userData =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      if (user !== null) {
        let response = dispatch(getObjectives(user.role, userData.ownerId));
        response.then(({ data, message }) => {
          if (data !== undefined && data.length > 0) {
            let updatedData = data.map((item) => {
              return { key: item.objective, value: item._id, ...item };
            });
            let nonduplicate = removeDuplicates(updatedData, "value");
            setObjectives(nonduplicate);
            setLoading(false);
            setError("");
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
    fetchKeyResults();
  };
  const fetchKeyResults = () => {
    try {
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((item) => {
            return { key: item.keyResultName, value: item._id };
          });
          if (objectivesData) {
            let resultObjectives = objectivesData.map((objective) => {
              let finalKeyResults = data.filter(function (item) {
                return item.objectiveId === objective.objectiveId;
              });
              let updatedData2 = finalKeyResults.map((item) => {
                return { key: item.keyResultName, value: item._id };
              });
              let nonduplicate = removeDuplicates(updatedData2, "value");
              return nonduplicate;
            });
            setKeyResults(resultObjectives);
            setSelectedKeyResults(resultObjectives);
          } else {
            let nonduplicate = removeDuplicates(updatedData, "value");
            setKeyResults(nonduplicate);
          }
          setKeyResults2(data);
          setLoading(false);
          setError("");
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
  const handleChange = ({ target: { name, value } }, index) => {
    let updatedData = [...objectivesData];
    updatedData[index][name] = value;
    setObjectivesData(updatedData);
    let finalKeyResults = keyResults2.filter(function (item) {
      return item.objectiveId === updatedData[index].objectiveId;
    });
    let updatedData2 = finalKeyResults.map((item) => {
      return { key: item.keyResultName, value: item._id };
    });
    let updateData3 = [...keyResults];
    updateData3[index] = updatedData2;
    setKeyResults(updateData3);

    setSelectedObjective(updatedData);
  };
  const handleChange2 = ({ target: { name, value } }, index) => {
    let updatedData = [...selectedKeyResults];
    let keyIndex = updatedData[index].findIndex((item) => item.value === value);
    updatedData[index] = updatedData[index].map((item) => {
      return { key: item.key, value: item.value };
    });
    updatedData[index][keyIndex][name] = value;
    setSelectedKeyResults(updatedData);
    let resultObjectives = objectivesData.map((singleItem, indexObj) => {
      let filteredObjective = objectives.filter(
        (item) => item.value === singleItem.objectiveId
      );
      let keyResultSelected = keyResults[index].filter(
        (item) => item.value === updatedData[index][keyIndex].value
      );
      if (
        filteredObjective.length > 0 &&
        keyResultSelected.length > 0 &&
        indexObj === index
      ) {
        let selectedData = filteredObjective[0];
        let selectedKeyResult = keyResultSelected[0];
        let requestBody = {
          employeeName: selectedData.employeeName,
          okrPeriod: selectedData.okrPeriod,
          okrYear: selectedData.okrYear,
          objective: selectedKeyResult.key,
          dueDate: selectedData.dueDate,
          owner: selectedData.owner,
          successMetrics: selectedData.successMetrics,
          progressStatus: selectedData.progressStatus,
          feedAttachment: selectedData.feedAttachment,
          comments: selectedData.comments,
          employeeReferenceId: selectedData.employeeReferenceId,
          weight: objectivesData[index].weight,
          objectId: selectedData._id,
        };
        //return requestBody;
        let selectedKeyResultData =
          localStorage.getItem("selectedKeyResultData") !== null
            ? JSON.parse(localStorage.getItem("selectedKeyResultData"))
            : null;
        if (selectedKeyResultData !== null) {
          let updatedKeyResults = [...selectedKeyResultData];
          if (
            updatedKeyResults.filter(
              (item) => item.objectId === singleItem.objectiveId
            ).length > 0
          ) {
            let findIndex = updatedKeyResults.findIndex(
              (item) => item.objectId === singleItem.objectiveId
            );
            updatedKeyResults[findIndex] = requestBody;
          } else {
            updatedKeyResults.push(requestBody);
          }
          localStorage.setItem(
            "selectedKeyResultData",
            JSON.stringify(updatedKeyResults)
          );
        } else {
          let updatedKeyResults = [requestBody];
          localStorage.setItem(
            "selectedKeyResultData",
            JSON.stringify(updatedKeyResults)
          );
        }
      }
    });
    let selectedKeyResultData =
      localStorage.getItem("selectedKeyResultData") !== null
        ? JSON.parse(localStorage.getItem("selectedKeyResultData"))
        : null;
    props.handleSaveData2(selectedKeyResultData);
  };
  useEffect(() => {
    fetchObjectives();
    localStorage.setItem("selectedKeyResultData", JSON.stringify([]));
    //eslint-disable-next-line
  }, []);

  const { t } = useTranslation();
  return (
    <div>
      <h5 className="m-3">
        label={t("OKR Details.Cascade Key Result As Objective")}
      </h5>
      <div className="mt-3 mb-3">
        {objectives.length > 0 &&
        objectivesData.length > 0 &&
        keyResults.length > 0 ? (
          objectivesData.map((objective, index) => {
            return (
              <Row className="mb-2" key={index}>
                <Col>
                  <SelectInput
                    label={t("OKR Details.Objectives")}
                    index={index}
                    placeholder="--Select--"
                    name="objectiveId"
                    options={objectives}
                    value={objective.objectiveId}
                    onChangeText={handleChange}
                  />
                </Col>
                <Col>
                  <div className="key5" style={"z-index:1"}>
                    <SelectInput
                      label={t("OKR Details.Keyresults")}
                      placeholder="--Select--"
                      name="keyResultsId"
                      index={index}
                      options={
                        keyResults.length > 0 ? keyResults[index] : keyResults
                      }
                      value={
                        selectedKeyResults.length > 0 &&
                        selectedKeyResults[index].findIndex(
                          (item) => item.keyResultsId !== undefined
                        ) >= 0
                          ? selectedKeyResults[index][
                              selectedKeyResults[index].findIndex(
                                (item) => item.keyResultsId !== undefined
                              )
                            ].keyResultsId
                          : ""
                      }
                      onChangeText={(e) => {
                        handleChange2(e, index);
                      }}
                    />
                  </div>
                </Col>
                <Col>
                  <div>
                    <TextInput
                      dateType="Number"
                      label={t("OKR Details.Weight")}
                      value={objective.weight}
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
            <p>Loading Objectives...</p>
          </div>
        )}
      </div>
      <div className="buttons"></div>
    </div>
  );
};

export default Objectives2Popup;
