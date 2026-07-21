import React, { useState, useEffect } from "react";
import "./styles.scss";
import Button from "components/Company/Button";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import search from "assets/svg/search.svg";
import CheckboxInput2 from "components/Company/CheckboxInput2";
import {
  removeDuplicates,
  LoadingIndicator,
  AuthUserId,
  AuthUserName,
} from "utilities";
import { getEmployees } from "action/EmployeeAct";
import { getDepartments } from "action/DepartmentAct";
import useWindowSize from "components/UseWindowSize";

import { cascadeGoal } from "action/UserAct";
import { useTranslation } from "react-i18next";
export const tableGenerator = (data, length) => {
  const display = {};
  data.map((item, index) => {
    return (display[item._id] = true);
  });
  return display;
};
export default function SearchEmployees(props) {
  const dispatch = useDispatch();
  const [, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalInformation, setPersonalInformation] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const isMobile = useWindowSize();
  const [searchDepartment, setSearchDepartment] = useState("");
  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployees());
      response.then(({ data, message }) => {
        const filterData = data.filter((item) => item.userType !== "Testing");
        if (filterData !== undefined && filterData.length > 0) {
          const personalInfo = filterData.map((item) => {
            return {
              label:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              value: false,
              name: item._id,
              _id: item._id,
            };
          });
          let nonduplicates = removeDuplicates(personalInfo, "label");
          setPersonalInformation(nonduplicates);
          setLoading(false);
          setError("");
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
  const fetchDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartments());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data.map((item) => {
            return {
              key: item.departmentName,
              value: false,
              label: item.departmentName,
              name: item.departmentName,
              _id: item._id,
            };
          });
          let nonduplicates = removeDuplicates(result, "label");
          setDepartments(nonduplicates);
          setLoading(false);
          setError("");
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
    fetchEmployees();
    fetchDepartments();
    //eslint-disable-next-line
  }, []);
  const clearData = () => {
    fetchEmployees();
    fetchDepartments();
  };
  const handleSave = () => {
    if (props.selectedData && props.selectedData.length > 0) {
      props.selectedData.forEach((singleItem) => {
        let selectedData = singleItem;
        let finalEmployees = [...personalInformation];
        let findId = finalEmployees.filter(
          (item) => item._id === selectedData.owner
        );
        finalEmployees = finalEmployees
          .filter((item) => item.value === true)
          .map((item) => {
            let obj = { ...selectedData };
            obj.employeeName = item.label;
            obj.employeeReferenceId = item._id;
            obj.owner = findId.length > 0 ? findId[0].label : "N/A";
            obj.cascadedType = "type1";
            obj.cascadedById = AuthUserId;
            obj.cascadedByName = AuthUserName;
            return obj;
          });
        try {
          setLoading(true);
          let response = dispatch(cascadeGoal(finalEmployees));
          response.then(({ data, message, success }) => {
            if (success) {
              setLoading(false);
              setError("");
              props.handleCallback({
                dataRefresh: true,
              });
              props.onHide();
            } else {
              setLoading(false);
              setError(message);
              props.onHide();
            }
          });
        } catch (error) {
          setLoading(false);
          setError(error.toString());
          props.onHide();
        }
      });
    }
  };
  const onChangeText = ({ target: { name, value } }, index) => {
    let updatedData = [...personalInformation];
    let findIndex = updatedData.findIndex((item) => item._id === index);
    updatedData[findIndex]["value"] = value;
    setPersonalInformation(updatedData);
  };
  const onChangeText2 = ({ target: { name, value } }, index) => {
    let updatedData = [...departments];
    let findIndex = updatedData.findIndex((item) => item._id === index);
    updatedData[findIndex]["value"] = value;
    setDepartments(updatedData);
  };
  const filterEmployeeData = (data) => {
    return data.filter((item) => {
      return (
        item.label.toLowerCase().indexOf(searchEmployee.toLowerCase()) !== -1
      );
    });
  };
  const filterDepartmentData = (data) => {
    return data.filter((item) => {
      return (
        item.label.toLowerCase().indexOf(searchDepartment.toLowerCase()) !== -1
      );
    });
  };

  const { t } = useTranslation();
  return (
    <div>
      <div className="bg-light-white rounded-12 m-3">
        <div>
          <span className="child-title">
            {t("OKR Details.Search and Select Assignee")}
          </span>
          <Row className="mt-2">
            <Col lg={isMobile ? "8" : ""}>
              <label className="label">{t("OKR Details.Employees")}</label>
              <div className="input-group-append searchInput-icon3 ">
                {/* <i className="fa fa-search" /> */}

                <img src={search} alt="search-icon" className="searchIcon" />
              </div>
              <input
                type="text"
                className="bg-light outline-none searchInput text-dark fs14"
                placeholder="Search"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
              {/* <SelectInputIcon label="" icon={search} style={{ backgroundImage: "none", textAlign: "center" }} placeholder="Search" name="employee" options={statuses} checkboxOptions={searchPerson} /> */}
            </Col>
            <Col>
              <label className="label">{t("OKR Details.Departments")}</label>
              <div className="input-group-append searchInput-icon3 ">
                {/* <i className="fa fa-search" /> */}
                <img src={search} alt="search-icon" className="searchIcon" />
              </div>
              <input
                type="text"
                className="bg-light outline-none searchInput text-dark fs14"
                placeholder="Search"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <div className="card-head">{t("OKR Details.Employees")}</div>
              <div className="custom-card">
                {filterEmployeeData(personalInformation).length > 0 &&
                  filterEmployeeData(personalInformation).map(
                    (checkbox, index) => (
                      <div className="mt-3" key={index}>
                        <CheckboxInput2
                          label={checkbox.label}
                          icon="employees"
                          name={checkbox.name}
                          key={index}
                          onChangeText={(e, index) => onChangeText(e, index)}
                          value={checkbox.value}
                          index={checkbox._id}
                        />
                      </div>
                    )
                  )}
              </div>
            </Col>
            <Col>
              <div className="card-head">{t("OKR Details.Departments")}</div>
              <div className="custom-card">
                {filterDepartmentData(departments).length > 0 &&
                  filterDepartmentData(departments).map((checkbox, index) => (
                    <div className="mt-3" key={index}>
                      <CheckboxInput2
                        label={checkbox.label}
                        icon="departments"
                        name={checkbox.name}
                        key={index}
                        onChangeText={(e, index) => onChangeText2(e, index)}
                        value={checkbox.value}
                        index={checkbox._id}
                      />
                    </div>
                  ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="buttons">
          <Button
            text={t("OKR Details.Clear")}
            className="bg-white border-grey"
            handleClick={clearData}
          />
          <Button
            text={t("OKR Details.Cascade")}
            className="bg-green border text-white"
            handleClick={handleSave}
          />
        </div>
      )}
    </div>
  );
}
