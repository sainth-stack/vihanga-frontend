/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { Col, Row } from "react-bootstrap";
import SelectInput from "components/Company/SelectInput";
import { useDispatch } from "react-redux";
import { LoadingIndicator, removeDuplicates } from "utilities";
import TextInput from "components/Company/TextInput";
import { getObjectives } from "action/GoalsAct";
import { t } from "i18next";
const Objectives1Popup = (props) => {
  const [, setLoading] = useState(false);
  const [objectivesData, setObjectivesData] = useState(
    props.selectedObjective
      ? props.selectedObjective
      : [
          {
            objectiveId: "",
            weight: "",
          },
        ]
  );
  const [objectives, setObjectives] = useState(
    props.objectives ? props.objectives : []
  );
  const [, setError] = useState(false);
  const SubmitData = () => {
    let resultObjectives = objectivesData.map((singleItem) => {
      let filteredObjective = objectives.filter(
        (item) => item.value === singleItem.objectiveId
      );
      if (filteredObjective.length > 0) {
        let selectedData = filteredObjective[0];
        let requestBody = {
          employeeName: selectedData.employeeName,
          okrPeriod: selectedData.okrPeriod,
          okrYear: selectedData.okrYear,
          objective: selectedData.objective,
          dueDate: selectedData.dueDate,
          owner: selectedData.owner,
          successMetrics: selectedData.successMetrics,
          progressStatus: selectedData.progressStatus,
          feedAttachment: selectedData.feedAttachment,
          comments: selectedData.comments,
          employeeReferenceId: selectedData.employeeReferenceId,
          dimension: selectedData.dimension,
          weight: singleItem.weight,
          uom: selectedData.uom,
          polarity: selectedData.polarity,
          target: selectedData.target,
          actual: selectedData.actual,
          targetDate: selectedData.targetDate,
          actualDate: selectedData.actualDate,
        };
        return requestBody;
      }
    });
    props.handleSaveData(resultObjectives);
  };
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
            SubmitData();
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
  };
  const handleChange = ({ target: { name, value } }, index) => {
    let updatedData = [...objectivesData];
    updatedData[index][name] = value;
    setObjectivesData(updatedData);
    SubmitData();
  };
  useEffect(() => {
    fetchObjectives();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="mt-3 mb-3">
        <h5 className="m-3">{t("OKR Details.Objective Cascade")}</h5>
        {objectives.length > 0 ? (
          objectivesData.map((objective, index) => (
            <Row className="mb-2" key={index}>
              <Col>
                <SelectInput
                  key={index}
                  label={t("OKR Details.Objectives")}
                  placeholder="--Select--"
                  name="objectiveId"
                  index={index}
                  options={objectives}
                  value={objective.objectiveId}
                  onChangeText={handleChange}
                />
              </Col>
              <Col>
                <div>
                  <TextInput
                    key={index}
                    dateType="Number"
                    label={t("OKR Details.Weight")}
                    index={index}
                    value={objective.weight}
                    placeholder="Enter between 1 to 100"
                    name="weight"
                    onChangeText={(e) => handleChange(e, index)}
                  />
                </div>
              </Col>
            </Row>
          ))
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

export default Objectives1Popup;
