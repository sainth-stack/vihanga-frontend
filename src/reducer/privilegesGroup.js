import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  privilegeGroup: {
    groupName: "",
    groupMembers: [
      { categoryName: "", categoryValues: [], categoryValue: "", categoryValueText: "" }
    ],
    excludeGroupMembers: [
      { categoryName: "", categoryValues: [], categoryValue: "", categoryValueText: "" }
    ],
    activeGroupMembers: [],
    actualActiveGroupMembers: [],
    inActiveGroupMembers: [],
  },
};

const previlegesSlice = createSlice({
  name: 'previleges',
  initialState,
  reducers: {
    previleges: (state, action) => {
      state.privilegeGroup = { ...state.privilegeGroup, ...action.payload }
    }
  }
})

export const { previleges } = previlegesSlice.actions;

export default previlegesSlice.reducer;

// const previlegesGroup = (state = initialState, { type, payload }) => {
//   switch (type) {
//     case "UPDATE_PRIVILEGE_GROUP": {
//       return { ...state, privilegeGroup: payload }
//     }
//     default:
//       return state;
//   }
// };

// export default previlegesGroup;