import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import PieChart from '../PieChart/PieChart';
import SDPCard from '../SDPCard/SDPCard';
import ReviewCard from '../ReviewCard/ReviewCard';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Dashboard() {
    const token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers:{Authorization:`Bearer ${token}`}
    })
    const [l1,setL1] = useState(true);
    const [l2,setL2]=useState(true);
    const [sdp, setSDP] = useState([]);
    const [rev, setREV] = useState([]);
    const { currentUser } = useSelector(state => state.facultyAdminLoginReducer);
    const [data, setData] = useState({
        labels: ['SDP', 'Review'],
        values: [0, 0],
    });
    const [latestSDP, setLatestSDP] = useState(null);
    const [latestReview, setLatestReview] = useState(null);

    const getSDP = async () => {
        if (currentUser.facultyId) {
            try {
                setL1(true)
                const res = await axiosWithToken.get(`http://localhost:4000/admin-api/get-sdp-records/${currentUser.facultyId}`);
                setSDP(res.data.payload);
                setL1(false)
            } catch (error) {
                console.error('Error fetching sdp records:', error);
            }
        }
    };

    const getREV = async () => {
        if (currentUser.facultyId) {
            try {
                setL2(true)
                const res = await axiosWithToken.get(`http://localhost:4000/admin-api/get-review-records/${currentUser.facultyId}`);
                setREV(res.data.payload);
                setL2(false)
            } catch (error) {
                console.error('Error fetching review records:', error);
            }
        }
    };

    const findLatestRecord = (records) => {
        if (records.length === 0) return null;
        return records.reduce((latest, record) => (new Date(record.startDate)) && new Date(record.startDate) > new Date(latest.startDate) ? record : latest);
    };

    useEffect(() => {
        getSDP();
        getREV();
    }, []);

    useEffect(() => {
        const x = {
            labels: ['SDP', 'REVIEWS'],
            values: [sdp.length, rev.length],
        };
        setData(x);
        setLatestSDP(findLatestRecord(sdp));
        setLatestReview(findLatestRecord(rev));
    }, [sdp, rev]);

    return (
        <div className="align-items-center justify-content-center">
            <div className="row gx-3 gy-5 m-3 align-items-center justify-content-center">
                <div className="col-sm-9 col-md-6 col-lg-6">
                    <div className="welcome rounded text-center text-white">
                        <h1 className="p-5">Welcome {currentUser.username},</h1>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="chart rounded shadow d-flex justify-content-center align-items-center pie">
                        {(l1==true && l2==true)?<div className="loading-screen text-center fs-3 mt-5">Loading...</div>:(data.values[0]==0 && data.values[1]==0)? <p className="text-danger">No Records</p>: <PieChart data={data} />}
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 ">
                    <h4>Latest SDP</h4>
                    {(l1==true)?<div className="loading-screen text-center fs-3 mt-5">Loading...</div>:latestSDP ? <SDPCard s={latestSDP} /> : <p className="text-danger">No SDP records available</p>}
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                    <h4>Latest Review</h4>
                    {(l2==true)?<div className="loading-screen text-center fs-3 mt-5">Loading...</div>:latestReview ? <ReviewCard r={latestReview} /> : <p className="text-danger">No review records available</p>}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
