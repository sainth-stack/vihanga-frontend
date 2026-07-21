import React, { useState, useEffect } from "react";
import { statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { getDepartmentsData } from "action/DepartmentAct";
import { getGrades } from "action/GradeAct";
import { getEntities } from "action/EntityAct";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
const UpdateDesignation = (props) => {
  const {t}=useTranslation()
  const {
    designationName: designationNameExisting,
    departmentName: departmentNameExisting,
    gradeName: gradeNameExisting,
    legalEntityName: legalEntityNameExisting,
    status: statusExisting,
    _id: idExisting,
  } = props.updata;
  const [departmentName, setDepartmentName] = useState("");
  const [designationName, setDesignationName] = useState("");
  const [status, setStatus] = useState("");
  const [gradeName, setGradeName] = useState("");
  const [legalEntityName, setLegalEntityName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [legalEntities, setLegalEntities] = useState([]);
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();
  const dispatch = useDispatch();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateDepartmentName = departmentName
        ? departmentName
        : departmentNameExisting;
      const updatedesignationName = designationName
        ? designationName
        : designationNameExisting;
      const updateGrade = gradeName
        ? gradeName
        : gradeNameExisting;
      const updateLegalEntity = legalEntityName
        ? legalEntityName
        : legalEntityNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateIds = idExisting;
      props.handlecallback({
        departmentName: updateDepartmentName,
        designationName: updatedesignationName,
        gradeName: updateGrade,
        legalEntityName: updateLegalEntity,
        status: updateStatus,
        id: updateIds,
      });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const fetchDepartments = () => {
    try {
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0 && data[0].departments.length > 0) {
          let result = data[0].departments.map(item => {
            return { 
              label: item.departmentName, 
              value: item.departmentName,
              legalEntityName: item.legalEntityName
            }
          })
          setAllDepartments(result);
          
          // Filter by existing legal entity if available
          if (legalEntityNameExisting) {
            const filtered = result.filter(item => item.legalEntityName === legalEntityNameExisting);
            filtered.unshift({ label: "--Select--", value: "" });
            setDepartments(filtered);
            setFilteredDepartments(filtered);
          } else {
            result.unshift({ label: "--Select--", value: "" });
            setDepartments(result);
            setFilteredDepartments(result);
          }
        } else if (data.length === 0) {
          setDepartments([])
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLegalEntities = () => {
    try {
      let response = dispatch(getEntities());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => ({
              label: item.legalEntityName,
              value: item.legalEntityName,
            }));
          result.unshift({ label: "--Select--", value: "" });
          setLegalEntities(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLegalEntityChange = (selectedEntity) => {
    setLegalEntityName(selectedEntity.value);
    if (selectedEntity.value) {
      const filtered = allDepartments.filter(
        (dept) => dept.legalEntityName === selectedEntity.value
      );
      filtered.unshift({ label: "--Select--", value: "" });
      setDepartments(filtered);
      setFilteredDepartments(filtered);
      setDepartmentName(""); // Clear department when legal entity changes
    } else {
      const all = [...allDepartments];
      all.unshift({ label: "--Select--", value: "" });
      setDepartments(all);
      setFilteredDepartments(all);
    }
  };

  const fetchGrades = () => {
    try {
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data.map(item => {
            return { label: item.gradeName, value: item.gradeName }
          })
          result.unshift({ label: "--Select--", value: "" })
          setGrades(result);
        } else if (data.length === 0) {
          setGrades([])
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDepartments();
    fetchGrades();
    fetchLegalEntities();
    //eslint-disable-next-line
  }, [idExisting])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {t("departments.UpdateDesignation")}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">{t("departments.Designationname")}</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setDesignationName(e.target.value)}
              onFocus={() => setMessage("")}
              id="question"
              defaultValue={designationNameExisting}
              placeholder={t("departments.Designationname")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Legal Entity</label>
            {legalEntities !== undefined && legalEntities.length > 0 &&
              <Select
                value={legalEntities.value}
                options={legalEntities}
                defaultValue={
                  legalEntities && legalEntityNameExisting
                    ? legalEntities.filter((option) => option.value === legalEntityNameExisting)[0]
                    : legalEntities[0]
                }
                onChange={handleLegalEntityChange}
              />}
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("departments.GradeName")}</label>
            {grades !== undefined && grades.length > 0 &&
              <Select
                value={grades.value}
                options={grades}
                defaultValue={
                  grades && gradeNameExisting
                    ? grades.filter((option) => option.value === gradeNameExisting)[0]
                    : grades[0]
                }
                onChange={(e) => setGradeName(e.value)}
              />}
          </div>

          <div className="form-group">
            <label htmlFor="question">Function Name</label>
            {departments !== undefined && departments.length > 0 &&
              <Select
                value={departments.value}
                options={departments}
                defaultValue={
                  departments && departmentNameExisting
                    ? departments.filter((option) => option.value === departmentNameExisting)[0]
                    : departments[0]
                }
                onChange={(e) => setDepartmentName(e.value)}
                isDisabled={!legalEntityName && !legalEntityNameExisting}
              />}
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("departments.Status")}</label>
            <Select
              value={statusesActive.value}
              options={statusesActive}
              defaultValue={
                statusesActive && statusExisting
                  ? statusesActive.filter((option) => option.value === statusExisting)[0]
                  : statusesActive[0]
              }
              onChange={(e) => setStatus(e.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn text-white" style={{ backgroundColor: "#837F39" }}>
           {t("departments.Update")}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UpdateDesignation;
