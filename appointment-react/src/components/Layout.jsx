import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="app-layout">
            <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

            <main className="main-content">{children}</main>

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}
        </div>
    );
}

export default Layout;
