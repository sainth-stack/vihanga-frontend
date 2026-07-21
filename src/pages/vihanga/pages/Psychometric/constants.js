import { getServiceUrl } from "service/api";

// Base route under which the whole psychometric assessment flow lives
export const PSYCHOMETRIC_BASE = "/psychometric-test";

// Google OAuth client id used for candidate login
export const REACT_APP_GOOGLE_CLIENT_ID =
  "573823221354-d175srri1ta9un581atkp7b9qenst32u.apps.googleusercontent.com";

// Base URL for the psychometric backend endpoints (e.g. .../api/psychometric)
export const psychometricApi = (path = "") =>
  `${getServiceUrl("production")}psychometric${path}`;
