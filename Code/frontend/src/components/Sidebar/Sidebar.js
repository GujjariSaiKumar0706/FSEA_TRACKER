import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaBars, FaTimes } from 'react-icons/fa';

function Sidebar({ isOpen, toggleSidebar }) {
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
                            to="faculty"
                            end
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="faculty/upload-new-sdp"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            Upload SDP data
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="faculty/upload-new-review"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            Upload Review data
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="faculty/view-all-sdp"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            My SDP
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="faculty/view-all-review"
                            className={({ isActive }) => isActive ? 'nav-link active-link' : 'nav-link'}
                        >
                            My Reviews
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <button className="profile-button">
                <NavLink to="faculty/profile" className="nav-link">Profile</NavLink>
            </button>
        </div>
    );
}

export default Sidebar;
