import { useState } from "react";
import Doctor from "./doctor.jsx";
import DepartmentManagement from "./department.jsx";

function App() {

    const [page, setPage] = useState("doctor");

    return (

        <div>

            <nav>

                <button onClick={() => setPage("doctor")}>
                    Doctors
                </button>

                <button onClick={() => setPage("department")}>
                    Departments
                </button>

            </nav>

            {page === "doctor" && <Doctor />}

            {page === "department" && (
                <DepartmentManagement />
            )}

        </div>
    );
}

export default App;