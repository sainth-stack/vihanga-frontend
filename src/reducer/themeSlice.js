import { createSlice } from "@reduxjs/toolkit";
import { themeApi } from "service/apiVariables";
import { applyThemeToCssVariables } from "theme/applyTheme";

const initialState = {
  theme: null,
  applied: false,
  logoUrl: null,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeState: (state, action) => {
      state.theme = action.payload || null;
      state.logoUrl = action.payload?.logoUrl || null;
    },
    setThemeApplied: (state, action) => {
      state.applied = Boolean(action.payload);
    },
  },
});

export const { setThemeState, setThemeApplied } = themeSlice.actions;

// Thunk: fetch theme for company, cache, and apply CSS variables
export const loadAndApplyTheme = (companyId) => {
  return async (dispatch, getState, { api }) => {
    console.log("compadsfdsfdsnyId", companyId);
    try {
      if (!companyId) return;
      const res = await api(themeApi.getCompanyTheme(companyId));
      const theme = res?.data?.data || res?.data?.theme || res?.data || null;
      if (theme && (theme.primary || theme.secondary)) {
        localStorage.setItem(`theme_${companyId}`, JSON.stringify(theme));
        applyThemeToCssVariables({
          primary: theme?.primary,
          secondary: theme?.secondary,
        });
        dispatch(setThemeState(theme));
        dispatch(setThemeApplied(true));
        return theme;
      }
    } catch (e) {
      // fallback to cache
      try {
        const raw = localStorage.getItem(`theme_${companyId}`);
        if (raw) {
          const theme = JSON.parse(raw);
          applyThemeToCssVariables({
            primary: theme?.primary,
            secondary: theme?.secondary,
          });
          dispatch(setThemeState(theme));
          dispatch(setThemeApplied(true));
          return theme;
        }
      } catch {}
    }
  };
};

export default themeSlice.reducer;


