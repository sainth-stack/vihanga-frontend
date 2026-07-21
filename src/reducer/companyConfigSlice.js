import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "companyConfig";

const getStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const initialState = {
  companyId: getStored()?.companyId ?? null,
  config: getStored()?.config ?? {},
  // Convenience for Google Sheet feature (from config)
  googleSheetEnable: getStored()?.config?.googleSheetEnable ?? false,
  googleSheetEditURL: getStored()?.config?.googleSheetEditURL ?? "",
  revampCascade: getStored()?.config?.revampCascade ?? false,
};

const persist = (state) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        companyId: state.companyId,
        config: state.config,
      })
    );
  } catch (e) {
    // ignore
  }
};

const companyConfigSlice = createSlice({
  name: "companyConfig",
  initialState,
  reducers: {
    setCompanyConfig: (state, action) => {
      const { config = {}, companyId } = action.payload || {};
      state.companyId = companyId ?? state.companyId;
      state.config = config;
      state.googleSheetEnable = config.googleSheetEnable === true;
      state.googleSheetEditURL = config.googleSheetEditURL ?? "";
      state.revampCascade = config.revampCascade === true;
      persist(state);
    },
    clearCompanyConfig: (state) => {
      state.companyId = null;
      state.config = {};
      state.googleSheetEnable = false;
      state.googleSheetEditURL = "";
      state.revampCascade = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    },
  },
});

export const { setCompanyConfig, clearCompanyConfig } = companyConfigSlice.actions;
export default companyConfigSlice.reducer;
