import React from 'react'
import './SDPCard.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { FaLaptop,FaBook } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function SDPCard(props) {
    let navigate = useNavigate()
    const { currentUser } = useSelector(state => state.facultyAdminLoginReducer);
    return (
        <div className="card sdp-card ml-5 mr-5 sdp1">
      <div className="card-body m-2 p-1 mx-auto">
      
      <div className="d-flex mx-auto">
            <FaLaptop/>
            <FaBook/>
      </div>

    <div className="title-cov m-2">
    <h3 className="card-title" style={{textDecoration: 'none'}}>{props.s.title}</h3>
    </div>
    
    <div>
    <h3 className="m-2 card-sub-title" style={{textDecoration: 'none'}}>Organized by - {props.s.organizedBy}</h3>
    </div>

    <div>
    <h3 className="card-text" style={{textDecoration: 'none'}}>start: {props.s.startDate}</h3>
    </div>
   
    <div>
    <h3 className="card-text" style={{textDecoration: 'none'}}>end: {props.s.endDate}</h3>
    </div>
    <div className="links m-2 d-flex">
    <Link className="link"
                    onClick={(e)=>{
                        e.preventDefault();
                        if(currentUser.userType=='faculty'){
                            navigate(`/faculty/view-sdp/${props.s.sdpId}`,{state:props.s});
                        }
                        else{
                            navigate(`/admin/view-faculty-sdp/${props.s.facultyId}/${props.s.sdpId}`,{state:props.s});
                        }
                    }}
                    >VIEW</Link>
    </div>

    </div>
    
  
</div>
    )
}

export default SDPCard
