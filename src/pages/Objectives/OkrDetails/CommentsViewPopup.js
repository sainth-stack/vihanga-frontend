import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import userProfile from "assets/svg/userprofile.png";
import editIcon from "assets/svg/editIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import Button from "components/Company/Button";
import { useDispatch } from "react-redux";
import {
  createComment,
  deleteComment,
  getAllCommentsByReferenceId,
  updateComment,
} from "action/CommentsAct";
import { LoadingIndicator } from "utilities";
import { useTranslation } from "react-i18next";

const ViewCommentPopup = (props) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState(false);
  const SubmitComment = () => {
    try {
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      if (user !== null) {
        let requestBody = {
          employeeId: user._id,
          employeeName: user.name,
          comment: comment,
          referenceId: props.krReferenceId,
        };
        setLoading(true);
        let response = dispatch(createComment(requestBody));
        response.then(({ data, message, success }) => {
          if (success) {
            fetchComments();
            setLoading(false);
            setError("");
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const fetchComments = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllCommentsByReferenceId(props.krReferenceId));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setComments(data);
          setLoading(false);
          setError("");
          setComment("");
        } else if (data.length === 0) {
          setLoading(false);
          setComments([]);
          setComment("");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleDelete = (id) => {
    let response = dispatch(deleteComment(id));
    response.then((result) => {
      if (result.success) {
        fetchComments();
      }
    });
  };
  const handleEdit = (id, comment) => {
    setComment(comment);
    setEdit(true);
    setEditId(id);
  };
  const SubmitEdit = () => {
    let body = { comment };
    let response = dispatch(updateComment(editId, body));
    response.then((result) => {
      if (result.success) {
        fetchComments();
      }
    });
  };
  useEffect(() => {
    fetchComments();
    //eslint-disable-next-line
  }, []);

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
          {t("OKR Details.View Comments")}
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
          {error.length > 0 && (
            <p className="text-center text-danger">{error}</p>
          )}
          {loading ? (
            <LoadingIndicator />
          ) : (
            <div>
              <div>
                {comments.length > 0 &&
                  comments.map((comment, index) => (
                    <Comment
                      index={index}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      {...comment}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const Comment = ({
  comment,
  index,
  employeeId,
  employeeName,
  updatedAt,
  _id,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div key={index}>
      <div className="d-flex justify-content-between align-items-center">
        <p>
          <img src={userProfile} className="userPic" alt="user" />{" "}
          {employeeName}{" "}
          <span
            title={window.moment(updatedAt).format("DD/MM/YYYY hh:mm:ss A")}
          >
            ({window.moment(updatedAt).fromNow()})
          </span>
        </p>
        <div className="d-flex">
          <img
            src={editIcon}
            alt="edit"
            className="p-1 cursor-pointer"
            onClick={() => handleEdit(_id, comment)}
          />
          <img
            src={trashIcon}
            alt="delete"
            className="p-1  cursor-pointer"
            onClick={() => handleDelete(_id)}
          />
        </div>
      </div>
      <div>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default ViewCommentPopup;
