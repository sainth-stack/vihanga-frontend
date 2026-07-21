import { notificationApi } from "../service/apiVariables";

export const updateNotification =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.updateNotification(id), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message })
            Toast({ type: "error", message });
          });
      });
    };
export const updateNotificationGoal =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.updateNotificationGoal(id), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message })
            Toast({ type: "error", message });
          });
      });
    };
export const updateNotificationKR =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.updateNotificationKR(id), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message })
            Toast({ type: "error", message });
          });
      });
    };

export const updateNotificationTask =
  (id, body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.updateNotificationTask(id), body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //  reject(Toast({ type: "error", message })
            Toast({ type: "error", message });
          });
      });
    };
export const getAllNotificationsByUser =
  (id) =>
    (dispatch, getState, { api, Toast }) => {
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.getAllNotificationsByUser(id, user.role) })
          .then(({ message, data, success, count }) => {
            resolve({ message, data, success, count });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getAllNotificationsByUserAll =
  (id) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.getAllNotificationsByUserAll(id) })
          .then(({ message, data, success, count }) => {
            resolve({ message, data, success, count });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getAllNotifications =
  () =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.getAllNotifications })
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
export const getAllNotificationsCount =
  (username) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...notificationApi.getAllNotificationsCount(username) })
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
