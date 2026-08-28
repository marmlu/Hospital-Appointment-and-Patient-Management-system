function Navbar() {
    return (
        <nav className="navbar">
            <div className="left-of-navbar">
                {/* Sidebar toggle */}
                <button className="hamburger" type="button">
                    <i className="fa-solid fa-bars"></i>
                </button>

                <h2>Appointments</h2>
            </div>

            {/* Navbar menu */}
            <div className="navbar-menu">
                <div className="gap">
                    {/* Search */}
                    <div className="search-container">
                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input type="text" placeholder="Search..." />
                    </div>

                    {/* Notifications */}
                    <div className="notification">
                        <i className="fa-solid fa-bell"></i>

                        <span className="badge">3</span>
                    </div>

                    {/* Admin profile */}
                    <div className="admin-profile">
                        <i className="fa-solid fa-circle-user profile-icon"></i>

                        <div className="admin-info">
                            <h4>Dr. Jon Doe</h4>
                            <p>Administrator</p>
                        </div>

                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </div>

            {/* Navbar toggle */}
            <button className="navbar-toggle" type="button">
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
        </nav>
    );
}

export default Navbar;
