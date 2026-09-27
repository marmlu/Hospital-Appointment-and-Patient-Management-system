
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Search,
  Eye,
  Printer,
  Download,
  FileText,
  Users,
  Pill,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

function Reports() {
  /* =====================================================
     STATE
  ===================================================== */

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const [selectedReport, setSelectedReport] =
    useState(null);

  /* =====================================================
     LOAD REAL DATA FROM LARAVEL
  ===================================================== */

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        medicalRecordResponse,
        prescriptionResponse,
      ] = await Promise.all([
        api.get("/medical-records"),
        api.get("/prescriptions"),
      ]);

      const medicalRecordData =
        medicalRecordResponse.data?.data || [];

      const prescriptionData =
        prescriptionResponse.data?.data || [];

      setMedicalRecords(medicalRecordData);
      setPrescriptions(prescriptionData);
    } catch (err) {
      console.error("Error loading reports:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load reports from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     HELPER - PATIENT NAME
  ===================================================== */

  const getPatientName = (patient) => {
    if (!patient) {
      return "Unknown Patient";
    }

    const fullName =
      `${patient.first_name || ""} ${
        patient.last_name || ""
      }`.trim();

    return fullName || "Unknown Patient";
  };

  /* =====================================================
     HELPER - DOCTOR NAME
  ===================================================== */

  const getDoctorName = (doctor) => {
    if (!doctor) {
      return "Unknown Doctor";
    }

    return (
      doctor.user?.name ||
      doctor.user?.first_name ||
      doctor.name ||
      "Unknown Doctor"
    );
  };

  /* =====================================================
     HELPER - DEPARTMENT
  ===================================================== */

  const getDepartmentName = (doctor) => {
    return (
      doctor?.department?.name ||
      doctor?.department?.department_name ||
      "Not specified"
    );
  };

  /* =====================================================
     CALCULATE PRESCRIPTION STATUS
  ===================================================== */

  const calculatePrescriptionStatus = (
    date,
    duration
  ) => {
    if (!date || !duration) {
      return "Active";
    }

    const numberMatch =
      String(duration).match(/\d+/);

    if (!numberMatch) {
      return "Active";
    }

    const days = parseInt(
      numberMatch[0],
      10
    );

    if (isNaN(days)) {
      return "Active";
    }

    const startDate = new Date(date);

    const endDate = new Date(startDate);

    endDate.setDate(
      endDate.getDate() + days
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today <= endDate
      ? "Active"
      : "Completed";
  };

  /* =====================================================
     CREATE REPORT DATA
  ===================================================== */

  const reports = useMemo(() => {
    const medicalRecordReports =
      medicalRecords.map((record) => ({
        id: `MR-${String(record.id).padStart(
          4,
          "0"
        )}`,

        originalId: record.id,

        patient: getPatientName(
          record.patient
        ),

        patientId: record.patient
          ? `PT-${String(
              record.patient.id
            ).padStart(4, "0")}`
          : `PT-${String(
              record.patient_id || ""
            ).padStart(4, "0")}`,

        department: getDepartmentName(
          record.doctor
        ),

        doctor: getDoctorName(
          record.doctor
        ),

        type: "Medical Record",

        diagnosis:
          record.diagnosis ||
          "Not specified",

        status: "Completed",

        date:
          record.visit_date ||
          record.created_at?.split("T")[0] ||
          "",

        symptoms:
          record.symptoms ||
          "Not specified",

        treatment:
          record.treatment ||
          "Not specified",

        notes:
          record.notes ||
          "No notes",

        medicine: null,

        dosage: null,

        frequency: null,

        duration: null,

        quantity: null,

        instructions: null,

        medicalRecord: record,

        prescription: null,
      }));

    const prescriptionReports =
      prescriptions.map((prescription) => {
        const record =
          prescription.medical_record;

        const doctor =
          record?.doctor;

        const patient =
          record?.patient;

        return {
          id: `RX-${String(
            prescription.id
          ).padStart(4, "0")}`,

          originalId:
            prescription.id,

          patient:
            getPatientName(patient),

          patientId: patient
            ? `PT-${String(
                patient.id
              ).padStart(4, "0")}`
            : record?.patient_id
              ? `PT-${String(
                  record.patient_id
                ).padStart(4, "0")}`
              : "N/A",

          department:
            getDepartmentName(doctor),

          doctor:
            getDoctorName(doctor),

          type: "Prescription",

          diagnosis:
            record?.diagnosis ||
            "Not specified",

          status:
            calculatePrescriptionStatus(
              prescription.prescribed_date,
              prescription.duration
            ),

          date:
            prescription.prescribed_date ||
            prescription.created_at?.split(
              "T"
            )[0] ||
            "",

          symptoms:
            record?.symptoms ||
            "Not specified",

          treatment:
            record?.treatment ||
            "Not specified",

          notes:
            record?.notes ||
            "No notes",

          medicine:
            prescription.medicine_name ||
            "",

          dosage:
            prescription.dosage ||
            "",

          frequency:
            prescription.frequency ||
            "",

          duration:
            prescription.duration ||
            "",

          quantity:
            prescription.quantity,

          instructions:
            prescription.instructions ||
            "No instructions",

          medicalRecord:
            record || null,

          prescription:
            prescription,
        };
      });

    return [
      ...medicalRecordReports,
      ...prescriptionReports,
    ].sort((a, b) => {
      return (
        new Date(b.date || 0) -
        new Date(a.date || 0)
      );
    });
  }, [
    medicalRecords,
    prescriptions,
  ]);

  /* =====================================================
     DEPARTMENTS
  ===================================================== */

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        reports
          .map(
            (report) =>
              report.department
          )
          .filter(
            (department) =>
              department &&
              department !==
                "Not specified"
          )
      ),
    ];

    return uniqueDepartments.sort();
  }, [reports]);

  /* =====================================================
     FILTER REPORTS
  ===================================================== */

  const filteredReports = useMemo(() => {
    const search =
      searchTerm
        .toLowerCase()
        .trim();

    return reports.filter((report) => {
      const matchesSearch =
        !search ||
        report.id
          .toLowerCase()
          .includes(search) ||
        report.patient
          .toLowerCase()
          .includes(search) ||
        report.patientId
          .toLowerCase()
          .includes(search) ||
        report.doctor
          .toLowerCase()
          .includes(search) ||
        report.department
          .toLowerCase()
          .includes(search) ||
        report.diagnosis
          .toLowerCase()
          .includes(search) ||
        report.type
          .toLowerCase()
          .includes(search) ||
        (report.medicine &&
          report.medicine
            .toLowerCase()
            .includes(search));

      const matchesType =
        typeFilter === "All" ||
        report.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        report.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [
    reports,
    searchTerm,
    typeFilter,
    statusFilter,
    departmentFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReports.length /
        reportsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    reportsPerPage;

  const currentReports =
    filteredReports.slice(
      startIndex,
      startIndex + reportsPerPage
    );

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalReports =
    reports.length;

  const medicalReports =
    reports.filter(
      (report) =>
        report.type ===
        "Medical Record"
    ).length;

  const prescriptionReports =
    reports.filter(
      (report) =>
        report.type ===
        "Prescription"
    ).length;

  const activeReports =
    reports.filter(
      (report) =>
        report.status ===
        "Active"
    ).length;

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setCurrentPage(1);
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const exportCSV = () => {
    if (
      filteredReports.length ===
      0
    ) {
      alert(
        "There are no reports to export."
      );
      return;
    }

    const headers = [
      "Report ID",
      "Patient",
      "Patient ID",
      "Department",
      "Doctor",
      "Type",
      "Diagnosis",
      "Status",
      "Date",
    ];

    const rows =
      filteredReports.map(
        (report) => [
          report.id,
          report.patient,
          report.patientId,
          report.department,
          report.doctor,
          report.type,
          report.diagnosis,
          report.status,
          report.date,
        ]
      );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "ethiocare-reports.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     PRINT
  ===================================================== */

  const printReport = () => {
    window.print();
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="page-container">
        <div
          style={{
            minHeight: "400px",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            flexDirection:
              "column",
            gap: "12px",
          }}
        >
          <Loader2
            size={34}
            className="loading-spinner"
          />

          <p>
            Loading reports...
          </p>
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
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <h1>Reports</h1>

          <p>
            Monitor hospital records and
            prescription activity
          </p>
        </div>

        <div
          className="report-header-actions"
        >

          <button
            className="secondary-btn"
            onClick={fetchReports}
            title="Refresh reports"
          >
            <RefreshCw
              size={17}
            />
            Refresh
          </button>

          <button
            className="secondary-btn"
            onClick={
              printReport
            }
          >
            <Printer
              size={17}
            />
            Print
          </button>

          <button
            className="primary-btn"
            onClick={
              exportCSV
            }
          >
            <Download
              size={17}
            />
            Export CSV
          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            padding:
              "14px 18px",
            marginBottom:
              "20px",
            borderRadius:
              "12px",
            background:
              "#fff1f2",
            border:
              "1px solid #fecdd3",
            color:
              "#be123c",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: "15px",
          }}
        >
          <span>
            {error}
          </span>

          <button
            className="secondary-btn"
            onClick={
              fetchReports
            }
          >
            Try Again
          </button>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <BarChart3
              size={23}
            />
          </div>

          <div className="stat-content">

            <span>
              Total Reports
            </span>

            <h2>
              {totalReports}
            </h2>

            <small>
              All hospital reports
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <FileText
              size={23}
            />
          </div>

          <div className="stat-content">

            <span>
              Medical Records
            </span>

            <h2>
              {medicalReports}
            </h2>

            <small>
              Medical record reports
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Pill
              size={23}
            />
          </div>

          <div className="stat-content">

            <span>
              Prescriptions
            </span>

            <h2>
              {prescriptionReports}
            </h2>

            <small>
              Prescription reports
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Activity
              size={23}
            />
          </div>

          <div className="stat-content">

            <span>
              Active Reports
            </span>

            <h2>
              {activeReports}
            </h2>

            <small>
              Currently active
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          DEPARTMENT OVERVIEW
      ================================================= */}

      {departments.length > 0 && (
        <div className="department-summary">

          <div className="section-heading">

            <div>
              <h3>
                Department Overview
              </h3>

              <p>
                Distribution of reports
                by department
              </p>
            </div>

            <Users size={20} />

          </div>

          <div className="department-grid">

            {departments.map(
              (department) => {

                const count =
                  reports.filter(
                    (report) =>
                      report.department ===
                      department
                  ).length;

                const percentage =
                  totalReports > 0
                    ? Math.round(
                        (count /
                          totalReports) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="department-item"
                    key={
                      department
                    }
                  >

                    <div className="department-info">

                      <span>
                        {department}
                      </span>

                      <strong>
                        {count}
                      </strong>

                    </div>

                    <div className="department-bar">

                      <div
                        className="department-progress"
                        style={{
                          width: `${Math.max(
                            percentage,
                            8
                          )}%`,
                        }}
                      />

                    </div>

                    <small>
                      {percentage}% of
                      reports
                    </small>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="toolbar">

        <div className="search-box">

          <Search
            size={18}
          />

          <input
            type="text"
            placeholder="Search patient, doctor, diagnosis..."
            value={
              searchTerm
            }
            onChange={(
              event
            ) => {
              setSearchTerm(
                event.target
                  .value
              );
              setCurrentPage(
                1
              );
            }}
          />

        </div>

        <select
          className="filter-select"
          value={
            typeFilter
          }
          onChange={(
            event
          ) => {
            setTypeFilter(
              event.target
                .value
            );
            setCurrentPage(
              1
            );
          }}
        >

          <option value="All">
            All Types
          </option>

          <option value="Medical Record">
            Medical Record
          </option>

          <option value="Prescription">
            Prescription
          </option>

        </select>

        <select
          className="filter-select"
          value={
            statusFilter
          }
          onChange={(
            event
          ) => {
            setStatusFilter(
              event.target
                .value
            );
            setCurrentPage(
              1
            );
          }}
        >

          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Completed">
            Completed
          </option>

        </select>

        <select
          className="filter-select"
          value={
            departmentFilter
          }
          onChange={(
            event
          ) => {
            setDepartmentFilter(
              event.target
                .value
            );
            setCurrentPage(
              1
            );
          }}
        >

          <option value="All">
            All Departments
          </option>

          {departments.map(
            (department) => (
              <option
                key={
                  department
                }
                value={
                  department
                }
              >
                {department}
              </option>
            )
          )}

        </select>

        <button
          className="secondary-btn"
          onClick={
            resetFilters
          }
        >
          Reset
        </button>

      </div>

      {/* =================================================
          REPORT TABLE
      ================================================= */}

      <div className="table-card">

        <div className="table-title">

          <BarChart3
            size={20}
          />

          <div>
            <h3>
              Report Details
            </h3>

            <p>
              Real-time data from
              your hospital database
            </p>
          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>
                  Report ID
                </th>

                <th>
                  Patient
                </th>

                <th>
                  Department
                </th>

                <th>
                  Doctor
                </th>

                <th>
                  Type
                </th>

                <th>
                  Diagnosis
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {currentReports.length >
              0 ? (

                currentReports.map(
                  (report) => (

                    <tr
                      key={`${report.type}-${report.originalId}`}
                    >

                      <td>
                        <strong>
                          {report.id}
                        </strong>
                      </td>

                      <td>
                        {report.patient}
                      </td>

                      <td>
                        {report.department}
                      </td>

                      <td>
                        {report.doctor}
                      </td>

                      <td>

                        <span
                          className="report-type"
                        >
                          {report.type}
                        </span>

                      </td>

                      <td>
                        {report.diagnosis}
                      </td>

                      <td>

                        <span
                          className={
                            report.status ===
                            "Active"
                              ? "status active"
                              : "status closed"
                          }
                        >
                          {
                            report.status
                          }
                        </span>

                      </td>

                      <td>
                        {report.date ||
                          "N/A"}
                      </td>

                      <td>

                        <button
                          className="icon-btn view"
                          title="View Report"
                          onClick={() =>
                            setSelectedReport(
                              report
                            )
                          }
                        >
                          <Eye
                            size={16}
                          />
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="empty-state"
                  >
                    <div
                      style={{
                        padding:
                          "30px",
                        textAlign:
                          "center",
                      }}
                    >
                      <FileText
                        size={35}
                        style={{
                          marginBottom:
                            "10px",
                          opacity:
                            0.45,
                        }}
                      />

                      <p>
                        No reports
                        found
                      </p>

                      <small>
                        Try changing
                        your search or
                        filters.
                      </small>
                    </div>
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

            {filteredReports.length ===
            0
              ? 0
              : startIndex + 1}

            {" "}to{" "}

            {Math.min(
              startIndex +
                reportsPerPage,
              filteredReports.length
            )}

            {" "}of{" "}

            {
              filteredReports.length
            }{" "}
            reports

          </span>

          <div className="pagination-controls">

            <button
              disabled={
                safeCurrentPage ===
                1
              }
              onClick={() =>
                setCurrentPage(
                  (
                    page
                  ) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
            >
              <ChevronLeft
                size={17}
              />
            </button>

            {Array.from(
              {
                length:
                  totalPages,
              },
              (
                _,
                index
              ) =>
                index + 1
            ).map(
              (page) => (

                <button
                  key={
                    page
                  }
                  className={
                    safeCurrentPage ===
                    page
                      ? "current"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                >
                  {page}
                </button>

              )
            )}

            <button
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (
                    page
                  ) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
            >
              <ChevronRight
                size={17}
              />
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          VIEW REPORT MODAL
      ================================================= */}

      {selectedReport && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedReport(
              null
            )
          }
        >

          <div
            className="modal"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Report Details
                </h2>

                <p>
                  {
                    selectedReport.id
                  }
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedReport(
                    null
                  )
                }
              >
                <X
                  size={20}
                />
              </button>

            </div>

            <div className="record-details">

              <div>
                <span>
                  Patient
                </span>

                <strong>
                  {
                    selectedReport.patient
                  }
                </strong>
              </div>

              <div>
                <span>
                  Patient ID
                </span>

                <strong>
                  {
                    selectedReport.patientId
                  }
                </strong>
              </div>

              <div>
                <span>
                  Department
                </span>

                <strong>
                  {
                    selectedReport.department
                  }
                </strong>
              </div>

              <div>
                <span>
                  Doctor
                </span>

                <strong>
                  {
                    selectedReport.doctor
                  }
                </strong>
              </div>

              <div>
                <span>
                  Report Type
                </span>

                <strong>
                  {
                    selectedReport.type
                  }
                </strong>
              </div>

              <div>
                <span>
                  Diagnosis
                </span>

                <strong>
                  {
                    selectedReport.diagnosis
                  }
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {
                    selectedReport.status
                  }
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {
                    selectedReport.date ||
                    "N/A"
                  }
                </strong>
              </div>

              {/* MEDICAL RECORD INFORMATION */}

              {selectedReport.type ===
                "Medical Record" && (
                <>
                  <div>
                    <span>
                      Symptoms
                    </span>

                    <strong>
                      {
                        selectedReport.symptoms
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Treatment
                    </span>

                    <strong>
                      {
                        selectedReport.treatment
                      }
                    </strong>
                  </div>

                  <div className="full-detail">

                    <span>
                      Notes
                    </span>

                    <p>
                      {
                        selectedReport.notes
                      }
                    </p>

                  </div>
                </>
              )}

              {/* PRESCRIPTION INFORMATION */}

              {selectedReport.type ===
                "Prescription" && (
                <>
                  <div>
                    <span>
                      Medicine
                    </span>

                    <strong>
                      {
                        selectedReport.medicine
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Dosage
                    </span>

                    <strong>
                      {
                        selectedReport.dosage
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Frequency
                    </span>

                    <strong>
                      {
                        selectedReport.frequency
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Duration
                    </span>

                    <strong>
                      {
                        selectedReport.duration
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Quantity
                    </span>

                    <strong>
                      {
                        selectedReport.quantity ??
                        "Not specified"
                      }
                    </strong>
                  </div>

                  <div className="full-detail">

                    <span>
                      Instructions
                    </span>

                    <p>
                      {
                        selectedReport.instructions
                      }
                    </p>

                  </div>
                </>
              )}

            </div>

            <div className="modal-footer">

              <button
                className="secondary-btn"
                onClick={
                  printReport
                }
              >
                <Printer
                  size={16}
                />
                Print
              </button>

              <button
                className="primary-btn"
                onClick={() =>
                  setSelectedReport(
                    null
                  )
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Reports;

