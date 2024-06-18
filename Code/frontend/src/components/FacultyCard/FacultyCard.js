import React from 'react';
import { Link } from 'react-router-dom';
import './FacultyCard.css';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

function FacultyCard(props) {
    let navigate = useNavigate();
    return (
        <div className="card faculty-card ml-5 mr-5 faculty1">
            <div className="card-body m-2 p-1 mx-auto">
                <div>
                    <FaUser/>
                </div>
                <div className="title-cov m-2">
                    <h5 className="card-title">{props.a.username}</h5>
                </div>
                <div className="m-2">
                    <h3 className="card-text">{props.a.facultyId}</h3>
                </div>
                <div className="links m-2 d-flex">
                    <Link className="link"
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/admin/view-faculty-sdp/${props.a.facultyId}`,{state:props.a});
                    }}
                    >SDP</Link>
                    <Link className="link"
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/admin/view-faculty-review/${props.a.facultyId}`,{state:props.a});
                    }}
                    >REVIEWS</Link>
                </div>
            </div>
        </div>
    );
}

export default FacultyCard;
