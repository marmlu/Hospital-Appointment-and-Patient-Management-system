import "./sidebar.css";

const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "fa-house" },
    { key: "patients", label: "Patients", icon: "fa-users" },
    { key: "doctor", label: "Doctors", icon: "fa-user-doctor" },
    { key: "appointments", label: "Appointments", icon: "fa-calendar-check" },
    { key: "department", label: "Departments", icon: "fa-building" },
    { key: "records", label: "Records", icon: "fa-file-medical" },
    { key: "reports", label: "Reports", icon: "fa-chart-line" },
    { key: "settings", label: "Settings", icon: "fa-gear" },
];

function Sidebar({ activePage, onNavigate }) {
    return (
        <aside className="sidebar">
            <div className="logo">
                <i className="fa-solid fa-heart-pulse"></i>
                EthioCare
            </div>
            <ul className="menu">
                {navItems.map(({ key, label, icon }) => (
                    <li
                        key={key}
                        className={activePage === key ? "active" : ""}
                        onClick={() => onNavigate(key)}
                    >
                        <i className={`fa-solid ${icon}`}></i>
                        {label}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;