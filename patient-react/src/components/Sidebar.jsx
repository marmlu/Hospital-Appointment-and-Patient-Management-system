import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isPatientSection =
        location.pathname === "/patient-dashboard" ||
        location.pathname === "/patients" ||
        location.pathname.startsWith("/patients/") ||
        location.pathname.startsWith("/patient-details/");

    return (
        <aside className="sidebar">
            <div className="logo">
                <i className="fa-solid fa-heart-pulse"></i>
                EthioCare
            </div>

            <ul className="menu">
                {/* DASHBOARD */}
                <li onClick={() => navigate("/patient-dashboard")}>
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </li>

                {/* PATIENTS */}
                <li
                    className={isPatientSection ? "active" : ""}
                    onClick={() => navigate("/patient-dashboard")}
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
    );
}

export default Sidebar;
