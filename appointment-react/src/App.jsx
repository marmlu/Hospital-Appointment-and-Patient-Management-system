import { useState } from "react";
import "./style.css";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <>
            {/* ========================================
                SIDEBAR
            ======================================== */}

            <aside className={`sidebar ${sidebarOpen ? "unhide" : ""}`}>
                <div className="logo">
                    <i className="fa-solid fa-heart-pulse"></i> EthioCare
                </div>

                <ul className="menu">
                    <li>
                        <i className="fa-solid fa-house"></i>
                        Dashboard
                    </li>

                    <li>
                        <i className="fa-solid fa-user-injured"></i>
                        Patients
                    </li>

                    <li>
                        <i className="fa-solid fa-user-doctor"></i>
                        Doctors
                    </li>

                    <li className="appointment">
                        <i className="fa-solid fa-calendar-check"></i>
                        Appointments
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
                        <i className="fa-solid fa-chart-column"></i>
                        Reports
                    </li>

                    <li>
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </li>
                </ul>
            </aside>

            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main className="main-content">
                {/* ========================================
                    NAVBAR
                ======================================== */}

                <nav className="navbar">
                    {/* Left side */}
                    <div className="left-of-navbar">
                        <button
                            className="hamburger"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <h2>Appointments</h2>
                    </div>

                    {/* Desktop navbar */}
                    <div className="gap">
                        <div className="search-container">
                            <i className="fa-solid fa-magnifying-glass"></i>

                            <input type="text" placeholder="Search..." />
                        </div>

                        <div className="notification">
                            <i className="fa-solid fa-bell"></i>

                            <span className="badge">3</span>
                        </div>

                        <div className="admin-profile">
                            <i className="fa-solid fa-circle-user profile-icon"></i>

                            <div className="admin-info">
                                <h4>Dr. Jon Doe</h4>

                                <p>Administrator</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile navbar button */}
                    <button
                        className="navbar-toggle"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </nav>

                {/* ========================================
                    PAGE CONTENT
                ======================================== */}

                <section className="content">
                    <h1>Appointment Dashboard</h1>

                    <p>Welcome to your appointment dashboard.</p>
                </section>
            </main>
        </>
    );
}

export default App;
