import { previleges } from "reducer/privilegesGroup";
import { privilegesGroupApi } from "../service/apiVariables";

export const createPrivilegeGroup =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...privilegesGroupApi.createPrivilegeGroup, body })
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

export const updatePrivilegeGroup =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...privilegesGroupApi.updatePrivilegeGroup(id), body })
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
export const getAllPrivilegesGroup =
  () =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...privilegesGroupApi.getAllPrivilegesGroup })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            dispatch(previleges(data))
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getPrivilegeGroup =
  (role) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...privilegesGroupApi.getPrivilegeGroup(role) })
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
export const deletePrivilegeGroup = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...privilegesGroupApi.deletePrivilegeGroup(id) })
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

export const deletePrivilegeGroupMultiple = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...privilegesGroupApi.deletePrivilegeGroupMultiple, body })
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

export const updatePrivilegesGroupActive = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...privilegesGroupApi.updatePrivilegesGroupActive, body })
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

export const updatePrivilegesGroupInActive = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...privilegesGroupApi.updatePrivilegesGroupInActive, body })
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