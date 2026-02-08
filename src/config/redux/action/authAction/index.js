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

export const registerUser=createAsyncThunk(
    "user/register",
    async(user,thunkAPI)=>{
        try{
     const request=await clientServer.post("/register",{
      username:user.username,
      password:user.password,
      email:user.email,
      name:user.name,
     })
        }
        catch(err){
          return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Register failed" }
      );
        }
    }
)

export const getAboutUser=createAsyncThunk(
  "user/getAboutUser",
  async(user,thunkAPI)=>{
    try{
      const response=await clientServer.get("/get_user_and_profile",{
      params:{
        token:user.token

      }

      })
      return thunkAPI.fulfillWithValue(response.data)
    }
    catch(err){
return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Get User failed" }
      );
    }
  }
)

export const getAllUsers=createAsyncThunk(
  "user/getAllUsers",
  async(_,thunkAPI)=>{
try{
const response =await clientServer.get("/user/get_all_users")
return thunkAPI.fulfillWithValue(response.data)
}
catch(err){
  return thunkAPI.rejectWithValue(err.response.data);
}
  }
)