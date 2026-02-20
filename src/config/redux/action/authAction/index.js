import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const loginHandler = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (!response.data?.token) {
        return thunkAPI.rejectWithValue({
          message: "Token not provided",
        });
      }

      localStorage.setItem("token", response.data.token);

      return response.data.token;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Login failed" }
      );

    }
  }
);


export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return response.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Register failed" }
      );

    }
  }
);


export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/get_user_and_profile",
        {
          params: { token:user.token }
        }
      );

      return thunkAPI.fulfillWithValue (response.data);

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Get User failed" }
      );

    }
  }
);


export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/user/get_all_users"
      );

      return response.data;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Failed to fetch users" }
      );

    }
  }
);



export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async ({ token }, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/user/get_my_connection_requests",
        {
          params: { token }
        }
      );

      return response.data.connections;

    } catch (err) {

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch requests"
      );

    }
  }
);


export const getMyConnections = createAsyncThunk(
  "user/getMyConnections",
  async ({ token }, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: { token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch connections");
    }
  }
);



export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async ({ token, connectionId }, thunkAPI) => {
    try {

      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token,
          connectionId
        }
      );

      return response.data;

    } catch (err) {

      console.log("SEND ERROR:", err.response?.data);

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Connection failed"
      );

    }
  }
);

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async ({ token, requestId, accept_type }, thunkAPI) => {
    try {

      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          token: token,
          requestId: requestId,
          accept_type: accept_type
        }
      );

      return response.data;

    } catch (err) {

      console.log("ACCEPT ERROR:", err.response?.data);

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Action failed"
      );

    }
  }
);
