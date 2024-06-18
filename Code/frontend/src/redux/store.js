import {configureStore} from '@reduxjs/toolkit'
import facultyAdminReducer from './slices/facultyAdminSlice'
 export const store=configureStore({
     reducer:{
         facultyAdminLoginReducer:facultyAdminReducer
     }
 })