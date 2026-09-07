import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LayoutProvider } from "./components/Layout";

import AppointmentDashboard from "./pages/AppointmentDashboard";
import Appointments from "./pages/Appointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import EditAppointment from "./pages/EditAppointment";

function App() {
    return (
        <BrowserRouter>
            <LayoutProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Navigate to="/appointment-dashboard" replace />
                        }
                    />

                    <Route
                        path="/appointment-dashboard"
                        element={<AppointmentDashboard />}
                    />

                    <Route path="/appointments" element={<Appointments />} />

                    <Route
                        path="/appointment-details/:id"
                        element={<AppointmentDetails />}
                    />

                    <Route
                        path="/edit-appointment/:id"
                        element={<EditAppointment />}
                    />
                </Routes>
            </LayoutProvider>
        </BrowserRouter>
    );
}

export default App;
