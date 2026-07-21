import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
import wrong from "assets/svg/wrong.svg";
import Button from "components/Company/Button";
import editIcon from "assets/svg/editIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import attachmentIcon from "assets/svg/attachment.svg";
import { useDispatch } from "react-redux";
import { createComment, deleteComment, getAllCommentsByReferenceId, updateComment } from "action/TasksCommentsAct";
import { LoadingIndicator } from "utilities";
import { Toast } from "service/toast";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

const CommentPopup = (props) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation()

  const SubmitComment = () => {
    try {
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      if (user !== null) {
        let requestBody = {
          employeeId: user._id,
          employeeName: user.name,
          comment: comment,
          referenceId: props.krReferenceId,
          attachment: data.url
        }
        setLoading(true);
        let response = dispatch(createComment(requestBody));
        response.then(({ data, message, success }) => {
          if (success) {
            fetchComments();
            setLoading(false);
            setError("");
            queryClient.invalidateQueries("tasks");
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
  }
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
  }
  const handleDelete = (id) => {
    let response = dispatch(deleteComment(id));
    response.then(result => {
      if (result.success) {
        fetchComments();
        queryClient.invalidateQueries("tasks");
      }
    })
  }
  const handleEdit = (id, comment, url = "") => {
    setComment(comment);
    if (url) {
      setData({ url });
    } else {
      setData("");
    }
    setEdit(true);
    setEditId(id);
  }
  const SubmitEdit = () => {
    let body = { comment, attachment: Object.keys(data).length > 0 ? data.url : "" };
    let response = dispatch(updateComment(editId, body));
    response.then(result => {
      if (result.success) {
        fetchComments();
        queryClient.invalidateQueries("tasks");
      }
    })
  }
  useEffect(() => {
    fetchComments();
    //eslint-disable-next-line
  }, [])
  
  // Notify parent on comments change so it can update counts without reload
  useEffect(() => {
    if (typeof props.handlecallback === 'function') {
      props.handlecallback(comments);
    }
  }, [comments]);
useEffect(() => {
  if (props.show) {
    setComment("");
    setData("");
    setEdit(false);
    setEditId("");
  }
}, [props.show]);

  const handleUpload = (fileData, mobile = false) => {
    let file = fileData.target.files[0]
    setUploading(true)
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ma7nge92");
    axios
      .post(
        "https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            let percent = Math.round(
              (progressEvent.uploaded / progressEvent.total) * 100
            );
            if (percent === 25 || percent === 50 || percent === 75 || percent === 100) {
              Toast({ message: "Uploaded " + percent + "%", type: "success", time: 500 })
            }
          },
        }
      )
      .then((response) => {
        Toast({ message: "Uploaded Successfully", type: "success", time: 1000 })
        setData({ url: response.data.secure_url })
        setUploading(false)
      }).catch(error => {
        Toast({ message: "Uploaded Failed", type: "error", time: 1000 })
        setUploading(false)
      })
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
          {t("Tasks.AddComment")}
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
          {loading ? <LoadingIndicator /> : <div>
            <div className="form-group d-flex justify-content-between">
              <label htmlFor="taskTitle">{t("Tasks.Task")}</label>
              <input
                type="text"
                placeholder=""
                id="heading"
                className="form-control col-10 bg-light searchBox text-dark fs14"
                name="heading"
                value={props.data.title}
              />
            </div>
            <div className="form-group d-flex mt-3 justify-content-between">
              <label htmlFor="comment">{t("Tasks.Comment")}</label>
              <textarea
                id="comments"
                className="form-control col-10 p-3"
                rows="3"
                name="comments"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              ></textarea>
            </div>
            <input type="file" placeholder='choosefile' onChange={(e) => handleUpload(e)} accept=".xls,.xlsx,.png,.jpeg,.pdf,.csv" name='file' id='file' className='inputfile' />

            {uploading ? <LoadingIndicator /> :
              <div className="d-flex justify-content-end align-items-center text-center">
                {data ? <div className="d-flex align-items-center">
                  <a className="btn btn-primary m-1" href={data.url} target="_blank">View Attachment</a>
                  <label htmlFor="file"><img src={attachmentIcon} alt="attachment" /></label>
                </div> : <label htmlFor="file"><img src={attachmentIcon} alt="attachment" /></label>}
                <Button text={(t("Tasks.Submit"))} className="p-color border text-white" onClick={isEdit ? SubmitEdit : SubmitComment} />
              </div>}
            <div>
              {comments.length > 0 && comments.map((comment, index) => (
                <Comment index={index} handleDelete={handleDelete} handleEdit={handleEdit} {...comment} />
              ))}
            </div>
          </div>}

        </div>
      </Modal.Body>
    </Modal>
  );
};
const Comment = ({ comment, index, employeeId, employeeName, updatedAt, _id, handleDelete, handleEdit, attachment }) => {
  return (
    <div key={index} className="mb-2 border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        <p>
          {/*<img src={defaultProfilePic} className="userPic" alt="user" />*/}
          {employeeName}  <span title={window.moment(updatedAt).format("DD/MM/YYYY hh:mm:ss A")}>({window.moment(updatedAt).format("DD/MM/YYYY hh:mm:ss A")})</span></p>
        <div className="d-flex">
          <img src={editIcon} alt="edit" className="p-1 cursor-pointer" onClick={() => handleEdit(_id, comment, attachment)} />
          <img src={trashIcon} alt="delete" className="p-1  cursor-pointer" onClick={() => handleDelete(_id)} />
        </div>
      </div>
      <div>
        <p>{comment}</p>
        {attachment && <a href={attachment} target="_blank"><img src={attachmentIcon} alt="attachment" /> View Attachment </a>}
      </div>
    </div>
  )
}
export default CommentPopup;
