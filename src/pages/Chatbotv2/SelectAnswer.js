import React from 'react'
import { getServiceUrl } from 'service/api';
import { chatbotApiV2, reviews_v2 } from 'service/apiVariables';
import { Toast } from 'service/toast';
import { AuthRole, AuthUserId } from 'utilities';

export default function SelectAnswer(props) {
  const selectOption = (selectedOption) => {
    const AuthReviewId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).id : null;
    const AuthReviewEmpId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).toEmployeeId : null;
    const AuthReviewRole = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).role : null;
    const AuthTemplateId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).templateId : null;
    const AuthReviewName = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).name : null;
    if (props.state.response && props.state.response !== null) {
      let { question, ranking, numberOfQuestions, subcategory, category, tag, options, defination } = props.state.response;
      let answer = selectedOption;
      let responsetime = "100";
      let score = 1;
      let scores = [1, 2, 3, 4];
      if (tag === "NFMA") {
        score = scores[options.findIndex(item => item === answer)];
      } else {
        scores = scores.sort().reverse();
        score = scores[options.findIndex(item => item === answer)];
      }
      //api call
      fetch(getServiceUrl("production") + chatbotApiV2.sendMessage(AuthUserId, AuthRole, answer, AuthReviewEmpId, AuthReviewRole, AuthTemplateId).api, {
        method: "post",
        body: JSON.stringify({
          question: question.toString().replace(/&username/gi, AuthReviewName), ranking, numberOfQuestions, subcategory, category, answer, responsetime, score, defination, tag, templateId: AuthTemplateId
        }),
        headers: {
          "content-type": "application/json"
        }
      }).then(response => response.json())
        .then(data => {
          let message = "";
          if (data.message !== "Thank you") {
            message = props.actionProvider.createChatbotMessage(data.data.question.toString().replace(/&username/gi, AuthReviewName),
              {
                withAvatar: true,
                widget: 'singleFlight',
              });
          } else {
            message = props.actionProvider.createChatbotMessage(`Thank you for the conversation`);
          }
          if (data.message === "Thank you") {
            console.log("if last question")
            fetch(getServiceUrl("production") + reviews_v2.createReview.api, {
              method: "post",
              body: JSON.stringify({
                userId: AuthUserId, userRole: AuthRole, reviewedId: AuthReviewId, reviewedRole: AuthReviewRole, templateId: AuthTemplateId
              }),
              headers: {
                "content-type": "application/json"
              }
            }).then(response => response.json())
              .then(data => {
                let message2 = props.actionProvider.createChatbotMessage(answer);
                props.setState((prev) => ({
                  ...prev,
                  response: null,
                  messages: [...prev.messages, { ...message2, type: "user" }],
                }));
                props.setState((prev) => ({
                  ...prev,
                  response: null,
                  messages: [...prev.messages, message],
                }));
                setTimeout(() => {
                  window.location.reload();
                }, 5000);
              });
          } else {
            console.log("if not last question")
            let message2 = props.actionProvider.createChatbotMessage(answer);
            props.setState((prev) => ({
              ...prev,
              response: data.data,
              messages: [...prev.messages, { ...message2, type: "user" }],
            }));
            props.setState((prev) => ({
              ...prev,
              response: data.data,
              messages: [...prev.messages, message],
            }));
          }
        }).catch(error => {
          console.log("Error", error);
          Toast({ type: "error", message: "Something went wrong", time: 5000 });
        })
    } else {
      fetch(getServiceUrl("production") + reviews_v2.createReview.api, {
        method: "post",
        body: JSON.stringify({
          userId: AuthUserId, userRole: AuthRole, reviewedId: AuthReviewId, reviewedRole: AuthReviewRole, templateId: AuthTemplateId
        }),
        headers: {
          "content-type": "application/json"
        }
      }).then(response => response.json())
        .then(data => {
          let message2 = props.actionProvider.createChatbotMessage(selectedOption);
          props.setState((prev) => ({
            ...prev,
            response: null,
            messages: [...prev.messages, { ...message2, type: "user" }],
          }));
          let message = props.actionProvider.createChatbotMessage(`Thank you for the conversation`);
          props.setState((prev) => ({
            ...prev,
            response: null,
            messages: [...prev.messages, message],
          }));
        })
    }
  }
  return (
    <div>
      <div className='d-flex flex-wrap ml-5'>
        {props.state.response && props.state.response !== null && props.state.response.options && props.state.response.options.length > 0 && props.state.response.options.map((option, index) => (
          <button className='btn btn-outline-primary rounded m-1 btn-sm' onClick={() => selectOption(option)} key={index}>{option}</button>
        ))}
      </div>
    </div>
  )
}
