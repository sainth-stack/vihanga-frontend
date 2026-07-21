import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
const CommentPopup = (props) => {
  const [comment, setComment] = useState("");
  const SubmitComment = () => {
    props.handlecallback({
      comment: comment,
    });
  }

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
          Add Comment
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
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comments"
              className="form-control p-3"
              rows="5"
              name="comments"
              value={comment}
              onChange={(event) => setComment(event.target.value)}             ></textarea>
          </div>
        </div>
        <div className="buttons">
          <Button onClick={SubmitComment} text="Submit" className="bg-green border text-white" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CommentPopup;
