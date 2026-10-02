import React, { useState } from "react";
import {
  Building2,
  Users,
  Stethoscope,
  CalendarDays,
  Search,
} from "lucide-react";

import "./ModulePages.css";

const sampleDepartments = [
  {
    name: "General Medicine",
    description: "Primary and general medical care",
    percentage: 35,
    doctors: 18,
    patients: 435,
    appointments: 96,
  },
  {
    name: "Pediatrics",
    description: "Healthcare for children and infants",
    percentage: 20,
    doctors: 12,
    patients: 249,
    appointments: 62,
  },
  {
    name: "Cardiology",
    description: "Heart and cardiovascular care",
    percentage: 15,
    doctors: 10,
    patients: 187,
    appointments: 48,
  },
  {
    name: "Orthopedics",
    description: "Bones, joints and movement care",
    percentage: 10,
    doctors: 8,
    patients: 124,
    appointments: 34,
  },
  {
    name: "Gynecology",
    description: "Women's health services",
    percentage: 10,
    doctors: 9,
    patients: 132,
    appointments: 38,
  },
  {
    name: "Emergency",
    description: "Urgent and emergency medical care",
    percentage: 10,
    doctors: 15,
    patients: 118,
    appointments: 42,
  },
];

function Departments() {
  const [search, setSearch] = useState("");

  const filteredDepartments =
    sampleDepartments.filter((department) =>
      department.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="module-page">

      <div className="module-header">

        <div className="module-header-left">
          <h1>Departments</h1>

          <p>
            Hospital departments and service distribution
          </p>
        </div>

        <button className="primary-action">
          <Building2 size={16} />
          Add Department
        </button>

      </div>

      <div className="module-stats">

        <div className="module-stat-card">

          <div className="module-stat-icon orange">
            <Building2 size={23} />
          </div>

          <div className="module-stat-content">
            <span>Total Departments</span>
            <strong>12</strong>
          </div>

        </div>

        <div className="module-stat-card">

          <div className="module-stat-icon green">
            <Stethoscope size={23} />
          </div>

          <div className="module-stat-content">
            <span>Doctors</span>
            <strong>85</strong>
          </div>

        </div>

        <div className="module-stat-card">

          <div className="module-stat-icon">
            <Users size={23} />
          </div>

          <div className="module-stat-content">
            <span>Patients</span>
            <strong>1,245</strong>
          </div>

        </div>

        <div className="module-stat-card">

          <div className="module-stat-icon purple">
            <CalendarDays size={23} />
          </div>

          <div className="module-stat-content">
            <span>Appointments</span>
            <strong>320</strong>
          </div>

        </div>

      </div>

      <div className="module-card">

        <div className="module-card-header">
          <h2>Department Distribution</h2>
        </div>

        <div className="module-toolbar">

          <div className="module-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        <div style={{ padding: "20px" }}>

          <div className="department-grid">

            {filteredDepartments.map(
              (department) => (

                <div
                  className="department-card"
                  key={department.name}
                >

                  <div className="department-card-top">

                    <div className="department-icon">
                      <Building2 size={22} />
                    </div>

                    <span className="department-percent">
                      {department.percentage}%
                    </span>

                  </div>

                  <h3>
                    {department.name}
                  </h3>

                  <p>
                    {department.description}
                  </p>

                  <div className="department-progress">
                    <span
                      style={{
                        width:
                          `${department.percentage}%`,
                      }}
                    />
                  </div>

                  <div className="department-info">

                    <div>
                      <strong>
                        {department.doctors}
                      </strong>

                      <span>
                        Doctors
                      </span>
                    </div>

                    <div>
                      <strong>
                        {department.patients}
                      </strong>

                      <span>
                        Patients
                      </span>
                    </div>

                    <div>
                      <strong>
                        {department.appointments}
                      </strong>

                      <span>
                        Appointments
                      </span>
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

          {filteredDepartments.length === 0 && (
            <div className="no-results">
              No departments found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Departments;