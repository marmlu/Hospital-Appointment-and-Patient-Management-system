import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PatientDashboard from "./pages/PatientDashboard";
import PatientList from "./pages/PatientList";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ================================
                    PATIENT DASHBOARD
                ================================= */}
                <Route
                    path="/patient-dashboard"
                    element={<PatientDashboard />}
                />

                {/* ================================
                    PATIENT LIST
                ================================= */}
                <Route path="/patients" element={<PatientList />} />

                {/* ================================
                    ADD PATIENT
                ================================= */}
                <Route path="/patients/add" element={<PatientForm />} />

                {/* ================================
                    EDIT PATIENT
                ================================= */}
                <Route path="/patients/edit/:id" element={<PatientForm />} />

                {/* ================================
                    PATIENT DETAILS
                ================================= */}
                <Route
                    path="/patient-details/:patientId"
                    element={<PatientDetails />}
                />

                {/* ================================
                    DEFAULT
                ================================= */}
                <Route
                    path="*"
                    element={<Navigate to="/patient-dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
