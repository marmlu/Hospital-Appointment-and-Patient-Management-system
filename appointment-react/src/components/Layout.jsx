import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <LayoutContext.Provider
            value={{
                sidebarOpen,
                toggleSidebar,
                closeSidebar,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}

function Layout({ children }) {
    return <>{children}</>;
}

export default Layout;