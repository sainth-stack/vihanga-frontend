/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Modal } from "react-bootstrap";
import wrong from "assets/svg/wrong.svg";
import { useDispatch } from "react-redux";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { removeDuplicates } from "utilities";
import SelectInput from "components/Company/SelectInput";
import Button from "components/Company/Button";
import { useTranslation } from "react-i18next";
export default function PrivilegeModal(props) {
  const [roleId, setRoleId] = useState("");
  const [privilegeGroup, setPrivilegeGroup] = useState("");
  const [privilegeGroups, setPrivilegeGroups] = useState("");
  const dispatch = useDispatch();

  const handleSave = () => {
    props.handlecallback({ roleId, privilegeGroup });
  };

  const getPrivilegesData = () => {
    try {
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          let finalData = nonduplicate.map((item) => ({
            key: item.groupName,
            value: item._id,
          }));
          setPrivilegeGroups(finalData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPrivilegesData();
  }, [props]);

  const { t } = useTranslation();
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
          Update Privilege Group
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12 p-4 m-4">
          <div className="form-group mt-3">
            <Col className="p-0">
              <SelectInput
                label="Select Role"
                placeholder=""
                name="roleId"
                options={props.roles}
                value={roleId}
                onChangeText={(e) => setRoleId(e.target.value)}
              />
            </Col>
            <Col className="p-0 mt-3">
              {privilegeGroups.length > 0 && (
                <SelectInput
                  label="Privilege Group"
                  placeholder=""
                  name="privilegeGroup"
                  options={privilegeGroups}
                  value={privilegeGroup}
                  onChangeText={(e) => setPrivilegeGroup(e.target.value)}
                />
              )}
            </Col>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-end">
            <Button
              text={t("Tasks.Add")}
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
