import React, { useState } from "react";
import TitleHeader from "components/TitleHeader";
import Button from "components/Company/Button";
import RatingScalePopup from "./RatingScalePopup";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import plusicon from "../../../assets/svg/plus.svg";
import Delete from "assets/svg/delete-green.svg";
import question from "../../../assets/svg/questionm.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import "./index.scss";
const PerformanceManagement = () => {
  const [evaluationType, setEvaluationType] = useState("");
  const [evaluationFrequency, setEvaluationFrequency] = useState("");

  const [modal, setModal] = useState(false);
  const opt1 = [
    { key: "Behaviour", value: "Behaviour" },
    { key: "OKR", value: "OKR" },
  ];
  const opt2 = [
    { key: "Monthly", value: "Monthly" },
    { key: "Quarterly", value: "Quarterly" },
    { key: "Semi Annually", value: "Semi Annually" },
    { key: "Annually", value: "Annually" },
  ];
  const opt3 = [
    { key: "Functional Head", value: "Functional Head" },
    { key: "HR", value: "HR" },
    { key: "Adhoc User", value: "Adhoc User" },
  ];

  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">
          Performance Management
        </p>
        <div className="company-form1">
          <div className="container">
            <div className="row ">
              <div className="col-5  p-0">
                <SelectInput
                  options={opt1}
                  label="Type of evaluation"
                  value={evaluationType}
                  onChangeText={(e) => setEvaluationType(e.target.value)}
                  style={{ width: "20px", paddingLeft: 0 }}
                />
              </div>
              <div className="col-6 pl-5 ">
                <SelectInput
                  options={opt2}
                  label="Frequency of evaluation"
                  value={evaluationFrequency}
                  onChangeText={(e) => setEvaluationFrequency(e.target.value)}
                />
              </div>
              <div className="col-1 d-flex justify-content-end">
                <img src={plusicon} width={"30px"} />
                <img src={Delete} width={"30px"} className="ml-2" />
              </div>
            </div>
          </div>
          <div class="container">
            <div class="row mt-4 d-flex justify-content-between">
              <div className="col-5  ">
                Start Date
                <input type="date" className="date"></input>
                <img src={question} className="pl-3" />
              </div>
              <div className="col-5 ">
                End Date
                <input type="date" className="date"></input>
                <img src={question} className="pl-3" />
              </div>
            </div>
          </div>
          <div class="container mt-5">
            <div class="row ">
              <div className="col-2  mb-1">
                <p>List group names</p>
              </div>{" "}
              <div className="col-1 pl-1 ">
                <CheckboxInput label="Employee" />
              </div>{" "}
              <div className="col-1  ml-2 ">
                <CheckboxInput label="Managers" />
              </div>{" "}
              <div className="col-1  ml-2 ">
                <CheckboxInput label="Leadership" />
              </div>{" "}
            </div>
            <div className="d-flex justify-content-end">
              <Button text="Save" className="bg-green border text-white" />
            </div>
          </div>
          <hr />
          <div className="container">
            <div className="row ">
              <div className="col-2  mt-4">
                <CheckboxInput label="Overall Rating" />
              </div>
              <div className="col-2 mt-4">
                <CheckboxInput label="Absolute Rating" />
              </div>
              <div className="col-8 d-flex justify-content-end ">
                <Button
                  className="bg-green text-white"
                  text="Rating Scale"
                  handleClick={() => setModal(true)}
                />
              </div>
            </div>
            <div className="col-5 ">
              <div className="mt-2">
                <TextInput
                  label={
                    <span style={{ padding: "0px", margin: "0px" }}>
                      OKR Weightage
                    </span>
                  }
                  className=" form-control"
                />
              </div>
              <div className="mt-3">
                <TextInput
                  label="Comepetency Weightage"
                  className=" form-control"
                />
              </div>
              <div className="mt-2">
                <TextInput label="360 Weightage" className=" form-control" />
              </div>
            </div>
          </div>
          <hr />
          <div className="container">
            <div class="row d-flex justify-content-center">
              <div className="col-2  p-0">
                <CheckboxInput label="Include Self Evaluation" />
              </div>{" "}
              <div className="col-3 p-0 ml-4">
                <CheckboxInput label="Employee Acknowledgement" />
              </div>{" "}
              <div className="col-2 p-0">
                <CheckboxInput label="HRBP Review" />
              </div>{" "}
              <div className="col-2 p-0">
                <CheckboxInput label="Approval Required" />
              </div>{" "}
            </div>
            <div className="row mt-4">
              <div className="col-5 p-0">
                <TextInput
                  label="Comepetency Weightage"
                  className=" form-control"
                />
              </div>{" "}
              <div class="col-2">
                <img src={plusicon} />
                <img src={Delete} />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-5 p-0">
                <SelectInput options={opt3} label="Frequency of evaluation" />
              </div>{" "}
              <div class="col-2">
                <img src={plusicon} />
                <img src={Delete} />
              </div>
            </div>
          </div>
          <div>
            <div className="buttons ">
              <Button text="Cancel" className="bg-white border-grey" />
              <Button text="Save" className="bg-green border text-white" />
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <RatingScalePopup show={modal} onHide={() => setModal(false)} />
      )}
    </>
  );
};

export default PerformanceManagement;
