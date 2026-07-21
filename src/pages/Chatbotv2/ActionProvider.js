import { getServiceUrl } from "service/api";
import { chatbotApiV2 } from "service/apiVariables";
import { Toast } from "service/toast";
import { AuthRole, AuthUserId } from "utilities";

class ActionProvider {
  constructor(
    createChatbotMessage,
    setStateFunc,
    createClientMessage
  ) {
    this.createChatbotMessage = createChatbotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }
  nextQuestion(answer) {
    const message = this.createChatbotMessage(answer,
      {
        withAvatar: true,
        delay: 500,
        widget: 'singleFlight',
      });

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
  handleHello(numberOfQuestions = 0) {
    const AuthReviewName = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).name : null;
    const AuthReviewEmpId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).toEmployeeId : null;
    const AuthReviewRole = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).role : null;
    const AuthTemplateId = localStorage.getItem("reviewData") != null ? JSON.parse(localStorage.getItem("reviewData")).templateId : null;

    let answer = "undefined";
    fetch(getServiceUrl("production") + chatbotApiV2.sendMessage(AuthUserId, AuthRole, answer, AuthReviewEmpId, AuthReviewRole, AuthTemplateId).api, {
      method: "post"
    }).then(response => response.json())
      .then(data => {
        if (data.message === "Already Finished") {
          const message = this.createChatbotMessage(`You have already finished!`,
            {
              withAvatar: true,
              delay: 0
            });

          this.setState((prev) => ({
            ...prev,
            response: null,
            messages: [...prev.messages, message],
          }));
        } else {
          const message = this.createChatbotMessage(`${data.data.question.toString().replace(/&username/gi, AuthReviewName)}`,
            {
              withAvatar: true,
              delay: 0,
              widget: 'singleFlight'
            });

          this.setState((prev) => ({
            ...prev,
            response: data.data,
            messages: [...prev.messages, message],
          }));
        }
      }).catch(error => {
        console.log("Error", error);
        Toast({ type: "error", message: "No Self Review Done Yet!", time: 5000 });
      });
  }

  handleHowAreYou() {
    const message = this.createChatbotMessage('Sorry, Please choose valid option!');

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
}

export default ActionProvider;