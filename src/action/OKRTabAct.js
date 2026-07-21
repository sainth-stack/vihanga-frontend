/* eslint-disable no-unused-vars */
import { okrManagement2Api, okrManagementApi } from "../service/apiVariables";

export const createOkrTab =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagement2Api.createOkrTab, body })
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

export const createObjectivesAndKeyResults =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagement2Api.createObjectivesAndKeyResults, body })
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
export const updateOkrTab =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagement2Api.updateOkrTab(id), body })
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
export const getAllOkrTab =
  () =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...okrManagement2Api.getAllOkrTab })
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
export const deleteOkrTab = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...okrManagement2Api.deleteOkrTab(id) })
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

export const deleteOkrTabs = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...okrManagement2Api.deleteOkrTabs, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        reject(Toast({ type: "error", message }));
      });
  });
};
