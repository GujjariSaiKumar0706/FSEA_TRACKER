import React from 'react'
import './Login.css'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { facultyAdminLoginThunk } from '../../redux/slices/facultyAdminSlice'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
function Login() {
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let { register, handleSubmit, formState: { errors } } = useForm()
    const [showPassword, setShowPassword] = useState(false);
    let { loginUserStatus, currentUser, errorOccured, errMsg } = useSelector(state => state.facultyAdminLoginReducer)
   
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const login = async (user) => {
        console.log(user)
        dispatch(facultyAdminLoginThunk(user))
    }
    useEffect(() => {

        if (loginUserStatus === true) {
            if (currentUser.userType === 'faculty') {
                navigate('/faculty')
            }
            else {
                navigate('/admin/all-faculty')
            }
        }
    }, [loginUserStatus])
    return (
        <div className="signinmain mt-5 mx-auto">

            <form className="mx-auto p-4 pt-3 bg-light formmain rounded" onSubmit={handleSubmit(login)}>
                <div className="radiobut">
                    <input type="radio" id="faculty" name="userType" value="faculty" checked="checked" {...register("userType")} />
                    <label for="user">Faculty</label>
                    <input type="radio" id="admin" name="userType" value="admin" {...register("userType")} />
                    <label for="author">Admin</label>
                </div>
                <div className="facid m-2 p-3 ">

                    <input type="text" id="facid" className="form-control w-75 mx-auto" placeholder='FacultyId'{...register("facultyId", { required: true })} />

                </div>
                <div className="password m-2 p-3">
                    <div className="position-relative  d-flex mx-auto w-75 pass-wrapper">
                        <input type={showPassword ? 'text' : 'password'} id="pass" className="form-control w-100" placeholder='password'{...register("password", { required: true })} />
                        <i onClick={togglePasswordVisibility} className="flex justify-around items-center">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </i>

                    </div>
                    {errors.password?.type === "required" &&
                        (<p className="text-danger">Required</p>)}

                </div>
                <button className="btn button-reg  mx-auto d-block" style={{ backgroundColor: "var(--main-yellow)" }}>Login</button>
            </form>
            {(
                errMsg.length !== 0 &&
                <h1 className="lead text-center text-danger">{errMsg}</h1>
            )}
            <p className="lead text-center mt-2">New User?
                <Link to="/new-user" className="fs-4 px-3">Register</Link>
                here
            </p>

        </div>
    )
}

export default Login
