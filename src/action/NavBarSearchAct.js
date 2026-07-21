import { navBarDataApi } from "../service/apiVariables";

export const getNavBarDatas =
  (body = "", keyword) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      return new Promise((resolve, reject) => {
        api({ ...navBarDataApi.getNavbarData(body, userData._id, keyword) })
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
