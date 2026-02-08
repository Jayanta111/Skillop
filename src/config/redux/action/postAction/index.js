import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPost = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200) {
        return fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.rejectWithValue("Post not Uploaded");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);
