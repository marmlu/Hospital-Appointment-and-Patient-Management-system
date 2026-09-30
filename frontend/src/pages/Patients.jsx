import React, { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Eye,
} from "lucide-react";

import "./ModulePages.css";

const samplePatients = [
  {
    id: "PT-0001",
    name: "Abebe Kebede",
    age: 34,
    gender: "Male",
    phone: "0911 234 567",
    department: "General Medicine",
    status: "Active",
  },
  {
    id: "PT-0002",
    name: "Mekdes Alemu",
    age: 28,
    gender: "Female",
    phone: "0922 345 678",
    department: "Cardiology",
    status: "Active",
  },
  {
    id: "PT-0003",
    name: "Hana Tesfaye",
    age: 42,
    gender: "Female",
    phone: "0933 456 789",
    department: "Pediatrics",
    status: "Active",
  },
  {
    id: "PT-0004",
    name: "Dawit Bekele",
    age: 51,
    gender: "Male",
    phone: "0944 567 890",
    department: "Orthopedics",
    status: "Active",
  },
  {
    id: "PT-0005",
    name: "Selamawit Girma",
    age: 31,
    gender: "Female",
    phone: "0955 678 901",
    department: "Gynecology",
    status: "Active",
  },
  {
    id: "PT-0006",
    name: "Yonas Tadesse",
    age: 46,
    gender: "Male",
    phone: "0966 789 012",
    department: "General Medicine",
    status: "Inactive",
  },
];

function Patients() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filteredPatients = useMemo(() => {
    return samplePatients.filter((patient) => {
      const matchesSearch =
        patient.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patient.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        patient.phone.includes(search);

      const matchesDepartment =
        department === "All" ||
        patient.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

  return (
    <div className="module-page">

      {/* HEADER */}
      <div className="module-header">
        <div className="module-header-left">
          <h1>Patients</h1>
          <p>
            Manage and view hospital patient information
          </p>
        </div>

        <button className="primary-action">
          <UserPlus size={16} />
          Add Patient
        </button>
      </div>

      {/* STATS */}
      <div className="module-stats">

        <div className="module-stat-card">
          <div className="module-stat-icon">
            <Users size={23} />
          </div>

          <div className="module-stat-content">
            <span>Total Patients</span>
            <strong>1,245</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon green">
            <Users size={23} />
          </div>

          <div className="module-stat-content">
            <span>Active Patients</span>
            <strong>1,182</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon purple">
            <UserPlus size={23} />
          </div>

          <div className="module-stat-content">
            <span>New This Month</span>
            <strong>86</strong>
          </div>
        </div>

        <div className="module-stat-card">
          <div className="module-stat-icon orange">
            <Users size={23} />
          </div>

          <div className="module-stat-content">
            <span>Today's Visits</span>
            <strong>24</strong>
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="module-card">

        <div className="module-card-header">
          <h2>Patient Directory</h2>
        </div>

        <div className="module-toolbar">

          <div className="module-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="module-filter"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >
            <option>All</option>
            <option>General Medicine</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Orthopedics</option>
            <option>Gynecology</option>
          </select>

        </div>

        <div className="module-table-wrapper">

          <table className="module-table">

            <thead>
              <tr>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredPatients.map((patient) => (

                <tr key={patient.id}>

                  <td>
                    <div className="person-cell">

                      <div className="person-avatar">
                        {patient.name.charAt(0)}
                      </div>

                      <div className="person-details">
                        <strong>
                          {patient.name}
                        </strong>

                        <span>
                          Hospital Patient
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>{patient.id}</td>

                  <td>{patient.age}</td>

                  <td>{patient.gender}</td>

                  <td>{patient.phone}</td>

                  <td>{patient.department}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        patient.status.toLowerCase()
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="table-action"
                      title="View patient"
                    >
                      <Eye size={15} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredPatients.length === 0 && (
            <div className="no-results">
              No patients found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Patients;