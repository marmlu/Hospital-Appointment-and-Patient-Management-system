import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const toggleNavbar = () => {
        setNavbarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="app-layout">
            <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

            <main className="main-content">
                <Navbar
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    navbarOpen={navbarOpen}
                    toggleNavbar={toggleNavbar}
                />

                {children}
            </main>

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
}

export default Layout;
