import React, { useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import wrong from "assets/svg/wrong.svg";
import {
  AuthUserRole,
  AuthUserRoleId,
  LoadingIndicator,
  Validator,
} from "utilities";
import SelectInput from "components/Company/SelectInput";
import Button from "components/Company/Button";
import useWindowSize from "components/UseWindowSize";

export default function ProxyAsModal(props) {
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
  };
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
          Select Proxy As
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div
          className={`bg-light-white rounded-12 ${isMobile ? "" : "p-4 m-4"}`}
        >
          <div className="form-group mt-3">
            <Row>
              <Col className="p-0">
                <SelectInput
                  label="Select User*"
                  placeholder=""
                  name="selectedUser"
                  options={[
                    AuthUserRole === "Super Admin"
                      ? {
                          key: "Super Admin (superadmin@gmail.com)",
                          value: AuthUserRoleId,
                          label: "superadmin@gmail.com",
                        }
                      : {},
                    ...props.employees.filter(
                      (item) => item.label !== "superadmin@gmail.com"
                    ),
                  ]}
                  value={selectedUser}
                  onChangeText={(e) => setSelectedUser(e.target.value)}
                />
                {/* {validator.current.message("Proxy As", selectedUser, "required")} */}
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            {/*<Button
              text={t("objectives.Clear")}

              className="bg-white border-grey"
              handleClick={clearData}
            />*/}
            {props.loading ? (
              <div className="mr-5">
                <LoadingIndicator size="3" />
              </div>
            ) : (
              <Button
                text="Select"
                className="border text-white p-color"
                handleClick={handleSave}
              />
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
