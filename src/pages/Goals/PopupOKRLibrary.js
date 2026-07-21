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
import { createGoals, getAllOkrLibrary } from "action/OKRLibraryAct";
import { useDispatch } from "react-redux";
import ExpandTree from "./ExpandTree";
import { Toast } from "service/toast";
import useWindowSize from "components/UseWindowSize";
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrIndustry: data[i].okrIndustry,
      objectiveKeyResults: data[i].objectiveKeyResults.map(item => {
        let obj = { ...item, isSelected: false };
        return obj;
      }),
      isActive: data[i].isActive,
      exportOKRLibrary: data[i].exportOKRLibrary,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

const PopupOKRLibrary = (props) => {
  const [, setObjectives] = useState([])
  const [okrFunction, ] = useState("")
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const [okrFunctions, setOkrFunctions] = useState([]);
  const handleSave = () => {
    if (data.length > 0) {
      let employee = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
      let okrPeriod = localStorage.getItem("okrPeriod") !== null ? JSON.parse(localStorage.getItem("okrPeriod")).okrPeriod : null;
      let okrYear = localStorage.getItem("okrYear") !== null ? JSON.parse(localStorage.getItem("okrYear")).okrYear : null;
      let allObjectives = [];
      let objectives = data.map(obj => {
        let objj = { ...obj, type: obj.type.toLowerCase() };
        return objj;
      })
      allObjectives = [...objectives]
      let updatedObjectives = allObjectives.filter(obj => obj.isSelected);
      const finalData = {
        employeeName: employee.ownerName,
        okrPeriod: okrPeriod,
        okrYear: okrYear,
        owner: employee.ownerName,
        employeeReferenceId: employee.ownerId,
        objectiveKeyResults: updatedObjectives,
        dimension: data[0].okrCategory
      };
      setLoading(true);
      let response = dispatch(createGoals(finalData));
      response.then(({ success, message }) => {
        console.log(success, message,'sdfusdfjds')
        if (success) {
          setLoading(false);
          props.onHide();
          window.location.reload();
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
      let response = dispatch(getAllOkrLibrary());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let okrFunctionsDatas = [];
          data.forEach(item => {
            let objs = item.objectiveKeyResults;
            objs.forEach(itemm => {
              let key = { ...itemm, isSelected: false };
              okrFunctionsDatas.push(key)
            })
          })
          let nonduplicate = tableGenerator(data, data.length);
          setData(okrFunctionsDatas);
          let okrFunctionsData = [];
          data.forEach(item => {
            let objs = item.objectiveKeyResults;
            objs.forEach(itemm => {
              let key = { key: itemm.okrFunction, value: itemm.okrFunction, isSelected: false };
              key.keyResults = itemm.keyResults.map(itemmm => ({ ...itemmm, isSelected: false }))
              okrFunctionsData.push(key)
            })
          })
          let nonduplicate2 = removeDuplicates(okrFunctionsData, "value");
          let sortedData = nonduplicate2.sort((a, b) => {
            return (a.key.trim() > b.key.trim()) - (a.key.trim() < b.key.trim())
          })
          setOkrFunctions(sortedData)
          let updatedData = [...nonduplicate];
          if (updatedData.length > 0) {
            updatedData = updatedData.filter(item => item.okrFunction === okrFunction);
            setObjectives(updatedData)
          }
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
  }, [okrFunction])


  const handleInputChange = (okrFunction, index) => {
    let okrFunctionsUpdated = [...okrFunctions];
    okrFunctionsUpdated[index].isSelected = !okrFunctionsUpdated[index].isSelected;
    setOkrFunctions(okrFunctionsUpdated)
    let okrObjectivesUpdated = data.map(item => {
      if (item.okrFunction === okrFunction) {
        let obj = { ...item, isSelected: okrFunctionsUpdated[index].isSelected };
        obj.keyResults = obj.keyResults.map((itemm) => ({ ...itemm, isSelected: okrFunctionsUpdated[index].isSelected }))
        return obj;
      } else {
        return item;
      }
    });
    setData(okrObjectivesUpdated)
  }

  const handleInputChangeObjectives = (okrFunction, index) => {
    let okrFunctionsUpdated = [...data];
    okrFunctionsUpdated[index].isSelected = !okrFunctionsUpdated[index].isSelected;
    setData(okrFunctionsUpdated)
  }

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
          Create Goals
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
          {loading ? <LoadingIndicator size="3" /> : (data.length > 0 && okrFunctions.filter(item => item.value !== "").map((option, index) => (
            <ExpandTree option={option} index={index} data={data} handleInputChange={handleInputChange} handleInputChangeObjectives={handleInputChangeObjectives} />
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
      </Modal.Body>
    </Modal>
  );
};

export default PopupOKRLibrary;