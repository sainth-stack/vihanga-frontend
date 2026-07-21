import { openEndedQuestions } from "../service/apiVariables";

export const createOpenEndedQuestion = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...openEndedQuestions.createQuestion, body })
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

export const getAllOpenEndedQuestions = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...openEndedQuestions.getQuestions })
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

export const deleteOpenEndedQuestions = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...openEndedQuestions.deleteQuestion(id) })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        // reject(Toast({ type: "error", message }));
        Toast({ type: "error", message });
        console.log("get error", message);
      });
  });
};