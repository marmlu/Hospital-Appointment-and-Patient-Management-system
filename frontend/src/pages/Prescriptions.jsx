
import React, { useEffect, useMemo, useState } from "react";
import {
  Pill,
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
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

function Prescriptions() {
  /* =====================================================
     STATE
  ===================================================== */

  const [prescriptions, setPrescriptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [notification, setNotification] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedPrescription, setSelectedPrescription] =
    useState(null);

  const [editingPrescription, setEditingPrescription] =
    useState(null);

  const [deletePrescription, setDeletePrescription] =
    useState(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const prescriptionsPerPage = 5;

  /* =====================================================
     EMPTY FORM
  ===================================================== */

  const emptyForm = {
    medical_record_id: "",
    medicine_name: "",
    dosage: "",
    frequency: "Once daily",
    duration: "",
    quantity: "",
    instructions: "",
    prescribed_date: new Date()
      .toISOString()
      .split("T")[0],
  };

  const [newPrescription, setNewPrescription] =
    useState(emptyForm);

  /* =====================================================
     NOTIFICATION
  ===================================================== */

  const showNotification = (type, title, message) => {
    setNotification({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        prescriptionResponse,
        medicalRecordResponse,
      ] = await Promise.all([
        api.get("/prescriptions"),
        api.get("/medical-records"),
      ]);

      const prescriptionData =
        prescriptionResponse.data?.data || [];

      const medicalRecordData =
        medicalRecordResponse.data?.data || [];

      setPrescriptions(
        prescriptionData.map(formatPrescription)
      );

      setMedicalRecords(medicalRecordData);
    } catch (err) {
      console.error(
        "Error loading prescription data:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to load prescription data from the server.";

      setError(message);

      showNotification(
        "error",
        "Unable to Load",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORMAT PRESCRIPTION
  ===================================================== */

  const formatPrescription = (item) => {
    const record = item.medical_record;

    const patient = record?.patient;
    const doctor = record?.doctor;

    const patientName = patient
      ? `${patient.first_name || ""} ${
          patient.last_name || ""
        }`.trim()
      : "Unknown Patient";

    const doctorName =
      doctor?.user?.name ||
      doctor?.user?.first_name ||
      doctor?.name ||
      "Unknown Doctor";

    const prescribedDate =
      item.prescribed_date || "";

    const status = calculateStatus(
      prescribedDate,
      item.duration
    );

    return {
      ...item,

      uiId: `RX-${String(item.id).padStart(4, "0")}`,

      patient: patientName,

      patientId: patient
        ? `PT-${String(patient.id).padStart(
            4,
            "0"
          )}`
        : `PT-${String(
            record?.patient_id || ""
          ).padStart(4, "0")}`,

      doctor: doctorName,

      medicine: item.medicine_name || "",

      date: prescribedDate,

      status,

      medicalRecord: record || null,
    };
  };

  /* =====================================================
     CALCULATE STATUS
  ===================================================== */

  const calculateStatus = (date, duration) => {
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
     SELECTED MEDICAL RECORD
  ===================================================== */

  const selectedMedicalRecord = useMemo(() => {
    if (!newPrescription.medical_record_id) {
      return null;
    }

    return medicalRecords.find(
      (record) =>
        String(record.id) ===
        String(
          newPrescription.medical_record_id
        )
    );
  }, [
    medicalRecords,
    newPrescription.medical_record_id,
  ]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredPrescriptions = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return prescriptions.filter(
      (prescription) => {
        const matchesSearch =
          !search ||
          prescription.uiId
            .toLowerCase()
            .includes(search) ||
          prescription.patient
            .toLowerCase()
            .includes(search) ||
          prescription.patientId
            .toLowerCase()
            .includes(search) ||
          prescription.doctor
            .toLowerCase()
            .includes(search) ||
          prescription.medicine
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "All" ||
          prescription.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    prescriptions,
    searchTerm,
    statusFilter,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPrescriptions.length /
        prescriptionsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    prescriptionsPerPage;

  const currentPrescriptions =
    filteredPrescriptions.slice(
      startIndex,
      startIndex +
        prescriptionsPerPage
    );

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleNewPrescriptionChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setNewPrescription(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =====================================================
     CREATE
  ===================================================== */

  const handleCreatePrescription = async (
    event
  ) => {
    event.preventDefault();

    if (
      !newPrescription.medical_record_id ||
      !newPrescription.medicine_name.trim() ||
      !newPrescription.dosage.trim() ||
      !newPrescription.frequency.trim() ||
      !newPrescription.duration.trim() ||
      !newPrescription.prescribed_date
    ) {
      showNotification(
        "error",
        "Missing Information",
        "Please complete all required fields before creating the prescription."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        medical_record_id: Number(
          newPrescription.medical_record_id
        ),

        medicine_name:
          newPrescription.medicine_name.trim(),

        dosage:
          newPrescription.dosage.trim(),

        frequency:
          newPrescription.frequency.trim(),

        duration:
          newPrescription.duration.trim(),

        quantity:
          newPrescription.quantity === ""
            ? null
            : Number(
                newPrescription.quantity
              ),

        instructions:
          newPrescription.instructions.trim() ||
          null,

        prescribed_date:
          newPrescription.prescribed_date,
      };

      const response =
        await api.post(
          "/prescriptions",
          payload
        );

      const createdPrescription =
        response.data?.data;

      if (!createdPrescription) {
        throw new Error(
          "The server did not return the created prescription."
        );
      }

      setPrescriptions(
        (previous) => [
          formatPrescription(
            createdPrescription
          ),
          ...previous,
        ]
      );

      setNewPrescription({
        ...emptyForm,
        prescribed_date:
          new Date()
            .toISOString()
            .split("T")[0],
      });

      setShowAddForm(false);
      setCurrentPage(1);

      showNotification(
        "success",
        "Prescription Created",
        "The prescription was successfully saved to the system."
      );
    } catch (err) {
      console.error(
        "Error creating prescription:",
        err
      );

      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const messages =
          Object.values(
            validationErrors
          )
            .flat()
            .join(" ");

        showNotification(
          "error",
          "Validation Error",
          messages
        );
      } else {
        showNotification(
          "error",
          "Creation Failed",
          err.response?.data?.message ||
            "Failed to create the prescription."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     EDIT CHANGE
  ===================================================== */

  const handleEditChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setEditingPrescription(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdatePrescription =
    async (event) => {
      event.preventDefault();

      if (!editingPrescription) {
        return;
      }

      try {
        setSaving(true);

        const payload = {
          medicine_name:
            editingPrescription.medicine_name?.trim() ||
            editingPrescription.medicine?.trim(),

          dosage:
            editingPrescription.dosage?.trim(),

          frequency:
            editingPrescription.frequency?.trim(),

          duration:
            editingPrescription.duration?.trim(),

          quantity:
            editingPrescription.quantity ===
              "" ||
            editingPrescription.quantity ===
              null
              ? null
              : Number(
                  editingPrescription.quantity
                ),

          instructions:
            editingPrescription.instructions?.trim() ||
            null,

          prescribed_date:
            editingPrescription.prescribed_date ||
            editingPrescription.date,
        };

        const response =
          await api.put(
            `/prescriptions/${editingPrescription.id}`,
            payload
          );

        const updatedPrescription =
          response.data?.data;

        if (!updatedPrescription) {
          throw new Error(
            "The server did not return the updated prescription."
          );
        }

        setPrescriptions(
          (previous) =>
            previous.map(
              (prescription) =>
                prescription.id ===
                updatedPrescription.id
                  ? formatPrescription(
                      updatedPrescription
                    )
                  : prescription
            )
        );

        setEditingPrescription(
          null
        );

        showNotification(
          "success",
          "Prescription Updated",
          "The prescription changes were successfully saved."
        );
      } catch (err) {
        console.error(
          "Error updating prescription:",
          err
        );

        const validationErrors =
          err.response?.data?.errors;

        if (validationErrors) {
          const messages =
            Object.values(
              validationErrors
            )
              .flat()
              .join(" ");

          showNotification(
            "error",
            "Validation Error",
            messages
          );
        } else {
          showNotification(
            "error",
            "Update Failed",
            err.response?.data?.message ||
              "Failed to update the prescription."
          );
        }
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDeletePrescription = (
    id
  ) => {
    const prescription =
      prescriptions.find(
        (item) =>
          item.id === id
      );

    if (!prescription) {
      return;
    }

    setDeletePrescription(
      prescription
    );
  };

  /* =====================================================
     CONFIRM DELETE
  ===================================================== */

  const confirmDeletePrescription =
    async () => {
      if (!deletePrescription) {
        return;
      }

      try {
        setSaving(true);

        await api.delete(
          `/prescriptions/${deletePrescription.id}`
        );

        setPrescriptions(
          (previous) =>
            previous.filter(
              (prescription) =>
                prescription.id !==
                deletePrescription.id
            )
        );

        setDeletePrescription(
          null
        );

        setSelectedPrescription(
          null
        );

        setCurrentPage(
          (page) => {
            const remainingCount =
              prescriptions.length -
              1;

            const newTotalPages =
              Math.max(
                1,
                Math.ceil(
                  remainingCount /
                    prescriptionsPerPage
                )
              );

            return Math.min(
              page,
              newTotalPages
            );
          }
        );

        showNotification(
          "success",
          "Prescription Deleted",
          "The prescription was successfully removed from the system."
        );
      } catch (err) {
        console.error(
          "Error deleting prescription:",
          err
        );

        showNotification(
          "error",
          "Delete Failed",
          err.response?.data?.message ||
            "Failed to delete the prescription."
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================================
     RESET
  ===================================================== */

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeCount =
    prescriptions.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const completedCount =
    prescriptions.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="page-container">
        <div
          style={{
            minHeight: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Loader2
            size={34}
            className="loading-spinner"
          />

          <strong
            style={{
              color: "#334155",
              fontSize: "16px",
            }}
          >
            Loading prescriptions...
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Connecting to the hospital system
          </span>
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

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            width: "360px",
            maxWidth:
              "calc(100vw - 48px)",
            background: "#ffffff",
            borderRadius: "14px",
            padding: "16px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: "13px",
            boxShadow:
              "0 12px 35px rgba(15, 23, 42, 0.15)",
            border:
              "1px solid #e2e8f0",
            animation:
              "slideInNotification 0.25s ease",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              minWidth: "38px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                notification.type ===
                "success"
                  ? "#dcfce7"
                  : "#fee2e2",
              color:
                notification.type ===
                "success"
                  ? "#16a34a"
                  : "#dc2626",
            }}
          >
            {notification.type ===
            "success" ? (
              <CheckCircle
                size={21}
              />
            ) : (
              <AlertCircle
                size={21}
              />
            )}
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#0f172a",
                fontSize: "14px",
                marginBottom: "3px",
              }}
            >
              {notification.title}
            </strong>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {notification.message}
            </p>
          </div>

          <button
            onClick={() =>
              setNotification(null)
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "2px",
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
          <h1>Prescriptions</h1>

          <p>
            Manage patient medications and
            prescriptions
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          <Plus size={18} />
          New Prescription
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            marginBottom: "20px",
            borderRadius: "12px",
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            color: "#c2410c",
          }}
        >
          <AlertCircle size={20} />

          <div
            style={{
              flex: 1,
            }}
          >
            <strong>
              Unable to load data
            </strong>

            <div
              style={{
                fontSize: "13px",
                marginTop: "2px",
              }}
            >
              {error}
            </div>
          </div>

          <button
            className="secondary-btn"
            onClick={fetchData}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <Pill size={23} />
          </div>

          <div className="stat-content">
            <span>
              Total Prescriptions
            </span>

            <h2>
              {prescriptions.length}
            </h2>

            <small>
              All prescriptions
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={23} />
          </div>

          <div className="stat-content">
            <span>Active</span>

            <h2>
              {activeCount}
            </h2>

            <small>
              Currently active
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={23} />
          </div>

          <div className="stat-content">
            <span>Completed</span>

            <h2>
              {completedCount}
            </h2>

            <small>
              Completed prescriptions
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={23} />
          </div>

          <div className="stat-content">
            <span>Search Results</span>

            <h2>
              {filteredPrescriptions.length}
            </h2>

            <small>
              Matching prescriptions
            </small>
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
            placeholder="Search by patient, medicine, doctor..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(
                event.target.value
              );
              setCurrentPage(1);
            }}
          />

        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(
              event.target.value
            );
            setCurrentPage(1);
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

          <Pill size={20} />

          <div>
            <h3>
              Prescription List
            </h3>

            <span
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              {filteredPrescriptions.length}{" "}
              prescription
              {filteredPrescriptions.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </span>
          </div>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>
                  Prescription ID
                </th>

                <th>Patient</th>

                <th>Medicine</th>

                <th>Dosage</th>

                <th>Frequency</th>

                <th>Duration</th>

                <th>Status</th>

                <th>Date</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {currentPrescriptions.length >
              0 ? (
                currentPrescriptions.map(
                  (prescription) => (
                    <tr
                      key={
                        prescription.id
                      }
                    >

                      <td>
                        <strong>
                          {
                            prescription.uiId
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          prescription.patient
                        }
                      </td>

                      <td>
                        {
                          prescription.medicine
                        }
                      </td>

                      <td>
                        {
                          prescription.dosage
                        }
                      </td>

                      <td>
                        {
                          prescription.frequency
                        }
                      </td>

                      <td>
                        {
                          prescription.duration
                        }
                      </td>

                      <td>
                        <span
                          className={
                            prescription.status ===
                            "Active"
                              ? "status active"
                              : "status closed"
                          }
                        >
                          {
                            prescription.status
                          }
                        </span>
                      </td>

                      <td>
                        {
                          prescription.date
                        }
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="icon-btn view"
                            title="View Prescription"
                            onClick={() =>
                              setSelectedPrescription(
                                prescription
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            className="icon-btn edit"
                            title="Edit Prescription"
                            onClick={() =>
                              setEditingPrescription(
                                {
                                  ...prescription,
                                }
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-btn delete"
                            title="Delete Prescription"
                            onClick={() =>
                              handleDeletePrescription(
                                prescription.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

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
                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        gap: "8px",
                        padding:
                          "30px",
                      }}
                    >
                      <Pill
                        size={34}
                        style={{
                          color: "#94a3b8",
                        }}
                      />

                      <strong>
                        No prescriptions found
                      </strong>

                      <span
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "13px",
                        }}
                      >
                        Try changing your
                        search or filter.
                      </span>
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
            {filteredPrescriptions.length ===
            0
              ? 0
              : startIndex + 1}{" "}
            to{" "}
            {Math.min(
              startIndex +
                prescriptionsPerPage,
              filteredPrescriptions.length
            )}{" "}
            of{" "}
            {
              filteredPrescriptions.length
            }{" "}
            prescriptions
          </span>

          <div className="pagination-controls">

            <button
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  safeCurrentPage ===
                  page
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
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
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

      {selectedPrescription && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedPrescription(
              null
            )
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
                  Prescription Details
                </h2>

                <p>
                  {
                    selectedPrescription.uiId
                  }
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedPrescription(
                    null
                  )
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="record-details">

              <div>
                <span>
                  Patient
                </span>

                <strong>
                  {
                    selectedPrescription.patient
                  }
                </strong>
              </div>

              <div>
                <span>
                  Patient ID
                </span>

                <strong>
                  {
                    selectedPrescription.patientId
                  }
                </strong>
              </div>

              <div>
                <span>
                  Doctor
                </span>

                <strong>
                  {
                    selectedPrescription.doctor
                  }
                </strong>
              </div>

              <div>
                <span>
                  Medical Record
                </span>

                <strong>
                  MR-
                  {
                    selectedPrescription.medical_record_id
                  }
                </strong>
              </div>

              <div>
                <span>
                  Diagnosis
                </span>

                <strong>
                  {
                    selectedPrescription
                      .medicalRecord
                      ?.diagnosis ||
                    "Not specified"
                  }
                </strong>
              </div>

              <div>
                <span>
                  Medicine
                </span>

                <strong>
                  {
                    selectedPrescription.medicine
                  }
                </strong>
              </div>

              <div>
                <span>
                  Dosage
                </span>

                <strong>
                  {
                    selectedPrescription.dosage
                  }
                </strong>
              </div>

              <div>
                <span>
                  Frequency
                </span>

                <strong>
                  {
                    selectedPrescription.frequency
                  }
                </strong>
              </div>

              <div>
                <span>
                  Duration
                </span>

                <strong>
                  {
                    selectedPrescription.duration
                  }
                </strong>
              </div>

              <div>
                <span>
                  Quantity
                </span>

                <strong>
                  {
                    selectedPrescription.quantity ??
                    "Not specified"
                  }
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {
                    selectedPrescription.status
                  }
                </strong>
              </div>

              <div>
                <span>
                  Date
                </span>

                <strong>
                  {
                    selectedPrescription.date
                  }
                </strong>
              </div>

              <div className="full-detail">

                <span>
                  Instructions
                </span>

                <p>
                  {
                    selectedPrescription.instructions ||
                    "No instructions."
                  }
                </p>

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="secondary-btn"
                onClick={() => {
                  setEditingPrescription(
                    {
                      ...selectedPrescription,
                    }
                  );

                  setSelectedPrescription(
                    null
                  );
                }}
              >
                <Pencil size={16} />
                Edit Prescription
              </button>

              <button
                className="primary-btn"
                onClick={() =>
                  setSelectedPrescription(
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

      {/* =================================================
          ADD MODAL
      ================================================= */}

      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            !saving &&
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
                  New Prescription
                </h2>

                <p>
                  Create a new patient
                  prescription
                </p>
              </div>

              <button
                className="close-btn"
                disabled={saving}
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleCreatePrescription
              }
            >

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>
                    Medical Record *
                  </label>

                  <select
                    name="medical_record_id"
                    value={
                      newPrescription.medical_record_id
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    required
                  >

                    <option value="">
                      Select a medical record
                    </option>

                    {medicalRecords.map(
                      (record) => {
                        const patient =
                          record.patient;

                        const patientName =
                          patient
                            ? `${patient.first_name || ""} ${
                                patient.last_name || ""
                              }`.trim()
                            : "Unknown Patient";

                        return (
                          <option
                            key={
                              record.id
                            }
                            value={
                              record.id
                            }
                          >
                            MR-
                            {record.id} —{" "}
                            {patientName} —{" "}
                            {record.diagnosis ||
                              "No diagnosis"}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

                {selectedMedicalRecord && (
                  <div
                    className="form-group full-width"
                    style={{
                      padding:
                        "15px 17px",
                      borderRadius:
                        "12px",
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #e2e8f0",
                    }}
                  >

                    <strong
                      style={{
                        color:
                          "#0f172a",
                      }}
                    >
                      Selected Medical
                      Record
                    </strong>

                    <p
                      style={{
                        marginTop:
                          "7px",
                        marginBottom:
                          "4px",
                        color:
                          "#475569",
                        fontSize:
                          "13px",
                      }}
                    >
                      Patient:{" "}
                      {selectedMedicalRecord
                        .patient
                        ? `${selectedMedicalRecord.patient.first_name || ""} ${selectedMedicalRecord.patient.last_name || ""}`.trim()
                        : "Unknown"}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0",
                        color:
                          "#475569",
                        fontSize:
                          "13px",
                      }}
                    >
                      Doctor:{" "}
                      {selectedMedicalRecord
                        .doctor
                        ?.user?.name ||
                        selectedMedicalRecord
                          .doctor
                          ?.name ||
                        "Unknown"}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        color:
                          "#475569",
                        fontSize:
                          "13px",
                      }}
                    >
                      Diagnosis:{" "}
                      {selectedMedicalRecord
                        .diagnosis ||
                        "Not specified"}
                    </p>

                  </div>
                )}

                <div className="form-group">

                  <label>
                    Medicine *
                  </label>

                  <input
                    name="medicine_name"
                    value={
                      newPrescription.medicine_name
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    placeholder="Enter medicine"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Dosage *
                  </label>

                  <input
                    name="dosage"
                    value={
                      newPrescription.dosage
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    placeholder="e.g. 500 mg"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Frequency *
                  </label>

                  <select
                    name="frequency"
                    value={
                      newPrescription.frequency
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    required
                  >
                    <option>
                      Once daily
                    </option>

                    <option>
                      Twice daily
                    </option>

                    <option>
                      Three times daily
                    </option>

                    <option>
                      As needed
                    </option>
                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Duration *
                  </label>

                  <input
                    name="duration"
                    value={
                      newPrescription.duration
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    placeholder="e.g. 30 days"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={
                      newPrescription.quantity
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    placeholder="e.g. 30"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Prescribed Date *
                  </label>

                  <input
                    type="date"
                    name="prescribed_date"
                    value={
                      newPrescription.prescribed_date
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    required
                  />

                </div>

                <div className="form-group full-width">

                  <label>
                    Instructions
                  </label>

                  <textarea
                    name="instructions"
                    value={
                      newPrescription.instructions
                    }
                    onChange={
                      handleNewPrescriptionChange
                    }
                    placeholder="Enter medication instructions..."
                    rows="4"
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="secondary-btn"
                  disabled={saving}
                  onClick={() =>
                    setShowAddForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="loading-spinner"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Prescription
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingPrescription && (
        <div
          className="modal-overlay"
          onClick={() =>
            !saving &&
            setEditingPrescription(
              null
            )
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
                  Edit Prescription
                </h2>

                <p>
                  {
                    editingPrescription.uiId
                  }
                </p>
              </div>

              <button
                className="close-btn"
                disabled={saving}
                onClick={() =>
                  setEditingPrescription(
                    null
                  )
                }
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                handleUpdatePrescription
              }
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Medicine *
                  </label>

                  <input
                    name="medicine_name"
                    value={
                      editingPrescription.medicine_name ||
                      editingPrescription.medicine ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Dosage *
                  </label>

                  <input
                    name="dosage"
                    value={
                      editingPrescription.dosage ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Frequency *
                  </label>

                  <select
                    name="frequency"
                    value={
                      editingPrescription.frequency ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  >
                    <option>
                      Once daily
                    </option>

                    <option>
                      Twice daily
                    </option>

                    <option>
                      Three times daily
                    </option>

                    <option>
                      As needed
                    </option>
                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Duration *
                  </label>

                  <input
                    name="duration"
                    value={
                      editingPrescription.duration ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={
                      editingPrescription.quantity ??
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Prescribed Date *
                  </label>

                  <input
                    type="date"
                    name="prescribed_date"
                    value={
                      editingPrescription.prescribed_date ||
                      editingPrescription.date ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                  />

                </div>

                <div className="form-group full-width">

                  <label>
                    Instructions
                  </label>

                  <textarea
                    name="instructions"
                    value={
                      editingPrescription.instructions ||
                      ""
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="4"
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="secondary-btn"
                  disabled={saving}
                  onClick={() =>
                    setEditingPrescription(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="loading-spinner"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Pencil
                        size={17}
                      />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION
      ================================================= */}

      {deletePrescription && (
        <div
          className="modal-overlay"
          onClick={() =>
            !saving &&
            setDeletePrescription(
              null
            )
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
              Delete Prescription?
            </h2>

            <p>
              You are about to delete the
              prescription for{" "}
              <strong>
                {
                  deletePrescription.patient
                }
              </strong>
              .
            </p>

            <span className="delete-warning">
              This action cannot be undone.
            </span>

            <div className="delete-modal-actions">

              <button
                className="cancel-delete-btn"
                disabled={saving}
                onClick={() =>
                  setDeletePrescription(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                disabled={saving}
                onClick={
                  confirmDeletePrescription
                }
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="loading-spinner"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Prescription
                  </>
                )}
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

export default Prescriptions;

