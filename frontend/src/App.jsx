import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import SearchHeader from "./components/SearchHeader";

import Settings from "./pages/Settings";

import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";

import PatientList from "./pages/PatientList";
import PatientDashboard from "./pages/PatientDashboard";
import PatientForm from "./pages/PatientForm";
import PatientDetails from "./pages/PatientDetails";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Departments from "./pages/Departments";

function App() {
  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
         ================================================= */}
      <Sidebar />

      {/* =================================================
          MAIN CONTENT
         ================================================= */}
      <main className="main-content">

        {/* =================================================
            GLOBAL SEARCH HEADER
            Appears on Dashboard, Patients, Doctors,
            Appointments, Departments, Medical Records,
            Prescriptions, Reports and Settings.
           ================================================= */}
        <SearchHeader />

        {/* =================================================
            PAGE ROUTES
           ================================================= */}
        <Routes>

          {/* ================= DASHBOARD ================= */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* ================= PATIENTS ================= */}

         <Route
    path="/patients"
    element={<PatientList />}
/>
          {/* ================= DOCTORS ================= */}

         
          <Route
    path="/patient-dashboard"
    element={<PatientDashboard />}
/>

<Route
    path="/patients/add"
    element={<PatientForm />}
/>

<Route
    path="/patients/edit/:id"
    element={<PatientForm />}
/>

<Route
    path="/patient-details/:patientId"
    element={<PatientDetails />}
/>
 <Route
            path="/doctors"
            element={<Doctors />}
          />

          {/* ================= APPOINTMENTS ================= */}

          <Route
            path="/appointments"
            element={<Appointments />}
          />

          {/* ================= DEPARTMENTS ================= */}

          <Route
            path="/departments"
            element={<Departments />}
          />

          {/* ================= MEDICAL RECORDS ================= */}

          <Route
            path="/medical-records"
            element={<MedicalRecords />}
          />

          {/* ================= PRESCRIPTIONS ================= */}

          <Route
            path="/prescriptions"
            element={<Prescriptions />}
          />

          {/* ================= REPORTS ================= */}

          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* ================= SETTINGS ================= */}

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </main>

    </div>
  );
}

export default App;