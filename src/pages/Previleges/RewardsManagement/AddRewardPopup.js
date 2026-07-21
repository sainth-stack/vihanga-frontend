/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import { Col, Row } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import { RewardCategories, Validator, Role } from "utilities";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";

const AddRewardPopup = (props) => {
  const [rewardData, setRewardData] = useState(
    props.editId
      ? props.rewardDatas
      : {
          rewardIcon: "",
          rewardName: "",
          rewardCode: "",
          rewardDescription: "",
          rewardPoints: 0,
          rewardAmount: 0,
          rewardStatus: "active",
          rewardType: "",
          rewardApprover: "",
        }
  );

  const { t } = useTranslation();

  const validator = Validator();
  const showError = (field) =>
    validator.current.message(field, rewardData[field], "required|min:1");

  const [showAttachment, setShowAttachment] = useState(
    rewardData.rewardIcon ? false : true
  );
  const [, forceUpdate] = useState(false);
  const isMobile = useWindowSize();

  const clearData = () => {
    setRewardData({
      rewardIcon: "",
      rewardName: "",
      rewardCode: "",
      rewardDescription: "",
      rewardPoints: 0,
      rewardAmount: 0,
      rewardStatus: "active",
      rewardType: "",
      rewardApprover: "",
    });

    setShowAttachment(true);
    validator.current.hideMessages();
    forceUpdate((prev) => !prev);
  };

  const handleSave = () => {
    if (validator.current.allValid()) {
      props.handlecallback(rewardData);
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...rewardData };
    updatedData[name] = value;
    setRewardData(updatedData);
  };

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
          {props.editId
            ? t("addRewardPopup.titleUpdate")
            : t("addRewardPopup.titleAdd")}
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
          className={`rounded-6  ${
            isMobile ? "p-1 m-1" : " bg-white   p-4 m-4"
          }`}
        >
          <div
            className={
              isMobile
                ? "form-group d-flex justify-content-between "
                : "form-group d-flex justify-content-between"
            }
          >
            <label
              htmlFor="rewardName"
              className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
            >
              {t("addRewardPopup.rewardName")}
            </label>
            <input
              type="text"
              placeholder=""
              id="rewardName"
              className={`form-control searchBox text-dark fs14 ${
                isMobile ? "mr-1" : "col-10"
              }`}
              name="rewardName"
              value={rewardData.rewardName}
              onChange={handleChange}
            />
            {showError("rewardName")}
          </div>

          <div className="form-group d-flex justify-content-between">
            <label
              htmlFor="rewardDescription"
              className={isMobile ? "mr-5 col-3 m-0 p-0" : ""}
            >
              {t("addRewardPopup.rewardDescription")}
            </label>
            <textarea
              id="rewardDescription"
              className={`form-control p-2 ${isMobile ? "mr-1" : "col-10"}`}
              rows="5"
              name="rewardDescription"
              value={rewardData.rewardDescription}
              onChange={handleChange}
            />
            {showError("rewardDescription")}
          </div>

          <div className="d-flex">
            <div className={isMobile ? "form-group" : "form-group"}>
              <SelectInput
                label={t("addRewardPopup.rewardType")}
                placeholder=""
                name="rewardType"
                options={[...RewardCategories]}
                value={rewardData.rewardType}
                onChangeText={handleChange}
              />
              {showError("rewardType")}
            </div>
            <div className={isMobile ? "form-group" : "form-group"}>
              <SelectInput
                label={t("addRewardPopup.rewardApprover")}
                placeholder=""
                name="rewardApprover"
                options={[...Role]}
                value={rewardData.rewardApprover}
                onChangeText={handleChange}
              />
              {showError("rewardApprover")}
            </div>
          </div>

          <div className="mt-3">
            {isMobile ? (
              <div>
                <Col className="p-0">
                  <div className="form-group d-flex justify-content-between">
                    <label
                      htmlFor="rewardCode"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {t("addRewardPopup.rewardCode")}
                    </label>
                    <input
                      type="text"
                      id="rewardCode"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="rewardCode"
                      value={rewardData.rewardCode}
                      onChange={handleChange}
                    />
                    {showError("rewardCode")}
                  </div>
                </Col>

                <Col className="p-0">
                  <div className="form-group d-flex justify-content-between">
                    <label
                      htmlFor="rewardPoints"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {t("addRewardPopup.rewardPoints")}
                    </label>
                    <input
                      type="number"
                      id="rewardPoints"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="rewardPoints"
                      value={rewardData.rewardPoints}
                      onChange={handleChange}
                    />
                    {showError("rewardPoints")}
                  </div>
                </Col>

                <Col className="p-0">
                  <div className="form-group d-flex justify-content-between">
                    <label
                      htmlFor="rewardAmount"
                      className={isMobile ? "mr-5 col-3 p-0 m-0" : ""}
                    >
                      {t("addRewardPopup.rewardAmount")}
                    </label>
                    <input
                      type="number"
                      id="rewardAmount"
                      className={`form-control searchBox text-dark fs14 ${
                        isMobile ? "mr-1" : "col-10"
                      }`}
                      name="rewardAmount"
                      value={rewardData.rewardAmount}
                      onChange={handleChange}
                    />
                    {showError("rewardAmount")}
                  </div>
                </Col>

                <Col className="p-0">
                  <SelectInput
                    label={t("addRewardPopup.rewardStatus")}
                    dateType="text"
                    name="rewardStatus"
                    options={[
                      { key: t("addRewardPopup.active"), value: "active" },
                      { key: t("addRewardPopup.inactive"), value: "inactive" },
                    ]}
                    value={rewardData.rewardStatus}
                    onChangeText={handleChange}
                  />
                  {showError("rewardStatus")}
                </Col>
              </div>
            ) : (
              <div>
                <Row>
                  <Col className="p-0">
                    <TextInput
                      label={t("addRewardPopup.rewardCode")}
                      dateType="text"
                      name="rewardCode"
                      value={rewardData.rewardCode}
                      onChangeText={handleChange}
                    />
                    {showError("rewardCode")}
                  </Col>
                  <Col className="p-0">
                    <TextInput
                      label={t("addRewardPopup.rewardPoints")}
                      dateType="number"
                      name="rewardPoints"
                      value={rewardData.rewardPoints}
                      onChangeText={handleChange}
                    />
                    {showError("rewardPoints")}
                  </Col>
                </Row>

                <Row>
                  <Col className="p-0">
                    <TextInput
                      label={t("addRewardPopup.rewardAmount")}
                      dateType="number"
                      name="rewardAmount"
                      value={rewardData.rewardAmount}
                      onChangeText={handleChange}
                    />
                    {showError("rewardAmount")}
                  </Col>
                  <Col className="p-0">
                    <SelectInput
                      label={t("addRewardPopup.rewardStatus")}
                      dateType="text"
                      name="rewardStatus"
                      options={[
                        { key: t("addRewardPopup.active"), value: "active" },
                        {
                          key: t("addRewardPopup.inactive"),
                          value: "inactive",
                        },
                      ]}
                      value={rewardData.rewardStatus}
                      onChangeText={handleChange}
                    />
                    {showError("rewardStatus")}
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {showAttachment ? (
            <div className={isMobile ? "d-flex justify-content-between" : ""}>
              <label
                htmlFor="comment"
                className={isMobile ? "col-2 p-0 m-0" : ""}
              >
                {t("addRewardPopup.rewardIcon")}
              </label>
              <BrowseFilesNormal
                className="col-12"
                setData={({ url }) => {
                  handleChange({ target: { name: "rewardIcon", value: url } });
                  setShowAttachment(!showAttachment);
                }}
              />
              {showError("rewardIcon")}
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <a
                href={rewardData.rewardIcon ? rewardData.rewardIcon : ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("addRewardPopup.viewRewardIcon")}
              </a>
              <button
                className="btn btn-primary"
                onClick={() => setShowAttachment(!showAttachment)}
              >
                {t("addRewardPopup.reuploadRewardIcon")}
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="buttons">
            <Button
              text={t("addRewardPopup.clear")}
              className="bg-white border-grey"
              handleClick={clearData}
            />
            <Button
              text={
                props.editId
                  ? t("addRewardPopup.update")
                  : t("addRewardPopup.add")
              }
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddRewardPopup;
