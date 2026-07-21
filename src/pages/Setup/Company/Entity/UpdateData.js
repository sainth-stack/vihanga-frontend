import React, { useState } from "react";
import { countriesNames, statusesActive, Validator } from "utilities";
import { Modal } from "react-bootstrap";
import Select from "react-select";

export default function UpdateEntityData(props) {
  const {
    companyEntityName: companyEntityNameExisting,
    companyId: companyIdExisting,
    industry: industryExisting,
    legalEntityName: legalEntityNameExisting,
    status: statusExisting,
    country: countryExisting,
    _id: idExisting,
  } = props.updata;
  const [legalEntityName, setLegalEntityName] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateLegalEntityName = legalEntityName
        ? legalEntityName
        : legalEntityNameExisting;
      const updateStatus = status
        ? status
        : statusExisting;
      const updateCountry = country
        ? country
        : countryExisting;
      const updateIds = idExisting;
      props.handlecallback({
        legalEntityName: updateLegalEntityName,
        status: updateStatus,
        country: updateCountry,
        companyEntityName: companyEntityNameExisting,
        companyId: companyIdExisting,
        industry: industryExisting,
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
          Update Legal Entity
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">Legal Entity Name</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setLegalEntityName(e.target.value)}
              onFocus={() => setMessage("")}
              id="legalEntityName"
              defaultValue={legalEntityNameExisting}
              placeholder="Legal Entity Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="question">Status</label>
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
            <label htmlFor="question">Country</label>
            <Select
              value={countriesNames.value}
              options={countriesNames}
              defaultValue={
                countriesNames && countryExisting
                  ? countriesNames.filter((option) => option.value === countryExisting)[0]
                  : countriesNames[0]
              }
              onChange={(e) => setCountry(e.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn text-white rounded" style={{ backgroundColor: "#837F39" }}>
            Update
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
