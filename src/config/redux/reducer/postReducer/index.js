import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPost } from "../../action/postAction";

const initialState = {
  posts: [],
  user: null,
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPost.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all the posts..";
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.reverse();
      })
      .addCase(getAllPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments; 
        state.isError = false;
      })
      ;
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
