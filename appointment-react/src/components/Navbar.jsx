function Navbar({ toggleSidebar, navbarOpen, toggleNavbar }) {
    return (
        <nav className="navbar">
            <div className="left-of-navbar">
                <button
                    className="hamburger"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h2>Appointments</h2>
            </div>

            <div className="gap desktop-navbar">
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

            <button
                className="navbar-toggle"
                onClick={toggleNavbar}
                aria-label="Toggle navbar menu"
            >
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <div className={`navbar-menu ${navbarOpen ? "unhide" : ""}`}>
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
            </div>
        </nav>
    );
}

export default Navbar;
