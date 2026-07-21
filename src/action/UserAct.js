import { companyApi, employeeRewardsApi, goalsApi, userApi } from "../service/apiVariables";
import { objectiveApi } from "../service/apiVariables";

export const createQuizCategory =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...companyApi.createCompany, body })
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
export const getObjectives =
  (body = "", id) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      console.log(body, id, "dsfsdfdsfds")
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectives(body, id ? id : userData._id) })
          .then(({ message, data, privileges, success, lineManager, companyHead }) => {
            resolve({ message, data, privileges, success, lineManager, companyHead });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };

export const getObjectivesDashboard =
  (body = "", id) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectivesDashboard(body, id ? id : userData._id) })
          .then(({ message, data, success }) => {
            resolve({ message, data, success, });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getObjectivesAndOKRTab =
  (body = "", id) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectivesAndOKRTab(body, id ? id : userData._id) })
          .then(({ message, data }) => {
            resolve({ message, data });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getObjectivesTabs =
  (body = "", id, tabType) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getObjectivesTabs(body, id ? id : userData._id, tabType) })
          .then(({ message, data, privileges, success, lineManager, companyHead }) => {
            resolve({ message, data, privileges, success, lineManager, companyHead });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getSimilarObjectives =
  (body = "", objectiveId, id, tabType) =>
    (dispatch, getState, { api, Toast }) => {
      let userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.getSimilarObjectives(body, id ? id : userData._id, tabType, objectiveId) })
          .then(({ message, data, privileges, success, lineManager, companyHead }) => {
            resolve({ message, data, privileges, success, lineManager, companyHead });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getObjectivesOCR = (id) =>
  (dispatch, getState, { api, Toast }) => {
    let selectedTab = localStorage.getItem("selectedTab") !== null ? JSON.parse(localStorage.getItem("selectedTab")) : null;
    return new Promise((resolve, reject) => {
      api({ ...objectiveApi.getObjectivesOCR(id, selectedTab.tab) })
        .then(({ message, data }) => {
          resolve({ message, data });
          //Toast({ type: "success", message, time: 5000 });
        })
        .catch(({ message }) => {
          //reject(Toast({ type: "error", message }));
          console.log("get error", message);
        });
    });
  }
export const getObjectivesRewardPoints = (id, role, tab) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...objectiveApi.getObjectivesRewardPoints(id, role, tab) })
        .then(({ message, data }) => {
          resolve({ message, data });
          //Toast({ type: "success", message, time: 5000 });
        })
        .catch(({ message }) => {
          //reject(Toast({ type: "error", message }));
          console.log("get error", message);
        });
    });
  }
export const empWithRewards = (id, role, tab) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...employeeRewardsApi.empWithRewards(id, role, tab) })
        .then(({ message, data }) => {
          resolve({ message, data });
          //Toast({ type: "success", message, time: 5000 });
        })
        .catch(({ message }) => {
          //reject(Toast({ type: "error", message }));
          console.log("get error", message);
        });
    });
  }
export const deleteObjectives =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.deleteObjectives, body })
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
            // reject(Toast({ type: "error", message }));
            Toast({ type: "error", message });
          });
      });
    };
export const cascadeObjective =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.cascadeObjective, body })
          .then(({ message, data, success }) => {
            if (success) {
              resolve({ message, data, success });
              Toast({ type: "success", message, time: 5000 });
            } else {
              reject({ message, data, success });
              Toast({ type: "error", message, time: 5000 });
            }
          })
          .catch(({ message }) => {
            reject({ message, success: false });
            Toast({ type: "error", message });
          });
      });
    };
export const cascadeGoal =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...goalsApi.cascadeGoal, body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message });
            Toast({ type: "error", message });
          });
      });
    };
export const cascadeObjectiveWithKeyResults =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...objectiveApi.cascadeObjectiveWithKeyResults, body })
          .then(({ message, data, success }) => {
            if (success) {
              resolve({ message, data, success });
              Toast({ type: "success", message, time: 5000 });
            } else {
              reject({ message, data, success });
              Toast({ type: "error", message, time: 5000 });
            }
          })
          .catch(({ message }) => {
            reject({ message, success: false });
            Toast({ type: "error", message });
          });
      });
    };
export const updateObjective = (id, body) => (dispatch, getState, { api, Toast }) => {
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

export const updateObjectiveCascaded = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...objectiveApi.updateObjectiveCascaded(id), body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        console.log("error", message);
        //reject(Toast({ type: "error", message }));
      });
  });
};
export const register =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.register, body })
          .then((res) => {
            resolve(res);
            const message = "Registration Successful"
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message }));
            Toast({ type: "error", message });
          });
      });
    };
export const login =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.login, body })
          .then((res) => {
            if (res.freeTrail) {
              const message = "To enhance your user experience, please upgrade to our professional membership to access login features."
              // reject(Toast({ type: "error", message }));
              Toast({ type: "error", message });
            }
            else {
              resolve(res);
              const message = "Login Successful"
              Toast({ type: "success", message, time: 5000 });
            }
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message }));
            Toast({ type: "error", message });
            console.log("get error", message);
          });
      });
    };


export const maLogin =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.malogin, body })
          .then((res) => {
            resolve(res);
            const message = "Login Successful"
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message });
            Toast({ type: "error", message });
            console.log("get error", message);
          });
      });
    };

export const emailLinkLogin =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.emailLinkLogin, body })
          .then((res) => {
            resolve(res);
            const message = "Login Successful";
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            Toast({ type: "error", message });
            console.log("get error", message);
          });
      });
    };


export const forgotpassword =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.forgotpassword, body })
          .then((res) => {
            resolve(res);
            const message = "Please check your mail to reset the password!"
            Toast({ type: "success", message: res.success ? message : res.message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message });
            Toast({ type: "error", message });
          });
      });
    };

export const resetpassword =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...userApi.resetpassword, body })
          .then((res) => {
            resolve(res);
            const message = "Reset Password Successful!"
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            // reject(Toast({ type: "error", message });
            Toast({ type: "error", message });
          });
      });
    };