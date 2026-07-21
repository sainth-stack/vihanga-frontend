import { advancedLaunchformApi } from "../service/apiVariables";

export const createForm = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.createForm, body })
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

export const updateForm = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.updateForm(id), body })
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


export const getAllForms = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.getForms })
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
export const getFormById = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.getFormById(id) })
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
export const getFormByEmployeeId = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.getFormByEmployeeId(id) })
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
export const getAdvancedFormByEmployeeId = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.getReviewFormsByEmployeeId(id) })
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
export const deleteForm = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...advancedLaunchformApi.deleteForm(id) })
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