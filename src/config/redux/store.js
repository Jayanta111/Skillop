import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"
/**
 * Steps for state management
 * Submit action
 * handle action in its reducer
 * 
 * 
 * 
 */
 export  const store=configureStore({
reducer:{
    auth:authReducer,
    posts:postReducer
}
})