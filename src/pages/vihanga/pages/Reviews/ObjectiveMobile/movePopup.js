import React, { useState,useEffect } from 'react'
import { Col, Modal, Row } from 'react-bootstrap';
import wrong from "assets/svg/wrong.svg";
import {LoadingIndicator, Validator } from 'utilities';
import SelectInput from 'components/Company/SelectInput';
import Button from 'components/Company/Button';
import useWindowSize from 'components/UseWindowSize';

export default function MoveAsModal(props) {
  const [selectedUser, setSelectedUser] = useState("");
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();
  const handleSave = () => {
    if (validator.current.allValid()) {
      props.handlecallback(selectedUser);
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  }
  useEffect(()=>{
setSelectedUser(props.data.status)
  },[props.data])
  const validator = Validator();
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
          Update Status
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className={`bg-light-white rounded-12 ${isMobile ? '' : 'p-4 m-4'}`}>
          <div className="form-group mt-3">
            <Row>
              <Col className="p-0">
                <SelectInput
                  label="Select Status*"
                  placeholder=""
                  name="selectedUser"
                  options={[  ...props.employees ]}
                  value={selectedUser}
                  onChangeText={(e) => setSelectedUser(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            {props.loading ? <div className='mr-5'><LoadingIndicator size="3" /></div> : <Button
              text="Update"
              className="bg-green border text-white"
              handleClick={handleSave}
            />}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
