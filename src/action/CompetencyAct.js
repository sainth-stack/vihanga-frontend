import { competencies } from "../service/apiVariables";

export const createCompetency = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...competencies.createCompetency, body })
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

export const updateCompetency = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...competencies.updateCompetency(id), body })
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


export const getAllCompetencies = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...competencies.getCompetencies })
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

export const deleteCompetency = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...competencies.deleteCompetency(id) })
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