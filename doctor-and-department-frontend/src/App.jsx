import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Doctor from "./doctor.jsx";
import DepartmentManagement from "./department.jsx";
import "./sidebar.css";

function App() {
    const [page, setPage] = useState("doctor");

    return (
        <div className="app-layout">
            <Sidebar activePage={page} onNavigate={setPage} />
            <main className="main-content">
                {page === "doctor" && <Doctor />}
                {page === "department" && <DepartmentManagement />}
                {page !== "doctor" && page !== "department" && (
                    <p>This section isn't built yet — a teammate is working on it.</p>
                )}
            </main>
        </div>
    );
}

export default App;