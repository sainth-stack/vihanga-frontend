import React, { useState, useEffect, useRef } from "react";
import useWindowSize from "components/UseWindowSize";
import SelectInput from "components/Company/SelectInput";
import TitleHeader from "components/TitleHeader";
import "../styles.scss";
import { removeDuplicates } from "utilities";
import { getEmployeesAll } from "action/EmployeeAct";
import { useDispatch } from "react-redux";

export default function RewardsNomination() {

  const defaultData = {
    SRnumber: 2,
    priority: "High",
    problemArea: "",
    raisedBy: "nmae",
    status: "New",
    description: "",
    userId: "heyy",
    attachments: "",
    companyId: "nma",
    feed: [],
    update: "",
    url: "",
  };

  const fileInputRef = useRef(null);

  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  const [employeeData, setEmployeeData] = useState([]);
  const [task, setTask] = useState(defaultData);

  const dispatch = useDispatch();
  const isMobile = useWindowSize();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("File selected:", selectedFile);
    setTask({
      ...task,
      attachments: selectedFile,
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...task };
    updatedData[name] = value;
    setTask(updatedData);
  };

  const fetchEmployees = () => {
    try {
      let response = dispatch(getEmployeesAll());

      response.then(({ data }) => {
        if (data !== undefined && data.length > 0) {
          let updatedData = data.map((item) => {
            return {
              key:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              value: item._id,
            };
          });

          let nonduplicates = removeDuplicates(updatedData, "key");
          setEmployeeData(nonduplicates);
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const nomination = [
    { key: "Smart Worker", value: "Smart Worker" },
    { key: "Employee of the month", value: "Employee of the month" },
  ];

  return (
    <div>

      <TitleHeader tabIndex={0} name="Rewards Nomination" />

      <div
        className={`rounded-12 mh-100 ${
          isMobile ? "p-1 m-1" : "bg-light-primary p-4 m-4"
        }`}
      >
        <div>

          <div
            tabIndex={1}
            className="text-decoration-none nav cursor-pointer activeLink"
            style={{ color: "#000000" }}
          >
            Rewards Nomination
          </div>

          <div style={{ width: "60%", gap: "30px" }}>

            <div className="mt-4" style={{ width: "80%" }}>
              <SelectInput
                tabIndex={2}
                label="Type Of Nomination"
                name="status"
                options={nomination}
                value={task.status}
                onChangeText={handleChange}
              />
            </div>

            <div className="mt-4" style={{ width: "80%" }}>
              <SelectInput
                tabIndex={3}
                label="Employee"
                name="priority"
                options={employeeData}
                value={task.priority}
                onChangeText={handleChange}
              />
            </div>

            <div
              className="form-group d-flex mx-3 mt-4"
              style={{ gap: "40px", width: "80%" }}
            >
              <label
                htmlFor="taskDescription"
                style={{ width: "27%", fontSize: "14px" }}
              >
                Justification
              </label>

              <textarea
                tabIndex={4}
                id="taskDescription"
                className="form-control p-2"
                rows="5"
                name="update"
                value={task.update}
                onChange={handleChange}
                style={{ borderRadius: "0px", width: "61%" }}
              />
            </div>

            <div
              className="d-flex justify-content-between mt-4"
              style={{ width: "80%" }}
            >
              <div
                className="form-group d-flex mx-3"
                style={{ gap: "40px", width: "42%" }}
              >
                <label style={{ width: "100%", fontSize: "14px" }}>
                  Supporting Document
                </label>
              </div>

              <div className="d-flex w-100 ml-4">

                <input
                  tabIndex={5}
                  type="text"
                  className={`form-control searchBox text-dark fs14 ${
                    isMobile ? "mr-1" : "col-9"
                  }`}
                  disabled
                  style={{ borderRadius: "0px" }}
                  value={task.attachments?.name || ""}
                />

                <div>

                  <input
                    tabIndex={6}
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <button
                    tabIndex={7}
                    className="btn btn-primary ml-2"
                    onClick={handleButtonClick}
                  >
                    Browse
                  </button>

                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">

              <button
                tabIndex={8}
                className="btn btn-secondary"
                onClick={() => {}}
              >
                Cancel
              </button>

              <button
                tabIndex={9}
                className="btn btn-primary ml-2"
                onClick={() => {}}
              >
                {task.feed.length == 0 ? "Save" : "Update"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}