import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
  name: "user",
  initialState:{
    isloggedin:false
  },
  reducers: {
    loginfunc: (state, action) => {
    //   state.user = action.payload;
      state.isloggedin = true;
    },
    logoutfunc: (state) => {
    //   state.user = null;
      state.isloggedin = false;
    },
  },
});

export const { loginfunc, logoutfunc} = userSlice.actions;
export default userSlice.reducer;