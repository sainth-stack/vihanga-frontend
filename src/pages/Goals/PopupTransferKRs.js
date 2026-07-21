/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./popup.scss";
import "./styles.scss";
import Button from "components/Company/Button";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { LoadingIndicator, removeDuplicates } from "utilities";
import { copyObjectives } from "action/OKRLibraryAct";
import { useDispatch } from "react-redux";
import { Toast } from "service/toast";
import useWindowSize from "components/UseWindowSize";
import ExpandTreeTransfer from "./ExpandTreeTransfer";
import { getObjectives } from "action/UserAct";
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrIndustry: data[i].okrIndustry,
      objectiveKeyResults: data[i].objectiveKeyResults.map(item => {
        let obj = { ...item, isSelected: false };
        obj.keyResults = obj.keyResults.map(itemm => ({ ...itemm, isSelected: false }))
        return obj;
      }),
      isActive: data[i].isActive,
      exportOKRLibrary: data[i].exportOKRLibrary,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

const PopupTransferOKR = ({ companyObj }) => {
  const [, setObjectives] = useState([])
  const [, setOKRFunction] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const handleSave = () => {
    if (data.length > 0) {
      let objectiveIds = data.filter(item => item.isSelected).map(item => item._id);
      let keyResultsIds = data.filter(item => item.isSelected).filter(item => item.keyResults.length > 0).map(item => item.keyResults.filter(keyResult => keyResult.isSelected).map(keyResult => keyResult._id)).flat();
      let taskIds = data.filter(item => item.isSelected).filter(item => item.keyResults.length > 0).map(item => item.keyResults.filter(keyResult => keyResult.isSelected).map(keyResult => keyResult.tasks.filter(task => task.isSelected).map(task => ({ _id: task._id, krId: task.krReferenceId }))).flat().flat());
      let finalData = {
        objectiveIds: objectiveIds,
        keyResultsIds: keyResultsIds,
        taskIds: taskIds,
        owner: companyObj.employeeName,
        employeeReferenceId: companyObj.toEmployeeName,
        employeeName: companyObj.employeeName
      }
      setLoading(true);
      let response = dispatch(copyObjectives(finalData));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
        } else {
          setLoading(false);
          setError(message)
        }
      });
    } else {
      Toast({ type: "warning", message: "Please select at least one function", time: 4000 })
    }
  }
  const getOKRLibraryData = () => {
    try {
      setLoading(true);
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      let response = dispatch(getObjectives(companyObj.role ? companyObj.role : user.role, companyObj.fromEmployeeName));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let objectivesData = data.length > 0 ? data.map(item => {
            let keyResults = item.children.length > 0 ? item.children.map(itemm => ({ ...itemm, key: itemm.keyResultName, value: itemm._id, isSelected: false })) : [];
            return {
              ...item,
              key: item.objective,
              value: item._id,
              keyResults: keyResults.length > 0 ? keyResults.map(itemm => ({ ...itemm, isSelected: false, tasks: itemm.children.length > 0 ? itemm.children.map(itemmm => ({ ...itemmm, key: itemmm.title, value: itemmm._id, isSelected: false })) : [] })) : [],
              isSelected: false,
            }
          }) : [];
          let nonDuplicateData = removeDuplicates(objectivesData, "value");
          setData(nonDuplicateData);
          setLoading(false);
          setError("")
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
  useEffect(() => {
    getOKRLibraryData();
  }, [companyObj.fromEmployeeName, companyObj.role])

  const handleInputChangeObjectives = (okrFunction, index) => {
    let okrFunctionsUpdated = [...data];
    okrFunctionsUpdated[index].isSelected = !okrFunctionsUpdated[index].isSelected;
    let okrKeyResultsUpdated = okrFunctionsUpdated[index].keyResults.map(item => ({ ...item, isSelected: okrFunctionsUpdated[index].isSelected }));
    okrFunctionsUpdated[index].keyResults = okrKeyResultsUpdated.length > 0 ? okrKeyResultsUpdated.map(item => ({ ...item, tasks: item.tasks.map(itemm => ({ ...itemm, isSelected: okrFunctionsUpdated[index].isSelected })) })) : [];
    setData(okrFunctionsUpdated);
  }
  const handleInputChangeKeyResults = (okrFunction, index, index1) => {
    let okrFunctionsUpdated = [...data];
    let objId = okrFunctionsUpdated[index]._id;
    let findObjIndex = okrFunctionsUpdated.findIndex(item => item._id === objId);
    let okrObjectivesUpdated = [...okrFunctionsUpdated[index].keyResults];
    let filteredData = okrObjectivesUpdated.filter(item => item.isSelected);
    if (filteredData.length === 0) {
      okrFunctionsUpdated[findObjIndex].isSelected = true;
    }
    okrObjectivesUpdated[index1].isSelected = !okrObjectivesUpdated[index1].isSelected;
    okrFunctionsUpdated[index].keyResults = okrObjectivesUpdated.length > 0 ? okrObjectivesUpdated.map(item => ({
      ...item, tasks: item.tasks.length > 0 ? item.tasks.map(itemm => {
        return { ...itemm, isSelected: itemm.krReferenceId === okrObjectivesUpdated[index1]._id ? okrObjectivesUpdated[index1].isSelected : itemm.isSelected }
      }) : []
    })) : [];
    setData(okrFunctionsUpdated)
  }
  const handleInputChangeTasks = (okrFunction, index, index1, index2) => {
    let okrFunctionsUpdated = [...data];
    let objId = okrFunctionsUpdated[index]._id;
    let findObjIndex = okrFunctionsUpdated.findIndex(item => item._id === objId);
    let okrObjectivesUpdated = [...okrFunctionsUpdated[index].keyResults];
    let filteredData = okrObjectivesUpdated.filter(item => item.isSelected);
    if (filteredData.length === 0) {
      okrFunctionsUpdated[findObjIndex].isSelected = true;
    }
    if (okrObjectivesUpdated[index1].tasks.filter(item => item.isSelected).length === 0) {
      okrObjectivesUpdated[index1].isSelected = true;
    }
    okrObjectivesUpdated[index1].tasks[index2].isSelected = !okrObjectivesUpdated[index1].tasks[index2].isSelected;
    okrFunctionsUpdated[index].keyResults = okrObjectivesUpdated.length > 0 ? okrObjectivesUpdated.map((item, krIndex) => ({
      ...item, tasks: item.tasks.length > 0 ? item.tasks.map(itemm => {
        return { ...itemm }
      }) : []
    })) : [];
    setData(okrFunctionsUpdated)
  }

  return (
    <div>
      <div className="bg-light-white rounded-12 p-2 m-2 expandTree">
        {loading ? <LoadingIndicator size="3" /> : (data.length > 0 && data.filter(item => item.value !== "").map((option, index) => (
          <ExpandTreeTransfer option={option} index={index} data={data}
            handleInputChangeObjectives={handleInputChangeObjectives}
            handleInputChangeKeyResults={handleInputChangeKeyResults}
            handleInputChangeTasks={handleInputChangeTasks} />
        )))}
      </div>
      <div>
        <div className={`d-flex justify-content-${isMobile ? 'center' : 'end'}`}>
          <Button
            text="Save"
            className="bg-green border text-white"
            handleClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupTransferOKR;