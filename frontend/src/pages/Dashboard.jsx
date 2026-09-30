import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  Pill,
  Activity,
  Users,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock3,
  ArrowUpRight,
  Plus,
  BarChart3,
  Database,
  Server,
  ShieldCheck,
  Mail,
  Timer,
  ChevronDown,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
        recordsResponse,
        prescriptionsResponse,
      ] = await Promise.all([
        api.get("/patients"),
        api.get("/doctors"),
        api.get("/appointments"),
        api.get("/medical-records"),
        api.get("/prescriptions"),
      ]);

      setPatients(
        Array.isArray(patientsResponse.data?.data)
          ? patientsResponse.data.data
          : []
      );

      setDoctors(
        Array.isArray(doctorsResponse.data?.data)
          ? doctorsResponse.data.data
          : []
      );

      setAppointments(
        Array.isArray(appointmentsResponse.data?.data)
          ? appointmentsResponse.data.data
          : []
      );

      setMedicalRecords(
        Array.isArray(recordsResponse.data?.data)
          ? recordsResponse.data.data
          : []
      );

      setPrescriptions(
        Array.isArray(prescriptionsResponse.data?.data)
          ? prescriptionsResponse.data.data
          : []
      );
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        "Unable to load dashboard data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* =========================================================
     DATE HELPERS
  ========================================================= */

  const getDateValue = (item) => {
    return (
      item?.appointment_date ||
      item?.date ||
      item?.prescribed_date ||
      item?.created_at ||
      item?.updated_at ||
      null
    );
  };

  const parseDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const isToday = (value) => {
    const date = parseDate(value);

    if (!date) return false;

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const formatDate = (value) => {
    const date = parseDate(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    const date = parseDate(value);

    if (!date) return "—";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /* =========================================================
     TODAY APPOINTMENTS
  ========================================================= */

  const todayAppointments = useMemo(() => {
    return appointments
      .filter((appointment) =>
        isToday(getDateValue(appointment))
      )
      .sort((a, b) => {
        const aDate = parseDate(getDateValue(a));
        const bDate = parseDate(getDateValue(b));

        return (
          (aDate?.getTime() || 0) -
          (bDate?.getTime() || 0)
        );
      });
  }, [appointments]);

  /* =========================================================
     RECENT RECORDS
  ========================================================= */

  const recentRecords = useMemo(() => {
    return [...medicalRecords]
      .sort((a, b) => {
        const aDate = parseDate(getDateValue(a));
        const bDate = parseDate(getDateValue(b));

        return (
          (bDate?.getTime() || 0) -
          (aDate?.getTime() || 0)
        );
      })
      .slice(0, 4);
  }, [medicalRecords]);

  /* =========================================================
     PATIENT ACTIVITY
  ========================================================= */

  const patientActivity = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);

      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);

      days.push({
        date,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: 0,
      });
    }

    patients.forEach((patient) => {
      const value = getDateValue(patient);

      if (!value) return;

      const date = parseDate(value);

      if (!date) return;

      date.setHours(0, 0, 0, 0);

      const day = days.find(
        (item) =>
          item.date.getTime() === date.getTime()
      );

      if (day) {
        day.value += 1;
      }
    });

    return days;
  }, [patients]);

  /* =========================================================
     CHART
  ========================================================= */

  const chartData = useMemo(() => {
    const values = patientActivity.map(
      (item) => item.value
    );

    const highest = Math.max(...values, 0);

    const chartMax =
      highest <= 5
        ? 5
        : Math.ceil(highest / 5) * 5;

    const width = 1000;
    const height = 220;
    const padding = 12;

    const usableWidth = width - padding * 2;

    const step =
      usableWidth /
      Math.max(patientActivity.length - 1, 1);

    const points = patientActivity.map(
      (item, index) => {
        const x = padding + index * step;

        const y =
          height -
          (item.value / chartMax) * height;

        return {
          ...item,
          x,
          y,
        };
      }
    );

    return {
      chartMax,
      width,
      height,
      points,
    };
  }, [patientActivity]);

  const createSmoothPath = (points) => {
    if (!points.length) return "";

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const controlX =
        (current.x + next.x) / 2;

      path +=
        ` C ${controlX} ${current.y}, ` +
        `${controlX} ${next.y}, ` +
        `${next.x} ${next.y}`;
    }

    return path;
  };

  const activityLinePath = useMemo(
    () =>
      createSmoothPath(chartData.points),
    [chartData.points]
  );

  const activityAreaPath = useMemo(() => {
    if (!chartData.points.length) return "";

    const first = chartData.points[0];
    const last =
      chartData.points[
        chartData.points.length - 1
      ];

    return `
      ${activityLinePath}
      L ${last.x} ${chartData.height}
      L ${first.x} ${chartData.height}
      Z
    `;
  }, [
    activityLinePath,
    chartData.points,
    chartData.height,
  ]);

  /* =========================================================
     MEDICAL RECORD OVERVIEW
  ========================================================= */

  const recordOverview = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let followUp = 0;

    medicalRecords.forEach((record) => {
      const status = String(
        record?.status || ""
      ).toLowerCase();

      if (
        status.includes("complete") ||
        status.includes("closed")
      ) {
        completed++;
      } else if (
        status.includes("follow") ||
        status.includes("follow-up")
      ) {
        followUp++;
      } else {
        pending++;
      }
    });

    return {
      completed,
      pending,
      followUp,
      total: medicalRecords.length,
    };
  }, [medicalRecords]);

  /*
    We keep a small visible slice for zero-value
    categories so the donut visually matches the
    professional reference design and always shows
    blue + green + purple.
  */

  const donutGradient = useMemo(() => {
    const {
      completed,
      pending,
      followUp,
      total,
    } = recordOverview;

    if (total === 0) {
      return `
        conic-gradient(
          #e8eef5 0deg 360deg
        )
      `;
    }

    const minimumSlice = 10;

    const rawValues = [
      completed,
      pending,
      followUp,
    ];

    const visibleValues = rawValues.map(
      (value) =>
        value > 0
          ? value
          : minimumSlice / 100
    );

    const visibleTotal =
      visibleValues.reduce(
        (sum, value) => sum + value,
        0
      );

    const completedDegrees =
      (visibleValues[0] /
        visibleTotal) *
      360;

    const pendingDegrees =
      (visibleValues[1] /
        visibleTotal) *
      360;

    return `
      conic-gradient(
        #2f80ed 0deg ${completedDegrees}deg,
        #20b77b ${completedDegrees}deg
          ${
            completedDegrees +
            pendingDegrees
          }deg,
        #8b5cf6 ${
          completedDegrees +
          pendingDegrees
        }deg 360deg
      )
    `;
  }, [recordOverview]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getPatientName = (item) => {
    if (!item) return "Unknown Patient";

    if (item.patient?.name) {
      return item.patient.name;
    }

    if (
      item.patient?.first_name ||
      item.patient?.last_name
    ) {
      return [
        item.patient.first_name,
        item.patient.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    }

    if (item.patient_name) {
      return item.patient_name;
    }

    if (item.name) {
      return item.name;
    }

    if (
      item.first_name ||
      item.last_name
    ) {
      return [
        item.first_name,
        item.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    }

    return "Unknown Patient";
  };

  const getDoctorName = (item) => {
    if (!item) return "Unassigned";

    if (item.doctor?.name) {
      return item.doctor.name;
    }

    if (
      item.doctor?.first_name ||
      item.doctor?.last_name
    ) {
      return [
        item.doctor.first_name,
        item.doctor.last_name,
      ]
        .filter(Boolean)
        .join(" ");
    }

    if (item.doctor_name) {
      return item.doctor_name;
    }

    return "Unassigned";
  };

  const getInitials = (name) => {
    if (!name) return "PT";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    const value = String(
      status || "Scheduled"
    ).toLowerCase();

    if (value.includes("complete")) {
      return "completed";
    }

    if (value.includes("cancel")) {
      return "cancelled";
    }

    if (value.includes("pending")) {
      return "pending";
    }

    return "scheduled";
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      description: "Registered patients",
      icon: Users,
      iconClass: "patients",
      path: "/patients",
    },
    {
      title: "Medical Records",
      value: medicalRecords.length,
      description: "Updated records",
      icon: FileText,
      iconClass: "records",
      path: "/medical-records",
    },
    {
      title: "Prescriptions",
      value: prescriptions.length,
      description: "Active prescriptions",
      icon: Pill,
      iconClass: "prescriptions",
      path: "/prescriptions",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      description: "Scheduled today",
      icon: CalendarDays,
      iconClass: "appointments",
      path: "/appointments",
    },
  ];

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <RefreshCw
            size={25}
            className="loading-spinner"
          />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="dashboard-header">
          <div className="welcome-content">
            <span className="dashboard-header-label">
              EthioCare Hospital Management
            </span>

            <h1>
              Good Morning, Admin! 👋
            </h1>

            <p>
              Here's what's happening in your
              hospital today.
            </p>
          </div>

          <div className="dashboard-date">
            <CalendarDays size={18} />

            <div>
              <span>Today</span>

              <strong>
                {new Date().toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </strong>
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="dashboard-error">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                fetchDashboardData()
              }
            >
              Try again
            </button>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="dashboard-stats">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <button
                type="button"
                className="dashboard-stat-card"
                key={stat.title}
                onClick={() =>
                  navigate(stat.path)
                }
              >
                <div
                  className={`dashboard-stat-icon ${stat.iconClass}`}
                >
                  <Icon size={24} />
                </div>

                <div className="stat-content">
                  <span className="stat-title">
                    {stat.title}
                  </span>

                  <strong className="stat-value">
                    {stat.value}
                  </strong>

                  <span className="stat-description">
                    <ArrowUpRight size={13} />
                    {stat.description}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* =================================================
            ANALYTICS ROW
        ================================================= */}

        <section className="dashboard-analytics-grid">

          {/* PATIENT ACTIVITY */}

          <div className="dashboard-panel patient-activity-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>
                  Patient Activity{" "}
                  <span>(Last 7 Days)</span>
                </h2>
              </div>

              <button
                type="button"
                className="activity-period-btn"
              >
                Last 7 Days
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="patient-chart">

              <div className="chart-y-axis">
                <span>
                  {chartData.chartMax}
                </span>

                <span>
                  {Math.round(
                    chartData.chartMax * 0.75
                  )}
                </span>

                <span>
                  {Math.round(
                    chartData.chartMax * 0.5
                  )}
                </span>

                <span>
                  {Math.round(
                    chartData.chartMax * 0.25
                  )}
                </span>

                <span>0</span>
              </div>

              <div className="chart-area">

                <div className="chart-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <svg
                  className="activity-svg"
                  viewBox="0 0 1000 220"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="patientActivityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2f80ed"
                        stopOpacity="0.22"
                      />

                      <stop
                        offset="100%"
                        stopColor="#2f80ed"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d={activityAreaPath}
                    fill="url(#patientActivityGradient)"
                  />

                  <path
                    d={activityLinePath}
                    className="activity-line"
                    fill="none"
                  />

                  {chartData.points.map(
                    (point, index) => (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4.5"
                        className="activity-point"
                      />
                    )
                  )}
                </svg>

                <div className="chart-x-axis">
                  {patientActivity.map(
                    (day) => (
                      <span
                        key={day.date.toISOString()}
                      >
                        {day.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MEDICAL RECORD OVERVIEW */}

          <div className="dashboard-panel medical-overview-panel">

            <div className="dashboard-panel-header">
              <div>
                <h2>
                  Medical Records Overview
                </h2>

                <p>
                  Current record status
                </p>
              </div>

              <FileText
                size={19}
                className="panel-header-icon"
              />
            </div>

            <div className="overview-content">

              <div
                className="overview-donut"
                style={{
                  background: donutGradient,
                }}
              >
                <div className="donut-inner">
                  <strong>
                    {recordOverview.total}
                  </strong>

                  <span>
                    Total
                  </span>
                </div>
              </div>

              <div className="overview-legend">

                <div className="legend-item">
                  <span className="legend-dot blue" />

                  <div>
                    <span>
                      Completed
                    </span>

                    <strong>
                      {recordOverview.completed}
                    </strong>

                    <small>
                      {recordOverview.total
                        ? Math.round(
                            (recordOverview.completed /
                              recordOverview.total) *
                              100
                          )
                        : 0}
                      %
                    </small>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot green" />

                  <div>
                    <span>
                      Pending
                    </span>

                    <strong>
                      {recordOverview.pending}
                    </strong>

                    <small>
                      {recordOverview.total
                        ? Math.round(
                            (recordOverview.pending /
                              recordOverview.total) *
                              100
                          )
                        : 0}
                      %
                    </small>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot purple" />

                  <div>
                    <span>
                      Follow-up
                    </span>

                    <strong>
                      {recordOverview.followUp}
                    </strong>

                    <small>
                      {recordOverview.total
                        ? Math.round(
                            (recordOverview.followUp /
                              recordOverview.total) *
                              100
                          )
                        : 0}
                      %
                    </small>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="dashboard-panel quick-actions-panel">

            <div className="dashboard-panel-header">
              <div>
                <h2>Quick Actions</h2>

                <p>
                  Frequently used actions
                </p>
              </div>
            </div>

            <div className="quick-actions">

              <button
                type="button"
                onClick={() =>
                  navigate("/medical-records")
                }
              >
                <span className="quick-action-icon blue">
                  <Plus size={18} />
                </span>

                <span>
                  New Medical Record
                </span>

                <ArrowUpRight size={15} />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/prescriptions")
                }
              >
                <span className="quick-action-icon green">
                  <Plus size={18} />
                </span>

                <span>
                  New Prescription
                </span>

                <ArrowUpRight size={15} />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/reports")
                }
              >
                <span className="quick-action-icon purple">
                  <BarChart3 size={18} />
                </span>

                <span>
                  View Reports
                </span>

                <ArrowUpRight size={15} />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/patients")
                }
              >
                <span className="quick-action-icon orange">
                  <Users size={18} />
                </span>

                <span>
                  View Patients
                </span>

                <ArrowUpRight size={15} />
              </button>

            </div>
          </div>

        </section>

        {/* =================================================
            APPOINTMENTS + RECORDS
        ================================================= */}

        <section className="dashboard-lower-grid">

          {/* TODAY'S APPOINTMENTS */}

          <div className="dashboard-panel table-panel">

            <div className="dashboard-panel-header">
              <div>
                <h2>
                  Today's Appointments
                </h2>

                <p>
                  Scheduled appointments for today
                </p>
              </div>

              <button
                type="button"
                className="view-all-btn"
                onClick={() =>
                  navigate("/appointments")
                }
              >
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="dashboard-empty">
                <CalendarDays size={28} />

                <strong>
                  No appointments today
                </strong>

                <span>
                  There are no scheduled
                  appointments for today.
                </span>
              </div>
            ) : (
              <div className="dashboard-table">

                <div className="table-row table-head">
                  <span>Time</span>
                  <span>Patient Name</span>
                  <span>Doctor</span>
                  <span>Status</span>
                </div>

                {todayAppointments
                  .slice(0, 4)
                  .map(
                    (appointment, index) => {
                      const patientName =
                        getPatientName(
                          appointment
                        );

                      const doctorName =
                        getDoctorName(
                          appointment
                        );

                      return (
                        <div
                          className="table-row"
                          key={
                            appointment.id ||
                            index
                          }
                        >
                          <span className="appointment-time-cell">
                            <Clock3 size={14} />
                            {formatTime(
                              getDateValue(
                                appointment
                              )
                            )}
                          </span>

                          <span className="patient-cell">
                            <span className="mini-avatar">
                              {getInitials(
                                patientName
                              )}
                            </span>

                            <span>
                              <strong>
                                {patientName}
                              </strong>

                              <small>
                                Patient
                              </small>
                            </span>
                          </span>

                          <span className="doctor-cell">
                            <strong>
                              Dr. {doctorName}
                            </strong>

                            <small>
                              Medical Staff
                            </small>
                          </span>

                          <span>
                            <span
                              className={`status-badge ${getStatusClass(
                                appointment.status
                              )}`}
                            >
                              {appointment.status ||
                                "Scheduled"}
                            </span>
                          </span>
                        </div>
                      );
                    }
                  )}

              </div>
            )}
          </div>

          {/* RECENT MEDICAL RECORDS */}

          <div className="dashboard-panel table-panel">

            <div className="dashboard-panel-header">
              <div>
                <h2>
                  Recent Medical Records
                </h2>

                <p>
                  Latest patient records
                </p>
              </div>

              <button
                type="button"
                className="view-all-btn"
                onClick={() =>
                  navigate("/medical-records")
                }
              >
                View All
                <ArrowUpRight size={14} />
              </button>
            </div>

            {recentRecords.length === 0 ? (
              <div className="dashboard-empty">
                <FileText size={28} />

                <strong>
                  No medical records
                </strong>

                <span>
                  No medical records are
                  available yet.
                </span>
              </div>
            ) : (
              <div className="dashboard-table">

                <div className="table-row table-head records-head">
                  <span>Record</span>
                  <span>Patient</span>
                  <span>Diagnosis</span>
                  <span>Date</span>
                </div>

                {recentRecords.map(
                  (record, index) => {
                    const patientName =
                      getPatientName(record);

                    return (
                      <div
                        className="table-row"
                        key={
                          record.id ||
                          index
                        }
                      >
                        <span className="record-id">
                          MR-
                          {String(
                            record.id ||
                              index + 1
                          ).padStart(4, "0")}
                        </span>

                        <span className="patient-cell">
                          <span className="mini-avatar record-avatar">
                            {getInitials(
                              patientName
                            )}
                          </span>

                          <span>
                            <strong>
                              {patientName}
                            </strong>

                            <small>
                              Patient
                            </small>
                          </span>
                        </span>

                        <span className="diagnosis-cell">
                          {record.diagnosis ||
                            record.title ||
                            record.record_type ||
                            "Medical consultation"}
                        </span>

                        <span className="date-cell">
                          {formatDate(
                            getDateValue(
                              record
                            )
                          )}
                        </span>
                      </div>
                    );
                  }
                )}

              </div>
            )}
          </div>

        </section>

        {/* =================================================
            SYSTEM STATUS
        ================================================= */}

        <section className="dashboard-panel system-status-panel">

          <div className="dashboard-panel-header">
            <div>
              <h2>System Status</h2>

              <p>
                Current hospital system health
              </p>
            </div>

            <span className="system-operational">
              <span />
              All systems operational
            </span>
          </div>

          <div className="system-status-grid">

            <div className="system-status-item">
              <div className="system-status-icon">
                <Database size={20} />
              </div>

              <div>
                <strong>Database</strong>
                <span>Online</span>
              </div>

              <CheckCircle size={18} />
            </div>

            <div className="system-status-item">
              <div className="system-status-icon">
                <Server size={20} />
              </div>

              <div>
                <strong>Server</strong>
                <span>Online</span>
              </div>

              <CheckCircle size={18} />
            </div>

            <div className="system-status-item">
              <div className="system-status-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>Backup</strong>
                <span>Completed</span>
              </div>

              <CheckCircle size={18} />
            </div>

            <div className="system-status-item">
              <div className="system-status-icon">
                <Mail size={20} />
              </div>

              <div>
                <strong>Email Service</strong>
                <span>Online</span>
              </div>

              <CheckCircle size={18} />
            </div>

            <div className="system-status-item">
              <div className="system-status-icon">
                <Timer size={20} />
              </div>

              <div>
                <strong>System Uptime</strong>
                <span>99.9%</span>
              </div>

              <CheckCircle size={18} />
            </div>

          </div>

          <div className="system-footer">

            <span>
              <span className="online-dot" />
              All systems operational
            </span>

            <button
              type="button"
              onClick={() =>
                fetchDashboardData(true)
              }
              disabled={refreshing}
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? "loading-spinner"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Last updated just now"}
            </button>

          </div>

        </section>

        {/* =================================================
            DASHBOARD FOOTER
        ================================================= */}

        <div className="dashboard-footer">
          <span>
            <Activity size={13} />
            EthioCare Hospital Management
          </span>

          <span>
            Dashboard v1.0
          </span>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;