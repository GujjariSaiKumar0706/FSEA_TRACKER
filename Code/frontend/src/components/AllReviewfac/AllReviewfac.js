import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../ReviewCard/ReviewCard';
import './AllReviewfac.css';

function AllReviewfac() {
    const token = localStorage.getItem('token');
    const { currentUser } = useSelector(state => state.facultyAdminLoginReducer);
    let [loading , setLoading] = useState(true);
    const [rev, setREV] = useState([]);
    const [filteredREV, setFilteredREV] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [facId, setFacId] = useState('');
    const { state } = useLocation();
    const axiosWithToken = axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })

    useEffect(() => {
        const getfid = () => {
            if (currentUser.userType === 'faculty') {
                setFacId(currentUser.facultyId);
            } else {
                setFacId(state.facultyId);
            }
        };
        getfid();
    }, [currentUser, state]);

    useEffect(() => {
        const getREV = async () => {
            if (facId) {
                try {
                    setLoading(true);
                    const res = await axiosWithToken.get(`http://localhost:4000/admin-api/get-review-records/${facId}`);
                    setREV(res.data.payload);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching review records:', error);
                }
            }
        };
        getREV();
    }, [facId]);

    useEffect(() => {
        const filtered = rev.filter((r) =>
            r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredREV(filtered);
    }, [searchTerm, rev]);

    const handleSearch = () => {
        const filtered = rev.filter((r) =>
            r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredREV(filtered);
    };

    return (
        <div className="m-5 allrev">
            <div className="m-3 p-3 ">
                <h3><strong>Faculty as Reviewer</strong></h3>
                <h3><strong>Faculty Id: {facId}</strong></h3>
            </div>
            <div className="textfield m-5">
                <input 
                    type="text" 
                    className="textfieldbar" 
                    placeholder="Search with title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="input-group-append">
                    <button className="btn but" type="button" onClick={handleSearch}>Search</button>
                </div>
            </div>
            {
                (loading==true)?<div className="loading-screen text-center fs-3 mt-5">Loading...</div>:
                (filteredREV.length==0)?
                <div className="mx-auto">
                    <h3 className="text-danger text-center">No Results</h3>
                </div>
                :
                <div className="row gy-5 gx-3 allarticles">
                {filteredREV.map((r) => (
                    <div key={r.facultyId} className="col-sm-12 col-md-4 col-lg-4 mb-2">
                        <ReviewCard r={r}/>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default AllReviewfac
