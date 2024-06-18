import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './UploadSDP.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function UploadSDP() {
    const token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })
    let navigate = useNavigate();
    let {currentUser} = useSelector(state=>state.facultyAdminLoginReducer)
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        data.dateOfCreation = new Date();
        data.dateOfModification = new Date();
        data.facultyId = currentUser.facultyId;
        data.sdpId = Date.now();
        // console.log(data);

        // Handle file upload
        const fileInput = document.getElementById('certificate');
        const formData = new FormData();
        formData.append('file', fileInput.files[0], `sdp-${data.sdpId}.jpeg`);

        try {
            const fileUploadRes = await axiosWithToken.post('http://localhost:4000/file-api/upload-certificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (fileUploadRes.data.file) {
                // console.log('File uploaded successfully:', fileUploadRes.data.file);
                // Proceed with the rest of the form data submission
                let res = await axiosWithToken.post('http://localhost:4000/faculty-api/sdpdata', data);
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
             <h2 className="d-block m-4 mx-auto text-center">Upload data as a Resource Person</h2>
        </div>
        <div className="upsmain mt-5 mx-auto">
            <form className="bg-light sdpForm mx-auto p-4 pt-3 rounded" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        {...register('title', { required: true })}
                        className="form-control w-100"
                    />
                    {errors.title && <span className="error">Title is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <input
                        type="text"
                        id="topic"
                        {...register('topic', { required: true })}
                        className="form-control w-100"
                    />
                    {errors.topic && <span className="error">Topic is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        {...register('startDate', { required: true })}
                        className="form-control w-50"
                    />
                    {errors.startDate && <span className="error">Start Date is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        {...register('endDate', { required: true })}
                        className="form-control w-50"
                    />
                    {errors.endDate && <span className="error">End Date is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="organized-by">Organized By</label>
                    <input
                        type="text"
                        id="organized-by"
                        {...register('organizedBy', { required: true })}
                        className="form-control w-100"
                    />
                    {errors.organizedBy && <span className="error">Organizer is required</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="certificate">Certificate (jpeg)</label>
                    <div className="input-group mb-3">
                    <input
                        type="file"
                        id="certificate"
                        accept="image/jpeg"
                        {...register('file')}
                        className="form-control w-40"
                    />
                    <label class="input-group-text" htmlFor="certificate">Upload</label>
                    </div>
                </div>
                <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary">Upload</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default UploadSDP;
