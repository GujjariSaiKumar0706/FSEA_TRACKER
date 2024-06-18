import React from 'react'
import { NavLink } from 'react-router-dom';
import './Sidebar2.css';
import { FaBars, FaTimes } from 'react-icons/fa';

function Sidebar2({ isOpen, toggleSidebar }) {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            {isOpen && (
                <div className="close-icon" onClick={toggleSidebar}>
                    <FaTimes />
                </div>
            )}
            <nav>
                <ul>
                    <li>
                    <NavLink
                            to="admin/all-faculty"
                            end
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            Faculty
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="admin/view-all-sdp"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            All SDP
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="admin/view-all-review"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            All Reviews
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <button className="profile-button">
                <NavLink to="admin/profile" className="nav-link">Profile</NavLink>
            </button>
        </div>
    )
}

export default Sidebar2
