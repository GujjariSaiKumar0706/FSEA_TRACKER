import React from 'react'
import { useEffect,useState } from 'react'
import {useNavigate} from 'react-router'
import { Outlet } from 'react-router-dom';
import {useSelector} from 'react-redux'
import Sidebar from '../Sidebar/Sidebar';
import Sidebar2 from '../Sidebar2/Sidebar2';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { resetState } from '../../redux/slices/facultyAdminSlice';
import './RootLayout.css'
function RootLayout() {
    let {loginUserStatus,currentUser} = useSelector(state=>state.facultyAdminLoginReducer)
    let dispatch = useDispatch()
    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
    function signOut(){
        localStorage.removeItem('token')
        dispatch(resetState())
      }
useEffect(()=>{
    if(loginUserStatus===false){
        navigate('/login')
    }
    else{
        if(currentUser.userType=='faculty'){
            navigate('/faculty')
        }
        else{
            navigate('/admin/all-faculty')
        }
    }
},[loginUserStatus,navigate])
    
    return (
        <div>
            {(loginUserStatus===false)?
            <Outlet/>
            :
            <div>
                {(currentUser.userType==='faculty')?
                <div>
                    <div className="top-bar">
                        <div className="open-sidebar-button toggle-button" onClick={toggleSidebar}>
                            <FaBars />
                        </div>
                        <button className="logout-button" onClick={signOut}><FaSignOutAlt/><span> </span>Logout</button>
                    </div>
                    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                    {/* <div className="toggle-button" onClick={toggleSidebar}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </div> */}
                    <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <Outlet />
                    </div>
                </div>
                :
                <div>
                    <div className="top-bar">
                        <div className="open-sidebar-button toggle-button" onClick={toggleSidebar}>
                            <FaBars />
                        </div>
                        <button className="logout-button" onClick={signOut}><FaSignOutAlt/><span> </span>Logout</button>
                    </div>
                    <Sidebar2 isOpen={isOpen} toggleSidebar={toggleSidebar} />
                    {/* <div className="toggle-button" onClick={toggleSidebar}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </div> */}
                    <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <Outlet />
                    </div>
                </div>
                }
            </div>
        }
        </div>
    )
}

export default RootLayout
