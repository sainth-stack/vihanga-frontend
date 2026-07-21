import { templates } from "../service/apiVariables";
import { companyId } from "utilities";

export const createTemplate = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...templates.createTemplate, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to create template";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};

export const updateTemplate = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...templates.updateTemplate(id), body, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to update template";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};


export const getAllTemplates = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...templates.getTemplates, params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to fetch templates";
        // Avoid rejecting to prevent UI hang
        resolve({ message, data: [], success: false });
      });
  });
};

export const getTemplateById = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...templates.getTemplateById(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to fetch template";
        resolve({ message, data: null, success: false });
      });
  });
};
export const deleteTemplate = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...templates.deleteTemplate(id), params: { companyId } })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch((err) => {
        const message = err?.message || err?.data?.message || err?.response?.data?.message || "Failed to delete template";
        Toast({ type: "error", message });
        resolve({ message, data: null, success: false });
      });
  });
};