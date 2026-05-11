import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
  name: "user",
  initialState:{
    isloggedin:false,
    user:null
  },
  reducers: {
    loginfunc: (state, action) => {
    //   state.user = action.payload;
      state.isloggedin = true;

state.user=action.payload
    },
    logoutfunc: (state) => {
    //   state.user = null;
      state.isloggedin = false;

      state.user=null

    },
  },
});

export const { loginfunc, logoutfunc} = userSlice.actions;
export default userSlice.reducer;