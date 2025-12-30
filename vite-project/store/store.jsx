import { configureStore } from "@reduxjs/toolkit";
import authRouter from '../src/authslice'

 const store=configureStore({
    reducer:{
        auth:authRouter
    }
});
export default store