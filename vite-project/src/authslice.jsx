import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from './Utils/axiosClient';

export const registerUser=createAsyncThunk(
    'auth/register',
    async(userData,{rejectWithValue})=>{
        try{
            console.log("hi mohit");
            console.log(userData);
            console.log(userData);

            const response=await axiosClient.post('/user/register',userData);
            console.log(response.data.user);
            return response.data.user;
        }
        catch(error){
            return rejectWithValue("the main thing is here"
            );
        }
    }
);
export const loginuser=createAsyncThunk(
    'auth/login',
    async(credentials,{rejectWithValue})=>{
        try{
            console.log("sunai de rha tu");
            const response=await axiosClient.post('/user/login',credentials);
            console.log(response.data.user);
            return response.data.user;

        }
        catch(error){
            return rejectWithValue(error);
        }
    }
);
export const handleSuccess=createAsyncThunk(
    'auth/googleLogin',
    async(credentials,{rejectWithValue})=>{
        try{
            console.log("hi welcome google login");
            const response=await axiosClient.post("/auth/google",{
                token1: credentials,
            })
            console.log("User:",response.data);
            return response.data.user;
            alert("Login Succesfully");
        }
        catch(error){
            return rejectWithValue(error);
        }
    }
)
export const checkauth=createAsyncThunk(
    'auth/check',
    async(_,{rejectWithValue})=>{
        try{
            const {data}=await axiosClient.get('/user/check');
            return data.user;

        }
        catch(error){
           if (error.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
    }
    return rejectWithValue(error);
        }
    }
)
export const logoutUser=createAsyncThunk(
    'auth/logut',
    async(_,{rejectWithValue})=>{
        try{
            console.log("logout ka apllication yaha tak pahuch rha ");
            await axiosClient.post('/user/logout');
            return null;
        }
        catch(error){
            return rejectWithValue(error);
        }
    }
)
const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        isauthicated:false,
        loading:false,
        error:null
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        //register userCases
        .addCase(registerUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.isauthicated=!!action.payload;
            state.user=action.payload;

        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"something went wrong";
            state.isauthicated=false;
            state.user=null;
        })

        //login userCases

        .addCase(loginuser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loginuser.fulfilled,(state,action)=>{
            state.loading=false;
            state.isauthicated=!!action.payload;
            state.user=action.payload;

        })
        .addCase(loginuser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"something went wrong";
            state.isauthicated=false;
            state.user=null;
        })

        //google Login
        .addCase(handleSuccess.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(handleSuccess.fulfilled,(state,action)=>{
            state.loading=false;
            state.isauthicated=!!action.payload;
            state.user=action.payload;
        })
        .addCase(handleSuccess.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"something went wrong";
            state.isauthicated=false;
            state.user=null;
        })
        

        //check auth cases

        .addCase(checkauth.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(checkauth.fulfilled,(state,action)=>{
            state.loading=false;
            state.isauthicated=!!action.payload;
            state.user=action.payload;

        })
        .addCase(checkauth.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"something went wrong";
            state.isauthicated=false;
            state.user=null;
        })
        //logout csess handeling

        .addCase(logoutUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(logoutUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.isauthicated=!!action.payload;
            state.user=action.payload;

        })
        .addCase(logoutUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message||"something went wrong";
            state.isauthicated=false;
            state.user=null;
        })
    }
})
export default authSlice.reducer;