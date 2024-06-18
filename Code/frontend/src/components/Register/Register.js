
import './Register.css'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css'
function Register() {
    const token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })
    let {register,handleSubmit,formState:{errors}}=useForm();
    let [err,setErr] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    let navigate=useNavigate()
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    async function registerUser(user){
        user.userType='faculty'
        console.log(user)
        let res;
         res = await axiosWithToken.post('http://localhost:4000/faculty-api/new-faculty',user)
        console.log(res.data)
        if(res.data.message==='Faculty created'){
            navigate('/login')
        }
        else{
            console.log(res.data.message)
            setErr(res.data.message)
        }
    }
    return (
        <div className="signupmain mt-5 w-70 mx-auto">
    
    <form className=" mx-auto p-4 pt-3 bg-light formmain rounded" onSubmit={handleSubmit(registerUser)}>
    <div className="facid mb-4">
            
            <input type="text" id="facid" className="form-control w-50 mx-auto m-3" placeholder="FacultyId" {...register("facultyId",{required:true,minLength:4,maxLength:10})}/>
            {errors.facultyid && errors.facultyid.type==="required" &&
            (<p className="text-danger text-center">Required</p>)}
            {errors.facultyid && errors.facultyid.type==="minLength" &&
            (<p className="text-danger text-center">Minimum Length: 4</p>)}
            {errors.facultyid && errors.facultyid.type==="maxLength" &&
            (<p className="text-danger text-center">Maximum Length: 10</p>)}
        </div>

            <div className="uname mb-2">

            <input type="text" id="uname" className="form-control w-50 mx-auto m-3"  placeholder="Username"{...register("username",{required:true,minLength:4,maxLength:20})}/>
            {errors.username && errors.username.type==="required" &&
            (<p className="text-danger text-center">Required</p>)}
            {errors.username && errors.username.type==="minLength" &&
            (<p className="text-danger text-center">Minimum Length: 4</p>)}
            {errors.username && errors.username.type==="maxLength" &&
            (<p className="text-danger text-center">Maximum Length: 10</p>)}
        </div>
        <div className="password mb-2">
            <div className="position-relative  d-flex mx-auto w-50 pass-wrapper">
            <input type={showPassword ? 'text' : 'password'} id="pass" className="form-control w-100" placeholder="Password" {...register("password",{required:true,minLength:8})}/>
            <i onClick={togglePasswordVisibility} className="flex justify-around items-center">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
            </i>
            </div>
            {errors.password?.type==="required" &&
            (<p className="text-danger text-center">Required</p>)}
            {errors.password?.type==="minLength" &&
            (<p className="text-danger text-center">Minimum Length: 8</p>)}
        </div>
        <div className="email mb-2">
            
            <input type="email" id="email" className="form-control w-50 mx-auto m-3" placeholder="email" {...register("email",{required:true})}/>
            {errors.email?.type==="required" &&
            (<p className="text-danger text-center">Required</p>)}
        </div>
        <div className="Form-group mb-2">
<input type="number" className="form-control mx-auto w-50 m-3" id="phonenumber" placeholder="Phone number" {...register('phonenumber',{required:true,minLength:10,maxLength:10})} />
{errors.phonenumber?.type==='required' && <p className="text-danger text-center">phonenumber is required</p>}
        {errors.phonenumber?.type==='minLength' && <p className="text-danger text-center">Phone number contains only 10 digits</p>}
        {errors.phonenumber?.type==='maxLength' && <p className="text-danger text-center">Phone number contains only 10 digits</p>}
</div>
        <button className="btn button-reg  mx-auto d-block" >Register</button>
    </form>
    {err.length !== 0 && (<p className="lead text-center text-danger">{err}</p>)}
    <p className="lead text-center mt-2">Already Registered?
    <Link to="/login" className="fs-4 ps-3">Login</Link>
    </p>
</div>
    )
}

export default Register
