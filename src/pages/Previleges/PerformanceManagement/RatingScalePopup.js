import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./popup.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import useWindowSize from "components/UseWindowSize";
import Delete from "assets/svg/delete-green.svg";
import plus from "assets/svg/plus.svg";
import { useDispatch } from "react-redux";
import { createRatingScale, getRatingScales, updateRatingScale } from "action/RatingScaleAct";
const RatingScalePopup = (props) => {
  const isMobile = useWindowSize();
  const [, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [ratingScale, setRatingScale] = useState({
    name: "",
    description: "",
    ratingScaleTemplate: "1-5",
    scores: [
      {
        score: 1,
        label: "Ineffective",
        description: "",
      },
      {
        score: 2,
        label: "Somewhat Achieved",
        description: "",
      },
      {
        score: 3,
        label: "Achieved",
        description: "",
      },
      {
        score: 4,
        label: "OverPerformed",
        description: "",
      },
      {
        score: 5,
        label: "Outstanding",
        description: "",
      }],
    companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
  })

  const getRatingScalesAll = () => {
    setLoading(true);
    let response = dispatch(getRatingScales());
    response.then(({ success, message, data }) => {
      if (success) {
        setRatingScale({ ...data[0]?.ratingScale, companyId: data[0]?.companyId });
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const handleSave = () => {
    setLoading(true);
    if (ratingScale._id) {
      let response = dispatch(updateRatingScale(ratingScale._id, ratingScale));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          getRatingScalesAll();
          props.onHide();
        } else {
          setLoading(false);
        }
      });
    } else {
      let response = dispatch(createRatingScale(ratingScale));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          getRatingScalesAll();
          props.onHide();
        } else {
          setLoading(false);
        }
      });
    }
  };
  const handleChangeText = ({ target: { name, value } }) => {
    let newScores = { ...ratingScale }
    newScores[name] = value;
    setRatingScale(newScores);
  }
  const handleChange = ({ target: { name, value } }, index) => {
    let newScores = [...ratingScale.scores];
    newScores[index][name] = value;
    setRatingScale({ ...ratingScale, scores: newScores });
  }
  const handleAdd = () => {
    let newScores = [...ratingScale.scores];
    newScores.push({
      score: "",
      label: "",
      description: "",
    })
    setRatingScale({ ...ratingScale, scores: newScores });
  }

  const handleDelete = (index) => {
    let newScores = [...ratingScale.scores];
    newScores.splice(index, 1);
    setRatingScale({ ...ratingScale, scores: newScores });
  }
  useEffect(() => {
    getRatingScalesAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
          Rating Scale
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="bg-light-white rounded-12 m-2 p-2">
          <div
            className={"form-group d-flex"}
          >
            <label
              htmlFor="name"
              className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1 mr-5"}
              style={{ paddingRight: "65px" }}
            >
              Name
            </label>
            <input
              type="text"
              placeholder=""
              id="name"
              className={`searchBox text-dark fs14 ${isMobile ? "mr-1" : "col-6"
                }`}
              name="name"
              value={ratingScale.name}
              onChange={handleChangeText}
            />
          </div>
          <div
            className={"form-group d-flex"}
          >
            <label
              htmlFor="description"
              className={isMobile ? "mr-5 col-3 m-0 p-0" : "pt-1 pr-3 mr-3"}
            >
              Description
            </label>
            <textarea
              id="description"
              className={`searchBox p-2 ${isMobile ? "mr-1" : "col-6"}`}
              rows="5"
              name="description"
              value={ratingScale.description}
              onChange={handleChangeText}
            />
          </div>
        </div>
        <div className="d-flex mt-3">
          <div className="col-4 p-0 pre-built vh-100">
            <p className="select">Select a pre-built rating scale to get started, or build your own from scratch.</p>
            <div className="ml-5">
              <div>
                <input className="mr-2" type="radio" id="age1" name="ratingScaleTemplate" value="1-3" checked={ratingScale.ratingScaleTemplate === "1-3"}
                  onChange={handleChangeText} />
                <label for="age1">1 - 3</label>
              </div>
              <div>
                <input className="mr-2" type="radio" id="age2" name="ratingScaleTemplate" value="1-5" checked={ratingScale.ratingScaleTemplate === "1-5"}
                  onChange={handleChangeText} />
                <label for="age2">1 - 5</label>
              </div>
              <div>
                <input className="mr-2" type="radio" id="age3" name="ratingScaleTemplate" value="1-7" checked={ratingScale.ratingScaleTemplate === "1-7"}
                  onChange={handleChangeText} />
                <label for="age3">1 - 7</label>
              </div>
              <div>
                <input className="mr-2" type="radio" id="age3" name="ratingScaleTemplate" value="custom" checked={ratingScale.ratingScaleTemplate === "custom"}
                  onChange={handleChangeText} />
                <label for="age3">Build Your Own</label>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="d-flex justify-content-evenly">
              <div className="">
                <label
                  htmlFor="name"
                  className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder=""
                  id="name"
                  className={`searchBoxOne text-dark fs14 ${isMobile ? "mr-1" : ""
                    }`}
                  name="name"
                  value={"sample"}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <label
                  htmlFor="high"
                  className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                >
                  High
                </label>
                <input
                  type="text"
                  placeholder=""
                  id="name"
                  className={`searchBoxOne text-dark fs14 ${isMobile ? "mr-1" : ""
                    }`}
                  name="name"
                  value={""}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <label
                  htmlFor="increment"
                  className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                >
                  Increment
                </label>
                <input
                  type="text"
                  placeholder=""
                  id="increment"
                  className={`searchBoxOne text-dark fs14 ${isMobile ? "mr-1" : ""
                    }`}
                  name="increment"
                  value={""}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4">
                <Button className="bg-green text-white" text="Generate" />
              </div>
            </div>
            <hr />
            {
              ratingScale.scores && ratingScale.scores.map((score, index) => {
                return (
                  <div className="d-flex justify-content-evenly" key={index}>
                    <div className="p-1">
                      <label
                        htmlFor="score"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                      >
                        Score
                      </label>
                      <input
                        type="text"
                        placeholder=""
                        id="score"
                        className={`scoreBox text-dark fs14 ${isMobile ? "mr-1" : ""
                          }`}
                        name="score"
                        value={score?.score}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div className="p-1">
                      <label
                        htmlFor="label"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                      >
                        Label
                      </label>
                      <input
                        type="text"
                        placeholder=""
                        id="name"
                        className={`label-area text-dark fs14 ${isMobile ? "mr-1" : ""
                          }`}
                        name="label"
                        value={score?.label}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div className="p-1">
                      <label
                        htmlFor="description"
                        className={isMobile ? "mr-5 col-3 p-0 m-0" : "pt-1"}
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        className={`textarea-description p-2 ${isMobile ? "mr-1" : ""}`}
                        rows="4"
                        cols="12"
                        name="description"
                        value={score?.description}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Give Detail Description..."
                      />
                    </div>
                    <div className="d-flex flex-start pl-1">
                      {
                        (ratingScale.scores.length - 1 === index) && (
                          <button
                            className="bg-white p-0 mr-1"
                            type="button"
                            onClick={handleAdd}
                          >
                            <img src={plus} alt="plus" />
                          </button>
                        )
                      }
                      <button
                        className="bg-white p-0"
                        type="button"
                        onClick={() => handleDelete(index)}
                      >
                        <img src={Delete} alt="delete" />
                      </button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div>
          <div className="buttons">
            <Button
              text="Cancel"
              className="bg-white border-grey"
              handleClick={props.onHide}
            />
            <Button
              text="Save"
              className="bg-green border text-white"
              handleClick={handleSave}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RatingScalePopup;
