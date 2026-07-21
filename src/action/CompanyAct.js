import { companyApi } from "../service/apiVariables";
import { setCompanyConfig } from "../reducer/companyConfigSlice";

export const createCompany = (body) => (dispatch, getState, { api, Toast }) => {
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

export const updateCompany = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...companyApi.updateCompany(id), body })
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

export const createOrUpdateMultipleCompanies = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...companyApi.createOrUpdateMultipleCompanies, body })
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

export const getCompanies = () => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...companyApi.getCompanies })
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

const getCompanyIdFromStorage = () => {
  try {
    const raw = localStorage.getItem("companyId");
    if (raw == null || raw === "") return null;
    const parsed = JSON.parse(raw);
    return parsed != null ? parsed : null;
  } catch {
    return null;
  }
};

export const getCompanyConfig = (companyId) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    // When companyId is passed (e.g. Company Configurations page), use it; else use current user's company from storage
    const effectiveCompanyId = companyId != null && companyId !== "" ? companyId : getCompanyIdFromStorage();
    if (!effectiveCompanyId) {
      resolve({ success: false, data: null });
      return;
    }
    const idForApi = String(effectiveCompanyId);
    api({ ...companyApi.getCompanyConfig(idForApi) })
      .then(({ message, data, success }) => {
        // Only update Redux when loading the current user's company (not when admin views another company's config)
        const isCurrentUserCompany = effectiveCompanyId === getCompanyIdFromStorage();
        if (success && data?.config != null && isCurrentUserCompany) {
          dispatch(setCompanyConfig({ config: data.config, companyId: effectiveCompanyId }));
        }
        resolve({ message, data, success });
      })
      .catch(({ message }) => {
        reject({ message });
      });
  });
};

export const updateCompanyConfig = (companyId, config) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...companyApi.updateCompanyConfig(companyId), body: { config } })
      .then(({ message, data, success }) => {
        // Only update Redux when the saved company is the current user's company (rest of app stays unchanged)
        const isCurrentUserCompany = companyId === getCompanyIdFromStorage();
        if (success && data?.config != null && isCurrentUserCompany) {
          dispatch(setCompanyConfig({ config: data.config, companyId }));
        }
        Toast({ type: "success", message: message || "Config saved", time: 3000 });
        resolve({ message, data, success });
      })
      .catch(({ message }) => {
        Toast({ type: "error", message });
        reject({ message });
      });
  });
};

export const deleteCompany = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...companyApi.deleteCompany(id) })
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