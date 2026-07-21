/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./popup.scss";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { LoadingIndicator, removeDuplicates } from "utilities";
import { createObjectives, getAllOkrLibrary } from "action/OKRLibraryAct";
import { useDispatch } from "react-redux";
import ExpandTree from "./ExpandTree";
import { Toast } from "service/toast";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    const row = data[i] || {};
    const objectiveKeyResultsArray = Array.isArray(row.objectiveKeyResults)
      ? row.objectiveKeyResults
      : [];
    items.push({
      id: i + 1,
      _id: row._id,
      okrIndustry: row.okrIndustry,
      objectiveKeyResults: objectiveKeyResultsArray.map((item) => {
        const obj = { ...item, isSelected: false };
        const keyResultsArray = Array.isArray(obj.keyResults)
          ? obj.keyResults
          : [];
        obj.keyResults = keyResultsArray.map((itemm) => ({
          ...itemm,
          isSelected: false,
        }));
        return obj;
      }),
      isActive: row.isActive,
      exportOKRLibrary: row.exportOKRLibrary,
      updatedAt: window.moment(row.updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

const PopupOKRLibrary = (props) => {
  const [, setObjectives] = useState([]);
  const [okrFunction, setOKRFunction] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useWindowSize();

  const [okrFunctions, setOkrFunctions] = useState([]);
  const handleSave = () => {
    if (data.length > 0) {
      let employee =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      let okrPeriod =
        localStorage.getItem("okrPeriod") !== null
          ? JSON.parse(localStorage.getItem("okrPeriod")).okrPeriod
          : null;
      let okrYear =
        localStorage.getItem("okrYear") !== null
          ? JSON.parse(localStorage.getItem("okrYear")).okrYear
          : null;
      let allObjectives = [];
      let objectives = data.map((obj) => {
        let objj = { ...obj, type: (obj.type || "").toLowerCase() };
        objj.keyResults = Array.isArray(objj.keyResults)
          ? objj.keyResults.map((keyResult) => ({
              ...keyResult,
              objective: obj.name,
            }))
          : [];
        return objj;
      });
      allObjectives = [...objectives];
      let updatedObjectives = allObjectives.filter((obj) => obj.isSelected);
      updatedObjectives = updatedObjectives.map((item) => {
        let obj = { ...item };
        obj.keyResults =
          obj.keyResults.filter((keyResult) => keyResult.isSelected).length > 0
            ? obj.keyResults
                .filter((keyResult) => keyResult.isSelected)
                .map((kr) => ({
                  ...kr,
                  type: (kr.type || "").toLowerCase(),
                  tasks: Array.isArray(kr.tasks)
                    ? kr.tasks
                        .filter((task) => task.isSelected)
                        .map((task) => ({
                          ...task,
                          type: (task.type || "").toLowerCase(),
                        }))
                    : [],
                }))
            : [];
        return obj;
      });
      const finalData = {
        employeeName: employee.ownerName,
        okrPeriod: okrPeriod,
        okrYear: okrYear,
        owner: employee.ownerName,
        employeeReferenceId: employee.ownerId,
        objectiveKeyResults: updatedObjectives,
        dimension: data[0].okrCategory,
      };
      setLoading(true);
      let response = dispatch(createObjectives(finalData));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          props.onHide();
          window.location.reload();
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } else {
      Toast({
        type: "warning",
        message: "Please select at least one function",
        time: 4000,
      });
    }
  };
  const getOKRLibraryData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllOkrLibrary());
      response.then(({ data, message }) => {
        if (Array.isArray(data) && data.length > 0) {
          let okrFunctionsDatas = [];
          data.forEach((item) => {
            const objs = Array.isArray(item?.objectiveKeyResults)
              ? item.objectiveKeyResults
              : [];
            objs.forEach((itemm) => {
              const key = { ...itemm, isSelected: false };
              okrFunctionsDatas.push(key);
            });
          });
          
          // Restructure data to group KRs and Tasks under their corresponding Objectives and KRs
          let structuredData = [];

          // First, get all objectives
          let objectives = okrFunctionsDatas.filter(
            (item) => item.type === "obj" || item.type === "Obj"
          );

          // Then group key results under their corresponding objectives
          objectives.forEach((objective) => {
            let keyResults = okrFunctionsDatas.filter(
              (item) =>
                (item.type === "kr" || item.type === "Kr") &&
                item.objectiveID === objective.objectiveID
            );

            structuredData.push({
              ...objective,
              keyResults: keyResults.map((kr) => {
                // Find tasks for this KR
                const tasks = okrFunctionsDatas
                  .filter(
                    (task) =>
                      (task.type === "task" || task.type === "Task") &&
                      task.keyresultID === kr.keyresultID
                  )
                  .map((t) => ({ ...t, isSelected: false }));

                return {
                  ...kr,
                  isSelected: false,
                  tasks,
                };
              }),
            });
          });
          
          console.log("structuredData", structuredData);
          setData(structuredData);
          
          let okrFunctionsData = [];
          data.forEach((item) => {
            const objs = Array.isArray(item?.objectiveKeyResults)
              ? item.objectiveKeyResults
              : [];
            objs.forEach((itemm) => {
              const key = {
                key: itemm?.okrFunction,
                value: itemm?.okrFunction,
                isSelected: false,
              };
              okrFunctionsData.push(key);
            });
          });
          let nonduplicate2 = removeDuplicates(okrFunctionsData, "value");
          const filtered = nonduplicate2.filter((item) => !!item.value);
          let sortedData = filtered.sort((a, b) => {
            const aKey = (a.key || "").trim();
            const bKey = (b.key || "").trim();
            return (aKey > bKey) - (aKey < bKey);
          });
          setOkrFunctions(sortedData);
          setLoading(false);
          setError("");
        } else if (Array.isArray(data) && data.length === 0) {
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
  useEffect(() => {
    getOKRLibraryData();
  }, [okrFunction]);

  const handleInputChange = (okrFunction, index) => {
    let okrFunctionsUpdated = [...okrFunctions];
    okrFunctionsUpdated[index].isSelected =
      !okrFunctionsUpdated[index].isSelected;
    setOkrFunctions(okrFunctionsUpdated);
    let okrObjectivesUpdated = data.map((item) => {
      if (item.okrFunction === okrFunction) {
        let obj = {
          ...item,
          isSelected: okrFunctionsUpdated[index].isSelected,
        };
        const keyResultsArray = Array.isArray(obj.keyResults)
          ? obj.keyResults
          : [];
        obj.keyResults = keyResultsArray.map((itemm) => ({
          ...itemm,
          isSelected: okrFunctionsUpdated[index].isSelected,
          tasks: Array.isArray(itemm.tasks)
            ? itemm.tasks.map((task) => ({
                ...task,
                isSelected: okrFunctionsUpdated[index].isSelected,
              }))
            : [],
        }));
        return obj;
      } else {
        return item;
      }
    });
    setData(okrObjectivesUpdated);
  };

  const handleInputChangeObjectives = (okrFunction, index) => {
    let okrFunctionsUpdated = [...data];
    okrFunctionsUpdated[index].isSelected =
      !okrFunctionsUpdated[index].isSelected;
    const keyResultsArray = Array.isArray(okrFunctionsUpdated[index].keyResults)
      ? okrFunctionsUpdated[index].keyResults
      : [];
    let okrKeyResultsUpdated = keyResultsArray.map((item) => ({
      ...item,
      isSelected: okrFunctionsUpdated[index].isSelected,
      tasks: Array.isArray(item.tasks)
        ? item.tasks.map((task) => ({
            ...task,
            isSelected: okrFunctionsUpdated[index].isSelected,
          }))
        : [],
    }));
    okrFunctionsUpdated[index].keyResults = okrKeyResultsUpdated;
    setData(okrFunctionsUpdated);
  };
  const handleInputChangeKeyResults = (okrFunction, index, index1) => {
    let okrFunctionsUpdated = [...data];
    let objId = okrFunctionsUpdated[index].objectiveID;
    let findObjIndex = okrFunctionsUpdated.findIndex(
      (item) => item.objectiveID === objId
    );
    let okrObjectivesUpdated = Array.isArray(okrFunctionsUpdated[index].keyResults)
      ? [...okrFunctionsUpdated[index].keyResults]
      : [];
    let filteredData = okrObjectivesUpdated.filter((item) => item.isSelected);
    if (filteredData.length === 0) {
      okrFunctionsUpdated[findObjIndex].isSelected = true;
    }
    okrObjectivesUpdated[index1].isSelected =
      !okrObjectivesUpdated[index1].isSelected;
    // Toggle tasks selection along with KR selection
    const krTasks = Array.isArray(okrObjectivesUpdated[index1].tasks)
      ? okrObjectivesUpdated[index1].tasks.map((task) => ({
          ...task,
          isSelected: okrObjectivesUpdated[index1].isSelected,
        }))
      : [];
    okrObjectivesUpdated[index1].tasks = krTasks;
    okrFunctionsUpdated[index].keyResults = okrObjectivesUpdated;
    setData(okrFunctionsUpdated);
  };

  const handleInputChangeTasks = (okrFunction, index, index1, index2) => {
    let okrFunctionsUpdated = [...data];
    const objective = okrFunctionsUpdated[index];
    const keyResult = objective.keyResults[index1];
    const tasksArray = Array.isArray(keyResult.tasks)
      ? [...keyResult.tasks]
      : [];

    // Toggle selection for a specific task
    tasksArray[index2].isSelected = !tasksArray[index2].isSelected;

    // If any task is selected, ensure KR and Objective are selected
    const hasAnyTaskSelected = tasksArray.some((t) => t.isSelected);
    if (hasAnyTaskSelected) {
      keyResult.isSelected = true;
      objective.isSelected = true;
    }

    okrFunctionsUpdated[index].keyResults[index1].tasks = tasksArray;
    setData(okrFunctionsUpdated);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        style={{
          background: "#F5F5F6",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.17)",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ paddingTop: "10px", paddingLeft: "20px" }}
        >
          {t("objectives.Create_objectives_and_key_results")}
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12 p-2 m-2 expandTree">
          {loading ? (
            <LoadingIndicator size="3" />
          ) : (
            data.length > 0 &&
            okrFunctions
              .filter((item) => item.value !== "")
              .map((option, index) => (
                <ExpandTree
                  option={option}
                  index={index}
                  data={data}
                  handleInputChange={handleInputChange}
                  handleInputChangeObjectives={handleInputChangeObjectives}
                  handleInputChangeKeyResults={handleInputChangeKeyResults}
                  handleInputChangeTasks={handleInputChangeTasks}
                />
              ))
          )}
        </div>
        <div>
          <div
            className={`d-flex justify-content-${isMobile ? "center" : "end"}`}
          >
            <Button
              text={t("objectives.Save")}
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PopupOKRLibrary;
