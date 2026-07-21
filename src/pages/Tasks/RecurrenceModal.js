import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import {
  daysOptions,
  LoadingIndicator,
  recurrenceDays,
  recurrenceEndOptions,
  recurrenceNumbers,
  recurrenceOptions,
} from "utilities";

import Select from "react-select";
const RecurrenceModal = (props) => {
  const [recurrence, setRecurrence] = useState({
    repeat: "Week",
    every: 1,
    onDays: [],
    end: "on this day",
    endDate: null,
  });
  const handleChange = ({ target: { name, value } }) => {
    let updatedRecurrence = { ...recurrence };
    updatedRecurrence[name] = value;
    setRecurrence(updatedRecurrence);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const SubmitComment = () => {
    try {
      let updatedRecurrence = { ...recurrence };
      updatedRecurrence.endDate = window
        .moment(updatedRecurrence.endDate)
        .format("YYYY-MM-DD");
      props.handleRecurrence(updatedRecurrence);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
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
          Recurrence
        </Modal.Title>
        <img
          src={wrong}
          alt="wrong"
          onClick={props.onHide}
          style={{ cursor: "pointer" }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light-white rounded-12  p-4 m-4 ">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <div>
              <div className="form-group d-flex justify-content-start align-items-center">
                <label className="col-lg-3">Repeat</label>
                <Select
                  defaultValue={recurrenceOptions[0]}
                  options={recurrenceOptions}
                  onChange={(e) =>
                    handleChange({ target: { name: "repeat", value: e.value } })
                  }
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "#2A7A7B",
                    },
                  })}
                />
              </div>
              <div className="form-group d-flex justify-content-start align-items-center">
                <label className="col-lg-3">Every</label>
                <Select
                  defaultValue={recurrenceNumbers[0]}
                  options={recurrenceNumbers}
                  onChange={(e) =>
                    handleChange({ target: { name: "every", value: e.value } })
                  }
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "#2A7A7B",
                    },
                  })}
                />
                &nbsp;&nbsp;({recurrence.repeat}'s)
              </div>
              <div className="form-group d-flex justify-content-start align-items-center">
                <label className="col-lg-3">On</label>
                {daysOptions.map((day, index) => (
                  <p
                    className={`btn rounded m-1 bg-${
                      recurrence.onDays.includes(day.value)
                        ? "green"
                        : "secondary"
                    } text-white`}
                    onClick={() => {
                      let days = recurrence.onDays;
                      if (days.includes(day.value)) {
                        days = days.filter((item) => item !== day.value);
                      } else {
                        days.push(day.value);
                      }
                      setRecurrence((prev) => {
                        return { ...prev, onDays: days };
                      });
                    }}
                    key={index}
                  >
                    {day.label}
                  </p>
                ))}
              </div>
              <div className="form-group d-flex justify-content-start align-items-center">
                <label className="col-lg-3">End</label>
                <Select
                  defaultValue={recurrenceEndOptions[0]}
                  options={recurrenceEndOptions}
                  onChange={(e) =>
                    handleChange({ target: { name: "end", value: e.value } })
                  }
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "#2A7A7B",
                    },
                  })}
                />
                <input
                  type="date"
                  className="rounded p-1 m-1 border"
                  value={recurrence.endDate}
                  name="endDate"
                  onChange={handleChange}
                />
              </div>
              <div>
                {recurrence.onDays.length > 0 && (
                  <p>
                    Occurs{" "}
                    <b>
                      every{" "}
                      {recurrence.onDays
                        .map((day) => recurrenceDays[day])
                        .join(",")}
                    </b>{" "}
                    starting {recurrenceDays[recurrence.onDays[0]]},{" "}
                    {window.moment(recurrence.endDate).format("DD MMMM YYYY")}.{" "}
                  </p>
                )}
              </div>
              <div className="d-flex justify-content-end text-center">
                <Button
                  text="Cancel"
                  className="bg-danger border text-white"
                  onClick={props.onHide}
                />
                <Button
                  text="Save"
                  className="bg-green border text-white"
                  onClick={SubmitComment}
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default RecurrenceModal;
