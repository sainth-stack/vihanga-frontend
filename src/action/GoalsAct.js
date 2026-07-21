import { goalsApi } from "../service/apiVariables";
import { objectiveApi } from "../service/apiVariables";
export const getObjectives =
  (body = "", id) =>
    (dispatch, getState, { api, Toast }) => {
      let userData =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectives(body, id ? id : userData._id) })
          .then(({ message, data, privileges, success }) => {
            resolve({ message, data, privileges, success });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };

export const getObjectiveSingle =
  (objectiveId, userRole) =>
    (dispatch, getState, { api, Toast }) => {
      let userData =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectives(userRole || userData.role, userData._id, objectiveId) })
          .then(({ message, data, privileges, success }) => {
            if (success && data && data.length > 0) {
              const singleObjective = data[0];
              resolve({ message, data: singleObjective, privileges, success });
            } else {
              Toast({ type: "error", message: "Objective not found" });
              reject({ message: message || "Objective not found" });
            }
          })
          .catch(({ message }) => {
            Toast({ type: "error", message });
          });
      });
    };

export const deleteObjectives =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.deleteObjectives, body: { ...body } })
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
export const createObjective =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.createObjective, body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //  reject(Toast({ type: "error", message }));
            Toast({ type: "error", message });
          });
      });
    };
export const cascadeObjective =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...goalsApi.cascadeObjective, body })
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
export const updateObjective =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.updateObjective(id), body })
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

export const approveAllObjectives =
  (companyId, managerId) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.approveAllObjectives(companyId, managerId) })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            Toast({ type: "error", message });
          });
      });
    };
