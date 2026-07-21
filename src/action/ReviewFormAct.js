import { reviewForm } from "../service/apiVariables";
import { companyId } from "utilities";


export const createReviewForm = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.createReviewForm, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to create review form";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};
export const createMultipleReviewForm = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.createMultipleReviewForm, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to create review forms";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};
export const updateReviewForm = (id, body, noToast = false) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.updateReviewForm(id), body, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        if (!noToast) {
          Toast({ type: "success", message, time: 5000 });
        }
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to update review form";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};

export const updateReviewFormMultiple = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.updateReviewFormMultiple, body, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to update review forms";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};
export const getReviewFormByUserId =
  (id) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...reviewForm.getReviewFormByUserId(id), params: { companyId } })
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

export const getReviewFormById =
  (id) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...reviewForm.getReviewFormById(id), params: { companyId } })
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
export const getAllReviewsForm = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.getAllReviewsForm, params: { companyId } })
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

export const getReviewChartData = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.getChartData, params: { companyId } })
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
export const deleteReviewForm = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...reviewForm.deleteReviewForm(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        reject(Toast({ type: "error", message }));
      });
  });
};