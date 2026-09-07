import { createContext, useContext, useState } from "react";
import Sidebar from "./Sidebar";

const LayoutContext = createContext();

/* ========================================
   INITIAL APPOINTMENTS
======================================== */

const initialAppointments = [
    {
        id: 3,
        patientId: 12,
        doctorId: 4,
        department: "Cardiology",
        date: "2027-10-05",
        time: "09:30 AM",
        reason: "Chest Pain",
        status: "Completed",
        notes: "Follow-up required after consultation.",
        type: "Walk-in",
    },
    {
        id: 4,
        patientId: 9,
        doctorId: 7,
        department: "Pediatrics",
        date: "2027-11-01",
        time: "11:00 AM",
        reason: "Fever",
        status: "Completed",
        notes: "First Appointment",
        type: "Follow-up",
    },
    {
        id: 5,
        patientId: 15,
        doctorId: 10,
        department: "Neurology",
        date: "2027-12-09",
        time: "02:00 PM",
        reason: "Migraine",
        status: "Pending",
        notes: "Patient requested morning appointment.",
        type: "Consultation",
    },
    {
        id: 6,
        patientId: 18,
        doctorId: 1,
        department: "Dermatology",
        date: "2027-02-13",
        time: "10:15 AM",
        reason: "Skin Rash",
        status: "Cancelled",
        notes: "Patient referred for further evaluation.",
        type: "Emergency",
    },
    {
        id: 7,
        patientId: 21,
        doctorId: 7,
        department: "Ophthalmology",
        date: "2027-08-14",
        time: "03:45 PM",
        reason: "Blurred Vision",
        status: "Cancelled",
        notes: "First Appointment",
        type: "Online",
    },
];

export function LayoutProvider({ children }) {
    /* ========================================
       SIDEBAR STATE
    ======================================== */

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((current) => !current);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    /* ========================================
       APPOINTMENT STATE
    ======================================== */

    const [appointments, setAppointments] = useState(initialAppointments);

    // Add a new appointment
    const addAppointment = (appointmentData) => {
        setAppointments((currentAppointments) => {
            const highestId = currentAppointments.reduce(
                (maxId, appointment) => Math.max(maxId, appointment.id),
                0,
            );

            const newAppointment = {
                id: highestId + 1,
                ...appointmentData,
            };

            return [...currentAppointments, newAppointment];
        });
    };

    // Update an existing appointment
    const updateAppointment = (updatedAppointment) => {
        setAppointments((currentAppointments) =>
            currentAppointments.map((appointment) =>
                appointment.id === updatedAppointment.id
                    ? updatedAppointment
                    : appointment,
            ),
        );
    };

    // Delete an appointment
    const deleteAppointment = (id) => {
        setAppointments((currentAppointments) =>
            currentAppointments.filter((appointment) => appointment.id !== id),
        );
    };

    return (
        <LayoutContext.Provider
            value={{
                sidebarOpen,
                toggleSidebar,
                closeSidebar,

                appointments,
                addAppointment,
                updateAppointment,
                deleteAppointment,
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
    const { sidebarOpen, closeSidebar } = useLayout();

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
