import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
export const facultyAdminLoginThunk=createAsyncThunk('faculty-admin-login',async(userCredObj,thunkApi)=>{
    try{
    if(userCredObj.userType==='faculty'){
        const dbRes = await axios.post('http://localhost:4000/faculty-api/login',userCredObj)
        if(dbRes.data.message==='login success'){
            // store token in local or session storage
            localStorage.setItem('token',dbRes.data.token)
            // return data
            return dbRes.data;
        }
        else{
            return thunkApi.rejectWithValue(dbRes.data.message)
        }
    }
    if(userCredObj.userType==='admin'){
        const dbRes = await axios.post('http://localhost:4000/admin-api/login',userCredObj)
        if(dbRes.data.message==='login success'){
            localStorage.setItem('token',dbRes.data.token)
            return dbRes.data;
        }
        else{
            console.log(dbRes.data.message)
            return thunkApi.rejectWithValue(dbRes.data.message)
        }
    }
}catch(err){
    return thunkApi.rejectWithValue(err)
}
})
export const facultyAdminSlice=createSlice({
    name:"faculty-admin-login",
    initialState:{
        isPending:false,
        loginUserStatus:false,
        currentUser:{},
        errorOccured:false,
        errMsg:''
    },
    reducers:{
        resetState:(state,action)=>{
            state.isPending=false
            state.loginUserStatus=false
            state.currentUser={}
            state.errorOccured=false
            state.errMsg=''
        }
    },
    extraReducers:builder=>builder
    .addCase(facultyAdminLoginThunk.pending,(state,action)=>{
        state.isPending=true;
    })
    .addCase(facultyAdminLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.user
        state.loginUserStatus=true
        state.errorOccured=false
        state.errMsg=''

    })
    .addCase(facultyAdminLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser={}
        state.loginUserStatus=false
        state.errorOccured=true
        state.errMsg=action.payload
    }),
})

export const {resetState}=facultyAdminSlice.actions
export default facultyAdminSlice.reducer;