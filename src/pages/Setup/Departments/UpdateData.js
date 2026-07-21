import React, { useState } from "react";
import { countriesNames, statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
export default function UpdateDepartmentData(props) {
  const {t} = useTranslation()
  const {
    departmentName: departmentNameExisting,
    legalEntityName: legalEntityNameExisting,
    status: statusExisting,
    location: locationExisting,
    _id: idExisting,
  } = props.updata;
  const [legalEntityName, setLegalEntityName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [legalEntities,] = useState(props.legalEntities.map(item => {
    return { label: item.value, value: item.value }
  }));
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateDepartmentName = departmentName
        ? departmentName
        : departmentNameExisting;
      const updateLegalEntityName = legalEntityName
        ? legalEntityName
        : legalEntityNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateLocation = location
        ? location
        : locationExisting;
      const updateIds = idExisting;
      props.handlecallback({
        departmentName: updateDepartmentName,
        legalEntityName: updateLegalEntityName,
        status: updateStatus,
        location: updateLocation,
        id: updateIds,
      });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
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
          {t("departments.UpdateDepartment")}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">{t("departments.Departmentname")}</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setDepartmentName(e.target.value)}
              onFocus={() => setMessage("")}
              id="departmentName"
              defaultValue={departmentNameExisting}
              placeholder={t("departments.Departmentname")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">{t("departments.LegalEntityName")}</label>
            {legalEntities !== undefined && legalEntities.length > 0 &&
              <Select
                value={legalEntities.value}
                options={legalEntities}
                defaultValue={
                  legalEntities && legalEntityNameExisting
                    ? legalEntities.filter((option) => option.value === legalEntityNameExisting)[0]
                    : legalEntities[0]
                }
                onChange={(e) => setLegalEntityName(e.value)}
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
          <div className="form-group">
            <label htmlFor="question">{t("departments.Country")}</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setMessage("")}
              id="location"
              defaultValue={locationExisting}
              placeholder={t("departments.EnterCountry")}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn bg-green text-white">
            {t("departments.Update")}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
