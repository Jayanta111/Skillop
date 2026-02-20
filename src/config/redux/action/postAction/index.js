import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";

export const getAllPost = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");

      return response.data.posts;
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

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);

export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", {
        post_id: post.post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comment", {
        params: {
          post_id: postData.post_id,
        },
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data.comments, 
        post_id: postData.post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        body: commentData.body,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Server Error");
    }
  },
);
