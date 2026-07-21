import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  responses: {
    ImplementationSpecialists: 0,
    RealWorlders: 0,
    DisruptiveInnovator: 0,
  },
  selectedAnswers: {}, // Track selected options for each question
};

const quizSlice = createSlice({
  name: "quizCategories",
  initialState,
  reducers: {
    incrementCategory: (state, action) => {
      const { questionId, category } = action.payload;
      const categories = Array.isArray(category) ? category : [category];

      categories.forEach((cat) => {
        const trimmedCat = cat.trim();
        if (state.responses[trimmedCat] !== undefined) {
          state.responses[trimmedCat] += 1;
        }
      });

      state.selectedAnswers[questionId] = categories;
    },
    decrementCategory: (state, action) => {
      const { questionId, category } = action.payload;
      const categories = Array.isArray(category) ? category : [category];

      categories.forEach((cat) => {
        const trimmedCat = cat.trim();
        if (
          state.responses[trimmedCat] !== undefined &&
          state.responses[trimmedCat] > 0
        ) {
          state.responses[trimmedCat] -= 1;
        }
      });

      delete state.selectedAnswers[questionId];
    },
    resetQuiz: (state) => {
      state.responses = { ...initialState.responses };
      state.selectedAnswers = {};
    },
  },
});

export const { incrementCategory, decrementCategory, resetQuiz } =
  quizSlice.actions;
export default quizSlice.reducer;
