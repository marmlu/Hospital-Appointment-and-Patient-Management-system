import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Activity,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

function MedicalRecords() {
  /* =====================================================
     STATES
  ===================================================== */

  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  /* =====================================================
     NEW RECORD
  ===================================================== */

  const [newRecord, setNewRecord] = useState({
    appointment_id: "",
    visit_date: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  /* =====================================================
     NOTIFICATION
  ===================================================== */

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 3500);
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchRecords(),
        fetchAppointments(),
      ]);
    } catch (err) {
      console.error("Error loading data:", err);

      setError(
        "Unable to load medical record data from the Laravel API."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH APPOINTMENTS
  ===================================================== */

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");

      console.log("Appointments response:", response.data);

      setAppointments(response.data.data || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
      throw err;
    }
  };

  /* =====================================================
     FETCH MEDICAL RECORDS
  ===================================================== */

  const fetchRecords = async () => {
    try {
      const response = await api.get("/medical-records");

      console.log(
        "Laravel medical records response:",
        response.data
      );

      const data = response.data.data || [];

      const formattedRecords = data.map((record) => ({
        id: `MR-${record.id}`,
        databaseId: record.id,

        patient:
          record.patient?.first_name &&
          record.patient?.last_name
            ? `${record.patient.first_name} ${record.patient.last_name}`
            : `Patient #${record.patient_id}`,

        patientId: record.patient_id,

        doctor:
          record.doctor?.user?.name ||
          record.doctor?.specialization ||
          `Doctor #${record.doctor_id}`,

        doctorId: record.doctor_id,

        appointmentId: record.appointment_id,

        department:
          record.doctor?.department?.name ||
          record.doctor?.specialization ||
          "Not specified",

        diagnosis: record.diagnosis || "",
        status: record.status || "Active",
        date: record.visit_date || "",
        symptoms: record.symptoms || "",
        treatment: record.treatment || "",
        notes: record.notes || "",
      }));

      setRecords(formattedRecords);
    } catch (err) {
      console.error(
        "Error loading medical records:",
        err
      );

      throw err;
    }
  };

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch =
        !search ||
        record.id.toLowerCase().includes(search) ||
        record.patient.toLowerCase().includes(search) ||
        String(record.patientId)
          .toLowerCase()
          .includes(search) ||
        record.doctor.toLowerCase().includes(search) ||
        record.department.toLowerCase().includes(search) ||
        record.diagnosis.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        record.status.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesDepartment =
        departmentFilter === "All" ||
        record.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [
    records,
    searchTerm,
    statusFilter,
    departmentFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / recordsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * recordsPerPage;

  const currentRecords = filteredRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  /* =====================================================
     APPOINTMENT SELECTION
  ===================================================== */

  const selectedAppointment = appointments.find(
    (appointment) =>
      Number(appointment.id) ===
      Number(newRecord.appointment_id)
  );

  /* =====================================================
     NEW RECORD FORM CHANGE
  ===================================================== */

  const handleNewRecordChange = (event) => {
    const { name, value } = event.target;

    setNewRecord((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     CREATE MEDICAL RECORD
  ===================================================== */

  const handleCreateRecord = async (event) => {
    event.preventDefault();

    if (!newRecord.appointment_id) {
      showNotification(
        "error",
        "Please select an appointment first."
      );
      return;
    }

    if (!newRecord.visit_date) {
      showNotification(
        "error",
        "Please select the visit date."
      );
      return;
    }

    if (!selectedAppointment) {
      showNotification(
        "error",
        "The selected appointment could not be found."
      );
      return;
    }

    const patientId = selectedAppointment.patient_id;
    const doctorId = selectedAppointment.doctor_id;
    const appointmentId = selectedAppointment.id;

    if (!patientId || !doctorId || !appointmentId) {
      showNotification(
        "error",
        "The selected appointment does not contain valid patient or doctor information."
      );
      return;
    }

    try {
      setError("");

      await api.post("/medical-records", {
        patient_id: Number(patientId),
        doctor_id: Number(doctorId),
        appointment_id: Number(appointmentId),
        visit_date: newRecord.visit_date,
        symptoms: newRecord.symptoms || "",
        diagnosis: newRecord.diagnosis || "",
        treatment: newRecord.treatment || "",
        notes: newRecord.notes || "",
      });

      setShowAddForm(false);

      setNewRecord({
        appointment_id: "",
        visit_date: new Date()
          .toISOString()
          .split("T")[0],
        symptoms: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      });

      await fetchRecords();

      setCurrentPage(1);

      showNotification(
        "success",
        "Medical record created successfully."
      );
    } catch (err) {
      console.error(
        "Create medical record error:",
        err
      );

      showNotification(
        "error",
        err.response?.data?.message ||
          "Failed to create medical record."
      );
    }
  };

  /* =====================================================
     EDIT FORM CHANGE
  ===================================================== */

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingRecord((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     UPDATE MEDICAL RECORD
  ===================================================== */

  const handleUpdateRecord = async (event) => {
    event.preventDefault();

    if (!editingRecord) {
      return;
    }

    try {
      setError("");

      await api.put(
        `/medical-records/${editingRecord.databaseId}`,
        {
          patient_id: Number(editingRecord.patientId),
          doctor_id: Number(editingRecord.doctorId),
          appointment_id: Number(
            editingRecord.appointmentId
          ),
          visit_date: editingRecord.date,
          symptoms: editingRecord.symptoms || "",
          diagnosis: editingRecord.diagnosis || "",
          treatment: editingRecord.treatment || "",
          notes: editingRecord.notes || "",
        }
      );

      setEditingRecord(null);

      await fetchRecords();

      showNotification(
        "success",
        "Medical record updated successfully."
      );
    } catch (err) {
      console.error(
        "Update medical record error:",
        err
      );

      showNotification(
        "error",
        err.response?.data?.message ||
          "Failed to update medical record."
      );
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDeleteRecord = (record) => {
    setDeleteRecord(record);
  };

  /* =====================================================
     CONFIRM DELETE
  ===================================================== */

  const confirmDeleteRecord = async () => {
    if (!deleteRecord) {
      return;
    }

    try {
      await api.delete(
        `/medical-records/${deleteRecord.databaseId}`
      );

      setDeleteRecord(null);
      setSelectedRecord(null);

      await fetchRecords();

      showNotification(
        "success",
        "Medical record deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete medical record error:",
        err
      );

      showNotification(
        "error",
        err.response?.data?.message ||
          "Failed to delete medical record."
      );
    }
  };

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setCurrentPage(1);
  };

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeCount = records.filter(
    (record) =>
      record.status.toLowerCase() === "active"
  ).length;

  const completedCount = records.filter(
    (record) =>
      record.status.toLowerCase() === "completed"
  ).length;

  /* =====================================================
     MEDICAL RECORD OVERVIEW DATA
  ===================================================== */

  const recordOverview = useMemo(() => {
    const total = records.length;

    if (total === 0) {
      return [
        {
          name: "Active",
          count: 0,
          percentage: 0,
          color: "#2563eb",
        },
        {
          name: "Completed",
          count: 0,
          percentage: 0,
          color: "#22c55e",
        },
      ];
    }

    const active = records.filter(
      (record) =>
        record.status.toLowerCase() === "active"
    ).length;

    const completed = records.filter(
      (record) =>
        record.status.toLowerCase() === "completed"
    ).length;

    const other = total - active - completed;

    return [
      {
        name: "Active",
        count: active,
        percentage: Math.round(
          (active / total) * 100
        ),
        color: "#2563eb",
      },
      {
        name: "Completed",
        count: completed,
        percentage: Math.round(
          (completed / total) * 100
        ),
        color: "#22c55e",
      },
      {
        name: "Other",
        count: other,
        percentage: Math.round(
          (other / total) * 100
        ),
        color: "#a78bfa",
      },
    ].filter((item) => item.count > 0);
  }, [records]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Medical Records</h1>
            <p>Loading medical records...</p>
          </div>
        </div>

        <div className="table-card">
          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            Loading records...
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="page-container">

      {/* =================================================
          MODERN NOTIFICATION
      ================================================= */}

      {notification.show && (
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "25px",
            zIndex: 9999,
            minWidth: "320px",
            maxWidth: "420px",
            padding: "16px 18px",
            borderRadius: "14px",
            background: "#ffffff",
            border:
              notification.type === "success"
                ? "1px solid #bbf7d0"
                : "1px solid #fecaca",
            boxShadow:
              "0 15px 40px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "13px",
            animation:
              "slideInNotification 0.3s ease",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                notification.type === "success"
                  ? "#dcfce7"
                  : "#fee2e2",
              color:
                notification.type === "success"
                  ? "#16a34a"
                  : "#dc2626",
              flexShrink: 0,
            }}
          >
            {notification.type === "success" ? (
              <CheckCircle size={21} />
            ) : (
              <AlertCircle size={21} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <strong
              style={{
                display: "block",
                marginBottom: "3px",
                color: "#1f2937",
                fontSize: "14px",
              }}
            >
              {notification.type === "success"
                ? "Success"
                : "Something went wrong"}
            </strong>

            <span
              style={{
                color: "#6b7280",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {notification.message}
            </span>
          </div>

          <button
            onClick={() =>
              setNotification({
                show: false,
                type: "",
                message: "",
              })
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#9ca3af",
              padding: "4px",
            }}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">
        <div>
          <h1>Medical Records</h1>

          <p>
            Manage patient medical history and
            clinical information
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          <Plus size={18} />
          New Medical Record
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={23} />
          </div>

          <div className="stat-content">
            <span>Total Records</span>
            <h2>{records.length}</h2>
            <small>All medical records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={23} />
          </div>

          <div className="stat-content">
            <span>Active Records</span>
            <h2>{activeCount}</h2>
            <small>Currently active</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={23} />
          </div>

          <div className="stat-content">
            <span>Completed</span>
            <h2>{completedCount}</h2>
            <small>Completed records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={23} />
          </div>

          <div className="stat-content">
            <span>Search Results</span>
            <h2>{filteredRecords.length}</h2>
            <small>Matching records</small>
          </div>
        </div>

      </div>
{/* =================================================
    MEDICAL RECORD OVERVIEW
================================================= */}

<div
  className="medical-record-overview-card"
  style={{
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow:
      "0 4px 20px rgba(15, 23, 42, 0.06)",
    border: "1px solid #eef2f7",
  }}
>
  {/* HEADER */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "22px",
    }}
  >
    <div>
      <h3
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 700,
          color: "#172033",
        }}
      >
        Department Distribution
      </h3>

      <p
        style={{
          margin: "5px 0 0",
          fontSize: "13px",
          color: "#8a94a6",
        }}
      >
        Distribution of medical records by department
      </p>
    </div>

    <div
      style={{
        fontSize: "13px",
        color: "#64748b",
        background: "#f8fafc",
        padding: "8px 12px",
        borderRadius: "8px",
      }}
    >
      Total:{" "}
      <strong style={{ color: "#172033" }}>
        {records.length}
      </strong>
    </div>
  </div>

  {/* CHART CONTENT */}

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "55px",
      minHeight: "245px",
    }}
  >
    {/* =================================================
        MULTI-COLOR DONUT
    ================================================= */}

    <div
      style={{
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        position: "relative",
        flexShrink: 0,

        background:
          records.length === 0
            ? "#e5e7eb"
            : (() => {
                let current = 0;

                const parts =
                  recordOverview.map((item) => {
                    const start = current;

                    current += item.percentage;

                    return `${item.color} ${start}% ${current}%`;
                  });

                return `conic-gradient(${parts.join(
                  ", "
                )})`;
              })(),
      }}
    >
      {/* WHITE CENTER */}

      <div
        style={{
          position: "absolute",
          width: "108px",
          height: "108px",
          borderRadius: "50%",
          background: "#ffffff",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%, -50%)",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          boxShadow:
            "0 1px 4px rgba(15, 23, 42, 0.03)",
        }}
      >
        <strong
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#172033",
            lineHeight: 1,
          }}
        >
          {records.length}
        </strong>

        <span
          style={{
            marginTop: "7px",
            fontSize: "12px",
            color: "#8a94a6",
          }}
        >
          Total Records
        </span>
      </div>
    </div>

    {/* =================================================
        DEPARTMENT LEGEND
    ================================================= */}

    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        maxWidth: "520px",
      }}
    >
      {recordOverview.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* DEPARTMENT NAME */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                minWidth: "10px",
                borderRadius: "50%",
                background: item.color,
                display: "inline-block",
              }}
            />

            <span
              style={{
                fontSize: "13px",
                color: "#334155",
                fontWeight: 500,
              }}
            >
              {item.name}
            </span>
          </div>

          {/* COUNT + PERCENTAGE */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "35px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#64748b",
                minWidth: "70px",
                textAlign: "right",
              }}
            >
              {item.count}{" "}
              {item.count === 1
                ? "record"
                : "records"}
            </span>

            <strong
              style={{
                fontSize: "13px",
                color: "#172033",
                minWidth: "40px",
                textAlign: "right",
              }}
            >
              {item.percentage}%
            </strong>
          </div>
        </div>
      ))}

      {/* NO RECORDS */}

      {records.length === 0 && (
        <div
          style={{
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          No medical records available.
        </div>
      )}
    </div>
  </div>
</div>
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search patient, doctor, diagnosis..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(event) => {
            setDepartmentFilter(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">
            All Departments
          </option>

          <option value="cardiology">
            Cardiology
          </option>

          <option value="Pediatrics">
            Pediatrics
          </option>

          <option value="Neurology">
            Neurology
          </option>

          <option value="Dermatology">
            Dermatology
          </option>
        </select>

        <button
          className="secondary-btn"
          onClick={resetFilters}
        >
          Reset
        </button>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-card">

        <div className="table-title">
          <FileText size={20} />

          <h3>
            Medical Records List
          </h3>
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Record ID</th>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Diagnosis</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.databaseId}>

                    <td>{record.id}</td>

                    <td>{record.patient}</td>

                    <td>{record.patientId}</td>

                    <td>{record.doctor}</td>

                    <td>{record.department}</td>

                    <td>
                      {record.diagnosis || "—"}
                    </td>

                    <td>
                      <span
                        className={
                          record.status.toLowerCase() ===
                          "active"
                            ? "status active"
                            : "status closed"
                        }
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>{record.date}</td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="icon-btn view"
                          title="View"
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="icon-btn edit"
                          title="Edit"
                          onClick={() =>
                            setEditingRecord({
                              ...record,
                            })
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-btn delete"
                          title="Delete"
                          onClick={() =>
                            handleDeleteRecord(record)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="empty-state"
                  >
                    No medical records found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="pagination">

          <span>
            Showing{" "}
            {filteredRecords.length === 0
              ? 0
              : startIndex + 1}{" "}
            to{" "}
            {Math.min(
              startIndex + recordsPerPage,
              filteredRecords.length
            )}{" "}
            of {filteredRecords.length} records
          </span>

          <div className="pagination-controls">

            <button
              disabled={safeCurrentPage === 1}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  safeCurrentPage === page
                    ? "current"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            <button
              disabled={
                safeCurrentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
                )
              }
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {selectedRecord && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedRecord(null)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Medical Record Details
                </h2>

                <p>
                  {selectedRecord.id}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="record-details">

              <div>
                <span>Patient</span>
                <strong>
                  {selectedRecord.patient}
                </strong>
              </div>

              <div>
                <span>Patient ID</span>
                <strong>
                  {selectedRecord.patientId}
                </strong>
              </div>

              <div>
                <span>Doctor</span>
                <strong>
                  {selectedRecord.doctor}
                </strong>
              </div>

              <div>
                <span>Department</span>
                <strong>
                  {selectedRecord.department}
                </strong>
              </div>

              <div>
                <span>Appointment ID</span>
                <strong>
                  {selectedRecord.appointmentId}
                </strong>
              </div>

              <div>
                <span>Diagnosis</span>
                <strong>
                  {selectedRecord.diagnosis || "—"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedRecord.status}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {selectedRecord.date}
                </strong>
              </div>

              <div className="full-detail">
                <span>Symptoms</span>

                <p>
                  {selectedRecord.symptoms ||
                    "No symptoms recorded."}
                </p>
              </div>

              <div className="full-detail">
                <span>Treatment</span>

                <p>
                  {selectedRecord.treatment ||
                    "No treatment recorded."}
                </p>
              </div>

              <div className="full-detail">
                <span>Notes</span>

                <p>
                  {selectedRecord.notes ||
                    "No notes available."}
                </p>
              </div>

            </div>

            <div className="modal-footer">

              <button
                className="secondary-btn"
                onClick={() => {
                  setEditingRecord({
                    ...selectedRecord,
                  });

                  setSelectedRecord(null);
                }}
              >
                <Pencil size={16} />
                Edit Record
              </button>

              <button
                className="primary-btn"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          NEW MEDICAL RECORD MODAL
      ================================================= */}

      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowAddForm(false)
          }
        >

          <div
            className="modal form-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  New Medical Record
                </h2>

                <p>
                  Select an appointment and
                  record the patient's clinical
                  information.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleCreateRecord}>

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>
                    Appointment *
                  </label>

                  <select
                    name="appointment_id"
                    value={
                      newRecord.appointment_id
                    }
                    onChange={
                      handleNewRecordChange
                    }
                  >

                    <option value="">
                      Select Appointment
                    </option>

                    {appointments.map(
                      (appointment) => {

                        const patientName =
                          appointment.patient
                            ? `${appointment.patient.first_name || ""} ${appointment.patient.last_name || ""}`.trim()
                            : `Patient #${appointment.patient_id}`;

                        const doctorName =
                          appointment.doctor
                            ?.specialization ||
                          `Doctor #${appointment.doctor_id}`;

                        return (
                          <option
                            key={appointment.id}
                            value={appointment.id}
                          >
                            {patientName} —{" "}
                            {doctorName} —{" "}
                            {appointment.appointment_date}{" "}
                            —{" "}
                            {appointment.appointment_time}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>Patient</label>

                  <input
                    type="text"
                    value={
                      selectedAppointment?.patient
                        ? `${selectedAppointment.patient.first_name || ""} ${selectedAppointment.patient.last_name || ""}`.trim()
                        : ""
                    }
                    placeholder="Automatically selected"
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Doctor</label>

                  <input
                    type="text"
                    value={
                      selectedAppointment?.doctor
                        ?.specialization || ""
                    }
                    placeholder="Automatically selected"
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Department</label>

                  <input
                    type="text"
                    value={
                      selectedAppointment?.doctor
                        ?.department?.name ||
                      selectedAppointment?.doctor
                        ?.specialization ||
                      ""
                    }
                    placeholder="Automatically selected"
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>
                    Visit Date *
                  </label>

                  <input
                    type="date"
                    name="visit_date"
                    value={
                      newRecord.visit_date
                    }
                    onChange={
                      handleNewRecordChange
                    }
                  />

                </div>

                <div className="form-group full-width">

                  <label>Symptoms</label>

                  <textarea
                    name="symptoms"
                    value={
                      newRecord.symptoms
                    }
                    onChange={
                      handleNewRecordChange
                    }
                    placeholder="Enter patient symptoms..."
                    rows="3"
                  />

                </div>

                <div className="form-group">

                  <label>Diagnosis</label>

                  <input
                    name="diagnosis"
                    value={
                      newRecord.diagnosis
                    }
                    onChange={
                      handleNewRecordChange
                    }
                    placeholder="Enter diagnosis"
                  />

                </div>

                <div className="form-group">

                  <label>Treatment</label>

                  <input
                    name="treatment"
                    value={
                      newRecord.treatment
                    }
                    onChange={
                      handleNewRecordChange
                    }
                    placeholder="Enter treatment"
                  />

                </div>

                <div className="form-group full-width">

                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={newRecord.notes}
                    onChange={
                      handleNewRecordChange
                    }
                    placeholder="Enter medical notes..."
                    rows="4"
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowAddForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <Plus size={17} />
                  Create Record
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingRecord && (
        <div
          className="modal-overlay"
          onClick={() =>
            setEditingRecord(null)
          }
        >

          <div
            className="modal form-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Edit Medical Record
                </h2>

                <p>
                  {editingRecord.id}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setEditingRecord(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleUpdateRecord}>

              <div className="form-grid">

                <div className="form-group">

                  <label>Patient</label>

                  <input
                    type="text"
                    value={
                      editingRecord.patient || ""
                    }
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Doctor</label>

                  <input
                    type="text"
                    value={
                      editingRecord.doctor || ""
                    }
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Department</label>

                  <input
                    type="text"
                    value={
                      editingRecord.department || ""
                    }
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Appointment</label>

                  <input
                    type="text"
                    value={
                      editingRecord.appointmentId || ""
                    }
                    disabled
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>Visit Date</label>

                  <input
                    type="date"
                    name="date"
                    value={
                      editingRecord.date || ""
                    }
                    onChange={
                      handleEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>Diagnosis</label>

                  <input
                    name="diagnosis"
                    value={
                      editingRecord.diagnosis || ""
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter diagnosis"
                  />

                </div>

                <div className="form-group">

                  <label>Treatment</label>

                  <input
                    name="treatment"
                    value={
                      editingRecord.treatment || ""
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Enter treatment"
                  />

                </div>

                <div className="form-group full-width">

                  <label>Symptoms</label>

                  <textarea
                    name="symptoms"
                    value={
                      editingRecord.symptoms || ""
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="3"
                    placeholder="Enter symptoms..."
                  />

                </div>

                <div className="form-group full-width">

                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={
                      editingRecord.notes || ""
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="4"
                    placeholder="Enter medical notes..."
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setEditingRecord(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteRecord && (
        <div
          className="modal-overlay"
          onClick={() =>
            setDeleteRecord(null)
          }
        >

          <div
            className="delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="delete-modal-icon">
              <Trash2 size={24} />
            </div>

            <h2>
              Delete Medical Record?
            </h2>

            <p>
              Are you sure you want to delete
              the medical record for{" "}
              <strong>
                {deleteRecord.patient}
              </strong>
              ?
            </p>

            <span className="delete-warning">
              This action cannot be undone.
            </span>

            <div className="delete-modal-actions">

              <button
                className="cancel-delete-btn"
                onClick={() =>
                  setDeleteRecord(null)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={
                  confirmDeleteRecord
                }
              >
                <Trash2 size={16} />
                Delete Record
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =================================================
          NOTIFICATION ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes slideInNotification {
            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>

    </div>
  );
}

export default MedicalRecords;