import { launchformApi } from "../service/apiVariables";
import { companyId } from "utilities";

export const createForm = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.createForm, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to create launch form";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};

export const updateForm = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.updateForm(id), body, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to update launch form";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};


export const getAllForms = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.getForms, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to fetch launch forms";
        resolve({ message, data: [], success: false });
      });
  });
};
export const getFormById = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.getFormById(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to fetch launch form";
        resolve({ message, data: null, success: false });
      });
  });
};
export const getFormByEmployeeId = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.getFormByEmployeeId(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to fetch launch forms by employee";
        resolve({ message, data: [], success: false });
      });
  });
};
export const deleteForm = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...launchformApi.deleteForm(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to delete launch form";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};