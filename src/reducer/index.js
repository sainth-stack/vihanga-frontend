import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  data: [],
  keyresults: [],
  multiStatus: []
}

const talentSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {
    actions: (state,action) => {
      state.data = [...state.data,...action.payload]
    },
    objectives: (state,action) => {
      state.data = [...state.data,...action.payload]
    },
    keyresults: (state,action) => {
      state.keyresults = {...state.keyresults, ...action.payload}
    },
    multiStatus: (state,action) => {
      state.multiStatus = action.payload;
    }
  }
})

export const {actions,objectives,keyresults,multiStatus} = talentSlice.actions;

export default talentSlice.reducer;

// export const reducers = combineReducers({
//   home,
//   privilegesGroup
// })
