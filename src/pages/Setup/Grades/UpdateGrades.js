import React, { useEffect, useState } from "react";
import { statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { getDepartmentsData } from "action/DepartmentAct";
import { useTranslation } from "react-i18next";
const UpdateGrades = (props) => {
  const {t} = useTranslation()
  const {
    gradeName: gradeNameExisting,
    departmentName: departmentNameExisting,
    status: statusExisting,
    _id: idExisting,
  } = props.updata;
  const [departmentName, setDepartmentName] = useState("");
  const [gradeName, setGradeName] = useState("");
  const [status, setStatus] = useState("");
  const [departments, setDepartments] = useState([]);
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();
  const dispatch = useDispatch();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateGradeName = gradeName ? gradeName : gradeNameExisting;
      const updateDepartmentName = departmentName
        ? departmentName
        : departmentNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateIds = idExisting;
      props.handlecallback({
        gradeName: updateGradeName,
        departmentName: updateDepartmentName,
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
            return { label: item.departmentName, value: item.departmentName }
          })
          result.unshift({ label: "--Select--", value: "" })
          setDepartments(result);
        } else if (data.length === 0) {
          setDepartments([])
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDepartments();
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
          {t("departments.UpdateGrade")}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">{t("departments.Gradename")}</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setGradeName(e.target.value)}
              onFocus={() => setMessage("")}
              id="question"
              defaultValue={gradeNameExisting}
              placeholder={t("departments.Gradename")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("departments.Departmentname")}</label>
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

export default UpdateGrades;
