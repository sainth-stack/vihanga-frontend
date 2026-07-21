import { okrManagementApi } from "../service/apiVariables";

export const createOkrLibrary =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.createOkrLibrary, body })
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

export const createObjectives =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.createObjectives, body })
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

export const createGoals =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.createGoals, body })
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
export const copyObjectives =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.copyObjectives, body })
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
export const updateOkrLibary =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.updateOkrLibary(id), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            reject(Toast({ type: "error", message }));
          });
      });
    };
export const getAllOkrLibrary =
  () =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagementApi.getAllOkrLibrary })
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
export const deleteOkrLibrary = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...okrManagementApi.deleteOkrLibrary(id) })
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

export const deleteOkrLibraries = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...okrManagementApi.deleteOkrLibraries, body })
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
