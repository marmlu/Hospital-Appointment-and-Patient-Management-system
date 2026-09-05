import { Link } from "react-router-dom";
function Sidebar({ sidebarOpen }) {
    return (
        <aside className={`sidebar ${sidebarOpen ? "unhide" : ""}`}>
            <div className="logo">
                <i className="fa-solid fa-heart-pulse"></i>
                EthioCare
            </div>

            <ul className="menu">
                <li>
                    <a href="#">
                        <i className="fa-solid fa-house"></i>
                        Dashboard
                    </a>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-user"></i>
                        Patients
                    </a>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-user-doctor"></i>
                        Doctors
                    </a>
                </li>

                <li className="appointment">
                    <Link to="/appointment-dashboard">
                        <i className="fa-solid fa-calendar-check"></i>
                        Appointments
                    </Link>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-building"></i>
                        Departments
                    </a>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-file-medical"></i>
                        Records
                    </a>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-chart-column"></i>
                        Reports
                    </a>
                </li>

                <li>
                    <a href="#">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </a>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
