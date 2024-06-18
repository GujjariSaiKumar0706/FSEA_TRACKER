import React from 'react'
import './ReviewCard.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { FaSearch} from 'react-icons/fa';
import { useSelector } from 'react-redux';

function ReviewCard(props) {
    let navigate = useNavigate()
    const { currentUser } = useSelector(state => state.facultyAdminLoginReducer);
    return (
        <div className="card rev-card ml-5 mr-5 rev1">
      <div className="card-body m-2 p-1 mx-auto">
      
      <div className="">
            <FaSearch/>
      </div>

    <div className="title-cov m-2">
    <h3 className="card-title" style={{textDecoration: 'none'}}>{props.r.title}</h3>
    </div>
    
    <div>
    <h3 className="m-2 card-sub-title" style={{textDecoration: 'none'}}>Organized by - {props.r.organizedBy}</h3>
    </div>

    <div>
    <h3 className="card-text" style={{textDecoration: 'none'}}>start: {props.r.startDate}</h3>
    </div>
   
    <div>
    <h3 className="card-text" style={{textDecoration: 'none'}}>end: {props.r.endDate}</h3>
    </div>
    <div className="links m-2 d-flex">
    <Link className="link"
                    onClick={(e)=>{
                        e.preventDefault();
                        if(currentUser.userType=='faculty'){
                            navigate(`/faculty/view-review/${props.r.revId}`,{state:props.r});
                        }
                        else{
                            navigate(`/admin/view-faculty-review/${props.r.facultyId}/${props.r.revId}`,{state:props.r});
                        }
                    }}
                    >VIEW</Link>
    </div>

    </div>
    
  
</div>
    )
}

export default ReviewCard
