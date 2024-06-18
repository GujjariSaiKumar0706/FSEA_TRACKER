import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import './UploadRev.css';

function UploadRev() {
    const token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })
    let navigate = useNavigate();
    let {currentUser} = useSelector(state=>state.facultyAdminLoginReducer)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [roles, setRoles] = useState([]);

    const onRoleChange = (e) => {
        const { id, checked } = e.target;
        setRoles((prevRoles) =>
            checked ? [...prevRoles, id] : prevRoles.filter((role) => role !== id)
        );
    };

    const onSubmit = async (data) => {
        data.dateOfCreation = new Date();
        data.dateOfModification = new Date();
        data.facultyId = currentUser.facultyId;
        data.revId = Date.now();
        data.roles = roles;
        // console.log(data);

        // Handle file upload
        const fileInput = document.getElementById('certificate');
        const formData = new FormData();
        formData.append('file', fileInput.files[0], `rev-${data.revId}.jpeg`);

        try {
            const fileUploadRes = await axiosWithToken.post('http://localhost:4000/file-api/upload-certificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (fileUploadRes.data.file) {
                // console.log('File uploaded successfully:', fileUploadRes.data.file);
                // Proceed with the rest of the form data submission
                let res = await axiosWithToken.post('http://localhost:4000/faculty-api/reviewdata', data);
                if (res.data === 'Data Uploaded') {
                    alert('Upload Successful!');
                    navigate('/faculty')

                } else {
                    alert(res.data.message);
                }
            } else {
                alert('File upload failed');
            }
        } catch (error) {
            // console.error('Error uploading file:', error);
            alert('File upload failed');
        }
    };

    return (
        <div>
            <div className="m-3">
                <h2 className="d-block m-4 mx-auto text-center">Upload Review data</h2>
            </div>
            <div className="container">
                <div className="mt-5 mx-auto upload-review-form mx-auto">
                    <form className="w-60 bg-light urform mx-auto" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-100 text-start p-2">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                placeholder="Title of the review"
                                id="title"
                                className="w-100 rounded-2 form-control"
                                {...register('title', { required: true })}
                            />
                            {errors.title && <p className="text-danger">Title is required</p>}
                        </div>
                        <div className="w-100 text-start p-2">
                            <label>Role:</label>
                            <div className="role-options">
                                {['Reviewer', 'Editorial Board Member', 'Session Chair', 'Committee Member', 'Jury'].map((role) => (
                                    <div key={role} className="form-check">
                                        <input
                                            type="checkbox"
                                            id={role}
                                            className="form-check-input"
                                            onChange={onRoleChange}
                                        />
                                        <label htmlFor={role} className="form-check-label">
                                            {role.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-100 text-start p-2">
                            <label htmlFor="stdate">Start Date:</label>
                            <input
                                type="date"
                                id="stdate"
                                className="w-50 rounded-2"
                                {...register('startDate', { required: true })}
                            />
                            {errors.startDate && <p className="text-danger">Start date is required</p>}
                        </div>
                        <div className="w-100 text-start p-2">
                            <label htmlFor="enddate">End Date:</label>
                            <input
                                type="date"
                                id="enddate"
                                className="w-50 rounded-2 form-control"
                                {...register('endDate', { required: true })}
                            />
                            {errors.endDate && <p className="text-danger">End date is required</p>}
                        </div>
                        <div className="w-100 text-start p-2">
                            <label>Certificate:</label>
                            <div className="input-group mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    id="certificate"
                                    {...register('file', { required: true })}
                                />
                                <label className="input-group-text" htmlFor="certificate">
                                    Upload
                                </label>
                            </div>
                            {errors.file && <p className="text-danger">Certificate is required</p>}
                        </div>
                        <div className="w-100 text-start p-2">
                            <label htmlFor="OrganizedBy">Organized By:</label>
                            <input
                                type="text"
                                placeholder="Organization name"
                                id="OrganizedBy"
                                className="w-100 rounded-2 form-control"
                                {...register('organizedBy', { required: true })}
                            />
                            {errors.organizedBy && <p className="text-danger">Organization is required</p>}
                        </div>
                        <button type="submit" className="btn btn-success d-block mx-auto">
                            Upload
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadRev;
