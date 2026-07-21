import React, { useState } from "react";
import { countriesNames, industries, statuses, statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";

export default function UpdateCompanyData(props) {
  const {
    companyEntityName: companyEntityNameExisting,
    industry: industryExisting,
    status: statusExisting,
    country: countryExisting,
    _id: idExisting,
  } = props.updata;
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateStatus = status
        ? status
        : statusExisting;
      const updateCountry = country
        ? country
        : countryExisting;
      const updateIds = idExisting;
      props.handlecallback({
        status: updateStatus,
        country: updateCountry,
        companyEntityName: companyName ? companyName : companyEntityNameExisting,
        industry: industry ? industry : industryExisting,
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
          Update Company
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">Company Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setCompanyName(e.target.value)}
              onFocus={() => setMessage("")}
              id="companyName"
              defaultValue={companyEntityNameExisting}
              placeholder="Company Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="update-industry">Industry</label>
            <Select
              inputId="update-industry"
              aria-label="Industry"
              value={industries.value}
              options={industries}
              defaultValue={
                industries && industryExisting
                  ? industries.filter((option) => option.value === industryExisting)[0]
                  : industries[0]
              }
              onChange={(e) => setIndustry(e.value)}           
              tabIndex={0}
            />
          </div>
          <div className="form-group">
            <label htmlFor="update-status">Status</label>
            <Select
              inputId="update-status"
              aria-label="Status"
              value={statusesActive.value}
              options={statusesActive}
              defaultValue={
                statusesActive && statusExisting
                  ? statusesActive.filter((option) => option.value === statusExisting)[0]
                  : statusesActive[0]
              }
              onChange={(e) => setStatus(e.value)}
              tabIndex={0}
            />
          </div>
          <div className="form-group">
            <label htmlFor="update-country">Country</label>
            <Select
              inputId="update-country"
              aria-label="Country"
              value={countriesNames.value}
              options={countriesNames}
              defaultValue={
                countriesNames && countryExisting
                  ? countriesNames.filter((option) => option.value === countryExisting)[0]
                  : countriesNames[0]
              }
              onChange={(e) => setCountry(e.value)}
              tabIndex={0}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
