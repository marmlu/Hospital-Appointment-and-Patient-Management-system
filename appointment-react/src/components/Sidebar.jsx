function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">
                <i className="fa-solid fa-heart-pulse"></i>
                EthioCare
            </div>

            <ul className="menu">
                <li>
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </li>

                <li>
                    <i className="fa-solid fa-users"></i>
                    Patients
                </li>

                <li>
                    <i className="fa-solid fa-user-doctor"></i>
                    Doctors
                </li>

                <li className="appointment">
                    <a href="index.html">
                        <i className="fa-solid fa-calendar-check"></i>
                        Appointments
                    </a>
                </li>

                <li>
                    <i className="fa-solid fa-building"></i>
                    Departments
                </li>

                <li>
                    <i className="fa-solid fa-file-medical"></i>
                    Records
                </li>

                <li>
                    <i className="fa-solid fa-chart-line"></i>
                    Reports
                </li>

                <li>
                    <i className="fa-solid fa-gear"></i>
                    Settings
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
