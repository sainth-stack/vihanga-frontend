import { chatbotApi } from "../service/apiVariables";

export const chatbotSendMessage =
  (userId, numberOfQuestions, answer, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...chatbotApi.sendMessage(userId, numberOfQuestions, answer), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message }));
            Toast({ type: "error", message });
          });
      });
    };
export const getChats =
  (body = "", id) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...chatbotApi.getAllChats })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };