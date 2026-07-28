import { getServiceUrl } from "service/api";

// Base route under which the whole psychometric assessment flow lives
export const PSYCHOMETRIC_BASE = "/psychometric-test";

// Base URL for the psychometric backend endpoints (e.g. .../api/psychometric)
export const psychometricApi = (path = "") =>
  `${getServiceUrl("production")}psychometric${path}`;

export const PSYCHOMETRIC_STORAGE_KEYS = {
  email: "userEmail",
  candidateId: "candidateId",
  token: "testToken",
  hr: "hr",
};

export const clearPsychometricSession = () => {
  Object.values(PSYCHOMETRIC_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const getPsychometricSession = () => ({
  email: localStorage.getItem(PSYCHOMETRIC_STORAGE_KEYS.email),
  candidateId: localStorage.getItem(PSYCHOMETRIC_STORAGE_KEYS.candidateId),
  token: localStorage.getItem(PSYCHOMETRIC_STORAGE_KEYS.token),
  hr: localStorage.getItem(PSYCHOMETRIC_STORAGE_KEYS.hr),
});

export const setPsychometricSession = ({ email, candidateId, token, hr }) => {
  if (email) localStorage.setItem(PSYCHOMETRIC_STORAGE_KEYS.email, email);
  if (candidateId)
    localStorage.setItem(PSYCHOMETRIC_STORAGE_KEYS.candidateId, candidateId);
  if (token) localStorage.setItem(PSYCHOMETRIC_STORAGE_KEYS.token, token);
  if (hr !== undefined && hr !== null) {
    localStorage.setItem(PSYCHOMETRIC_STORAGE_KEYS.hr, hr);
  }
};
