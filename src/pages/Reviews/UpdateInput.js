import React, { useState } from "react";
import { Validator } from "utilities";
import { Modal } from "react-bootstrap";

export default function UpdateInput(props) {
  const {
    popupTitle,
    fieldName,
    firstName: nameExisting,
    _id: idExisting,
  } = props.updata;
  const [name, setName] = useState("");
  const [, forceUpdate] = useState(false);
  const [, setMessage] = useState("");

  const validator = Validator();

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      const updateName = name ? name : nameExisting;
      const updateIds = idExisting;
      props.handlecallback({
        firstName: updateName,
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
          Update {popupTitle}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={onHandleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="question">{fieldName}</label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setMessage("")}
              defaultValue={nameExisting}
              placeholder={fieldName}
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
