import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  loginHandler,
} from "../../action/authAction";
import { registerUser } from "../../action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users:[],
  all_profiles_fetched:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,

    handleLoginUser: (state) => {
      state.message = "Hello Welcome";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN PENDING
      .addCase(loginHandler.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // LOGIN SUCCESS
      .addCase(loginHandler.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload;
        state.message = "Login successful";
      })

      //  LOGIN FAILED
      .addCase(loginHandler.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loggedIn = false;
        state.message = action.payload?.message || "Login failed";
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Registering...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload;
        state.message = "register  successful ,Please Login ";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loggedIn = false;
        state.message = action.payload?.message || "Register failed";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched=true;
        state.all_users=action.payload.profiles
      });
  },
});

export const {
  reset,
  emptyMessage,
  handleLoginUser,
  setTokenThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
