import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  loginHandler,
  registerUser,
  getMyConnectionRequests,
  getMyConnections,
  acceptConnection,
} from "../../action/authAction";

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
  incomingRequests: [],
  sentRequests: [],
  all_users: [],
  all_profiles_fetched: false,
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

      .addCase(loginHandler.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginHandler.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload;
        state.message = "Login successful";
      })
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
        state.message = "Register successful, Please Login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loggedIn = false;
        state.message = action.payload?.message || "Register failed";
      })

      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileFetched = true;
        state.user = action.payload;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })

      .addCase(getMyConnections.fulfilled, (state, action) => {
        const {
          incomingRequests = [],
          sentRequests = [],
          connections = [],
        } = action.payload;

        state.incomingRequests = incomingRequests;
        state.sentRequests = sentRequests;
        state.connections = connections;
      })

      .addCase(getMyConnections.rejected, (state, action) => {
        state.message = action.payload;
      })

      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(acceptConnection.fulfilled, (state, action) => {
        const { requestId, accept_type } = action.payload;

        state.connectionRequest = state.connectionRequest.map((req) =>
          req._id === requestId
            ? { ...req, status_accepted: accept_type === "accept" }
            : req,
        );
      })

      .addCase(acceptConnection.rejected, (state, action) => {
        state.message = action.payload;
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
