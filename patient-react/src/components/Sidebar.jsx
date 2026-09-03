import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const isPatientSection =
        location.pathname === "/patient-dashboard" ||
        location.pathname === "/patients" ||
        location.pathname.startsWith("/patients/") ||
        location.pathname.startsWith("/patient-details/");

    function handleNavigation(path) {
        navigate(path);
        setIsOpen(false);
    }

    return (
        <>
            {/* HAMBURGER BUTTON */}
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setIsOpen(true)}
                aria-label="Open navigation menu"
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* OVERLAY */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    className="sidebar-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="logo">
                    <i className="fa-solid fa-heart-pulse"></i>
                    EthioCare
                </div>

                <ul className="menu">
                    {/* DASHBOARD */}
                    <li onClick={() => handleNavigation("/patient-dashboard")}>
                        <i className="fa-solid fa-house"></i>
                        Dashboard
                    </li>

                    {/* PATIENTS */}
                    <li
                        className={isPatientSection ? "active" : ""}
                        onClick={() => handleNavigation("/patient-dashboard")}
                    >
                        <i className="fa-solid fa-users"></i>
                        Patients
                    </li>

                    {/* DOCTORS */}
                    <li>
                        <i className="fa-solid fa-user-doctor"></i>
                        Doctors
                    </li>

                    {/* APPOINTMENTS */}
                    <li>
                        <i className="fa-solid fa-calendar-check"></i>
                        Appointments
                    </li>

                    {/* DEPARTMENTS */}
                    <li>
                        <i className="fa-solid fa-building"></i>
                        Departments
                    </li>

                    {/* RECORDS */}
                    <li>
                        <i className="fa-solid fa-file-medical"></i>
                        Records
                    </li>

                    {/* REPORTS */}
                    <li>
                        <i className="fa-solid fa-chart-line"></i>
                        Reports
                    </li>

                    {/* SETTINGS */}
                    <li>
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </li>
                </ul>
            </aside>
        </>
    );
}

export default Sidebar;
