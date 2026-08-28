const appointmentMode = localStorage.getItem("appointmentMode");

const appointmentSearch = document.querySelector(".appointment-search-input");
const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
const doctorFilter = document.querySelector(".doctor-filter");
const appointmentDate = document.querySelector("#appointment-date");

const retrieveAppointmentId = document.querySelector(
    '[data-field="appointment-id"]',
);
const retrieveDoctorId = document.querySelector('[data-field="doctor-id"]');
const retrievePatientId = document.querySelector('[data-field="patient-id"]');
const retrieveStatus = document.querySelector('[data-field="status"]');
const retrieveDate = document.querySelector('[data-field="date"]');
const retrieveDepartment = document.querySelector('[data-field="department"]');
const retrieveReason = document.querySelector('[data-field="reason"]');
const retrieveNotes = document.querySelector('[data-field="notes"]');
const retrieveTime = document.querySelector('[data-field="time"]');
const retrieveType = document.querySelector('[data-field="type"]');

const editAppointmentButton = document.querySelector(".edit-appointment-btn");
const appointmentForm = document.querySelector("#appointment-form");

const hamburger = document.querySelector(".hamburger");
const navbarMenu = document.querySelector(".navbar-menu");
const navbarToggle = document.querySelector(".navbar-toggle");
const sidebar = document.querySelector(".sidebar");
const addBtn = document.querySelector(".add-btn");

const appointmentTableBody = document.querySelector("tbody");

function getAppointments() {
    return JSON.parse(localStorage.getItem("appointments")) || [];
}

function saveAppointments(appointments) {
    localStorage.setItem("appointments", JSON.stringify(appointments));
}
function getActivities() {
    return JSON.parse(localStorage.getItem("activities")) || [];
}

function saveActivities(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
}

function addActivity(type, title, description) {
    const activities = getActivities();

    const newActivity = {
        type: type,
        title: title,
        description: description,
        time: Date.now(),
    };

    activities.unshift(newActivity);

    // Keep only the latest 10 activities
    if (activities.length > 10) {
        activities.pop();
    }

    saveActivities(activities);
}

function formatActivityTime(timestamp) {
    const activityTime = new Date(timestamp);
    const currentTime = new Date();

    const difference = currentTime - activityTime;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return activityTime.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getActivityIcon(type) {
    if (type === "patient") {
        return "fa-user-plus";
    }

    if (type === "appointment") {
        return "fa-calendar-check";
    }

    if (type === "doctor") {
        return "fa-user-doctor";
    }

    if (type === "delete") {
        return "fa-trash";
    }

    return "fa-circle-info";
}

function renderActivities() {
    const activityList = document.querySelector("#activity-list");

    if (!activityList) {
        return;
    }

    const activities = getActivities();

    activityList.innerHTML = "";

    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fa-solid fa-clock"></i>
                </div>

                <div>
                    <strong>No recent activity</strong>

                    <span>
                        Recent hospital activities will appear here.
                    </span>
                </div>
            </div>
        `;

        return;
    }

    activities.forEach(function (activity) {
        const activityItem = document.createElement("div");

        activityItem.className = "activity-item";

        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fa-solid ${getActivityIcon(activity.type)}"></i>
            </div>

            <div>
                <strong>${activity.title}</strong>

                <span>
                    ${activity.description}
                </span>

                <small>
                    ${formatActivityTime(activity.time)}
                </small>
            </div>
        `;

        activityList.appendChild(activityItem);
    });
}
function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const dateObject = new Date(dateValue);

    if (isNaN(dateObject)) {
        return dateValue;
    }

    return dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(timeValue) {
    if (!timeValue) {
        return "";
    }

    const timeObject = new Date(`January 1, 2026 ${timeValue}`);

    if (isNaN(timeObject)) {
        return timeValue;
    }

    return timeObject.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function convertDisplayedDateToISO(dateText) {
    if (!dateText) {
        return "";
    }

    const value = dateText.trim();

    if (!value) {
        return "";
    }

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    // DD/MM/YYYY or DD-MM-YYYY
    const numericParts = value.split(/[\/-]/);

    if (
        numericParts.length === 3 &&
        /^\d{1,2}$/.test(numericParts[0]) &&
        /^\d{1,2}$/.test(numericParts[1]) &&
        /^\d{4}$/.test(numericParts[2])
    ) {
        const day = numericParts[0].padStart(2, "0");
        const month = numericParts[1].padStart(2, "0");
        const year = numericParts[2];

        return `${year}-${month}-${day}`;
    }

    // DD Mon YYYY
    const parts = value.split(/\s+/);

    if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1].toLowerCase();
        const year = parts[2];

        const months = {
            jan: "01",
            january: "01",
            feb: "02",
            february: "02",
            mar: "03",
            march: "03",
            apr: "04",
            april: "04",
            may: "05",
            jun: "06",
            june: "06",
            jul: "07",
            july: "07",
            aug: "08",
            august: "08",
            sep: "09",
            sept: "09",
            september: "09",
            oct: "10",
            october: "10",
            nov: "11",
            november: "11",
            dec: "12",
            december: "12",
        };

        if (/^\d{1,2}$/.test(day) && /^\d{4}$/.test(year) && months[month]) {
            return `${year}-${months[month]}-${day.padStart(2, "0")}`;
        }
    }

    return "";
}

function importHtmlAppointments() {
    if (!appointmentTableBody) {
        return;
    }

    const htmlRows = appointmentTableBody.querySelectorAll("tr");

    if (htmlRows.length === 0) {
        return;
    }

    const storedAppointments = getAppointments();

    const htmlAppointments = [];

    htmlRows.forEach(function (row) {
        const cells = row.querySelectorAll("td");

        if (cells.length < 10) {
            return;
        }

        const id = Number(cells[0].textContent.trim());

        if (!Number.isFinite(id)) {
            return;
        }

        htmlAppointments.push({
            id: id,
            patientId: cells[1].textContent.trim(),
            doctorId: cells[2].textContent.trim(),
            department: cells[3].textContent.trim(),
            date: convertDisplayedDateToISO(cells[4].textContent.trim()),
            time: cells[5].textContent.trim(),
            reason: cells[6].textContent.trim(),
            status: cells[7].textContent.trim(),
            notes: cells[8].textContent.trim(),
            type: cells[9].textContent.trim(),
        });
    });

    if (htmlAppointments.length === 0) {
        return;
    }

    const storedMap = new Map();

    storedAppointments.forEach(function (appointment) {
        const id = Number(appointment.id);

        if (Number.isFinite(id)) {
            storedMap.set(id, appointment);
        }
    });

    htmlAppointments.forEach(function (appointment) {
        storedMap.set(appointment.id, appointment);
    });

    const mergedAppointments = Array.from(storedMap.values()).sort(
        function (a, b) {
            return Number(a.id) - Number(b.id);
        },
    );

    saveAppointments(mergedAppointments);
}

function createAppointmentRow(appointment) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${appointment.id}</td>
        <td>${appointment.patientId || ""}</td>
        <td>${appointment.doctorId || ""}</td>
        <td>${appointment.department || ""}</td>
        <td>${formatDate(appointment.date)}</td>
        <td>${formatTime(appointment.time)}</td>
        <td>${appointment.reason || ""}</td>
        <td>${appointment.status || ""}</td>
        <td>${appointment.notes || ""}</td>
        <td>${appointment.type || ""}</td>
        <td class="actions">
            <button type="button" class="view-btn" data-id="${appointment.id}">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button type="button" class="edit-btn" data-id="${appointment.id}">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="delete-btn" data-id="${appointment.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    return row;
}

function renderAppointments() {
    if (!appointmentTableBody) {
        return;
    }

    const appointments = getAppointments();

    appointmentTableBody.innerHTML = "";

    appointments.forEach(function (appointment) {
        appointmentTableBody.appendChild(createAppointmentRow(appointment));
    });

    filterAppointments();
}

function filterAppointments() {
    if (!appointmentTableBody) {
        return;
    }

    const searchValue = appointmentSearch
        ? appointmentSearch.value.toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value.toLowerCase()
        : "all status";

    const selectedDepartment = departmentFilter
        ? departmentFilter.value.toLowerCase()
        : "all departments";

    const selectedDoctor = doctorFilter
        ? doctorFilter.value.toLowerCase()
        : "all doctors";

    const selectedDate = appointmentDate ? appointmentDate.value : "";

    const rows = appointmentTableBody.querySelectorAll("tr");

    rows.forEach(function (row) {
        const cells = row.querySelectorAll("td");

        if (cells.length < 10) {
            return;
        }

        const rowText = row.textContent.toLowerCase();

        const doctorText = cells[2].textContent.trim().toLowerCase();
        const departmentText = cells[3].textContent.trim().toLowerCase();
        const dateText = cells[4].textContent.trim();
        const statusText = cells[7].textContent.trim().toLowerCase();

        const rowDate = convertDisplayedDateToISO(dateText);

        const matchesSearch = rowText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all status" || statusText === selectedStatus;

        const matchesDepartment =
            selectedDepartment === "all departments" ||
            departmentText === selectedDepartment;

        const matchesDoctor =
            selectedDoctor === "all doctors" || doctorText === selectedDoctor;

        const matchesDate = selectedDate === "" || rowDate === selectedDate;

        if (
            matchesSearch &&
            matchesStatus &&
            matchesDepartment &&
            matchesDoctor &&
            matchesDate
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function getHighestAppointmentId() {
    const appointments = getAppointments();

    let highestId = 0;

    appointments.forEach(function (appointment) {
        const id = Number(appointment.id);

        if (Number.isFinite(id) && id > highestId) {
            highestId = id;
        }
    });

    return highestId;
}

function getAppointmentById(id) {
    const appointments = getAppointments();

    return appointments.find(function (appointment) {
        return String(appointment.id) === String(id);
    });
}

function storeAppointmentDetails(appointment) {
    localStorage.setItem("appointmentId", appointment.id);
    localStorage.setItem("patientId", appointment.patientId || "");
    localStorage.setItem("doctorId", appointment.doctorId || "");
    localStorage.setItem("department", appointment.department || "");
    localStorage.setItem("date", appointment.date || "");
    localStorage.setItem("time", appointment.time || "");
    localStorage.setItem("reason", appointment.reason || "");
    localStorage.setItem("status", appointment.status || "");
    localStorage.setItem("notes", appointment.notes || "");
    localStorage.setItem("type", appointment.type || "");
}

function clearAppointmentDetails() {
    localStorage.removeItem("appointmentId");
    localStorage.removeItem("patientId");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("department");
    localStorage.removeItem("date");
    localStorage.removeItem("time");
    localStorage.removeItem("reason");
    localStorage.removeItem("status");
    localStorage.removeItem("notes");
    localStorage.removeItem("type");
}

function loadAppointmentDetails() {
    const appointmentId = localStorage.getItem("appointmentId");

    if (!appointmentId) {
        return;
    }

    const appointment = getAppointmentById(appointmentId);

    if (!appointment) {
        return;
    }

    if (retrieveAppointmentId) {
        retrieveAppointmentId.textContent = appointment.id;
    }

    if (retrievePatientId) {
        retrievePatientId.textContent = appointment.patientId || "";
    }

    if (retrieveDoctorId) {
        retrieveDoctorId.textContent = appointment.doctorId || "";
    }

    if (retrieveDepartment) {
        retrieveDepartment.textContent = appointment.department || "";
    }

    if (retrieveDate) {
        retrieveDate.textContent = formatDate(appointment.date);
    }

    if (retrieveTime) {
        retrieveTime.textContent = formatTime(appointment.time);
    }

    if (retrieveReason) {
        retrieveReason.textContent = appointment.reason || "";
    }

    if (retrieveStatus) {
        retrieveStatus.textContent = appointment.status || "";
    }

    if (retrieveNotes) {
        retrieveNotes.textContent = appointment.notes || "";
    }

    if (retrieveType) {
        retrieveType.textContent = appointment.type || "";
    }
}

function loadAppointmentIntoForm() {
    if (!appointmentForm) {
        return;
    }

    const appointmentId = localStorage.getItem("appointmentId");

    if (!appointmentId) {
        return;
    }

    const appointment = getAppointmentById(appointmentId);

    if (!appointment) {
        return;
    }

    const patientSelect = document.querySelector("#patient-id");
    const doctorSelect = document.querySelector("#doctor-id");
    const departmentSelect = document.querySelector("#department");
    const dateInput = document.querySelector("#appointment-date");
    const timeInput = document.querySelector("#appointment-time");
    const typeSelect = document.querySelector("#appointment-type");
    const statusSelect = document.querySelector("#status");
    const reasonInput = document.querySelector("#reason");
    const notesInput = document.querySelector("#notes");

    if (patientSelect) {
        patientSelect.value = appointment.patientId || "";
    }

    if (doctorSelect) {
        doctorSelect.value = appointment.doctorId || "";
    }

    if (departmentSelect) {
        const departmentOption = Array.from(departmentSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    String(appointment.department || "").toLowerCase()
                );
            },
        );

        if (departmentOption) {
            departmentSelect.value = departmentOption.value;
        }
    }

    if (dateInput) {
        dateInput.value = appointment.date || "";
    }

    if (timeInput) {
        if (appointment.time) {
            const timeObject = new Date(`January 1, 2026 ${appointment.time}`);

            if (!isNaN(timeObject)) {
                const hours = String(timeObject.getHours()).padStart(2, "0");
                const minutes = String(timeObject.getMinutes()).padStart(
                    2,
                    "0",
                );

                timeInput.value = `${hours}:${minutes}`;
            } else {
                timeInput.value = appointment.time;
            }
        }
    }

    if (typeSelect) {
        const typeOption = Array.from(typeSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    String(appointment.type || "").toLowerCase()
                );
            },
        );

        if (typeOption) {
            typeSelect.value = typeOption.value;
        }
    }

    if (statusSelect) {
        const statusOption = Array.from(statusSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    String(appointment.status || "").toLowerCase()
                );
            },
        );

        if (statusOption) {
            statusSelect.value = statusOption.value;
        }
    }

    if (reasonInput) {
        reasonInput.value = appointment.reason || "";
    }

    if (notesInput) {
        notesInput.value = appointment.notes || "";
    }
}

function clearNewAppointmentForm() {
    if (!appointmentForm) {
        return;
    }

    appointmentForm.reset();

    const patientSelect = document.querySelector("#patient-id");
    const doctorSelect = document.querySelector("#doctor-id");
    const departmentSelect = document.querySelector("#department");
    const dateInput = document.querySelector("#appointment-date");
    const timeInput = document.querySelector("#appointment-time");
    const typeSelect = document.querySelector("#appointment-type");
    const statusSelect = document.querySelector("#status");
    const reasonInput = document.querySelector("#reason");
    const notesInput = document.querySelector("#notes");

    if (patientSelect) {
        patientSelect.value = "";
    }

    if (doctorSelect) {
        doctorSelect.value = "";
    }

    if (departmentSelect) {
        departmentSelect.value = "";
    }

    if (dateInput) {
        dateInput.value = "";
    }

    if (timeInput) {
        timeInput.value = "";
    }

    if (typeSelect) {
        typeSelect.value = "";
    }

    if (statusSelect) {
        statusSelect.value = "";
    }

    if (reasonInput) {
        reasonInput.value = "";
    }

    if (notesInput) {
        notesInput.value = "";
    }
}

if (appointmentTableBody) {
    importHtmlAppointments();
    renderAppointments();

    appointmentTableBody.addEventListener("click", function (event) {
        const viewButton = event.target.closest(".view-btn");
        const editButton = event.target.closest(".edit-btn");
        const deleteButton = event.target.closest(".delete-btn");

        if (viewButton) {
            const appointmentId = viewButton.dataset.id;
            const appointment = getAppointmentById(appointmentId);

            if (!appointment) {
                return;
            }

            storeAppointmentDetails(appointment);
            localStorage.setItem("appointmentMode", "view");

            window.location.href = "appointment-details.html";
            return;
        }

        if (editButton) {
            const appointmentId = editButton.dataset.id;
            const appointment = getAppointmentById(appointmentId);

            if (!appointment) {
                return;
            }

            storeAppointmentDetails(appointment);
            localStorage.setItem("appointmentMode", "edit");

            window.location.href = "edit-appointment.html";
            return;
        }

        if (deleteButton) {
            const appointmentId = deleteButton.dataset.id;

            const confirmDelete = confirm(
                "Are you sure you want to delete it?",
            );

            if (!confirmDelete) {
                return;
            }

            const appointments = getAppointments();

            const updatedAppointments = appointments.filter(
                function (appointment) {
                    return String(appointment.id) !== String(appointmentId);
                },
            );

            saveAppointments(updatedAppointments);

            if (
                String(localStorage.getItem("appointmentId")) ===
                String(appointmentId)
            ) {
                clearAppointmentDetails();
            }

            renderAppointments();
        }
    });
}

if (appointmentSearch) {
    appointmentSearch.addEventListener("input", filterAppointments);
}

if (statusFilter) {
    statusFilter.addEventListener("change", filterAppointments);
}

if (departmentFilter) {
    departmentFilter.addEventListener("change", filterAppointments);
}

if (doctorFilter) {
    doctorFilter.addEventListener("change", filterAppointments);
}

if (appointmentDate) {
    appointmentDate.addEventListener("change", filterAppointments);
}

if (editAppointmentButton) {
    editAppointmentButton.addEventListener("click", function () {
        const appointmentId = localStorage.getItem("appointmentId");

        if (!appointmentId) {
            return;
        }

        const appointment = getAppointmentById(appointmentId);

        if (!appointment) {
            return;
        }

        storeAppointmentDetails(appointment);

        localStorage.setItem("appointmentMode", "edit");

        window.location.href = "edit-appointment.html";
    });
}

if (appointmentForm) {
    if (appointmentMode === "new") {
        clearNewAppointmentForm();
    } else if (appointmentMode === "edit") {
        loadAppointmentIntoForm();
    }

    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const patientSelect = document.querySelector("#patient-id");
        const doctorSelect = document.querySelector("#doctor-id");
        const departmentSelect = document.querySelector("#department");
        const dateInput = document.querySelector("#appointment-date");
        const timeInput = document.querySelector("#appointment-time");
        const typeSelect = document.querySelector("#appointment-type");
        const statusSelect = document.querySelector("#status");
        const reasonInput = document.querySelector("#reason");
        const notesInput = document.querySelector("#notes");

        const updatedPatientId = patientSelect ? patientSelect.value : "";

        const updatedDoctorId = doctorSelect ? doctorSelect.value : "";

        const updatedDepartment = departmentSelect
            ? departmentSelect.options[
                  departmentSelect.selectedIndex
              ]?.textContent.trim() || ""
            : "";

        const updatedDate = dateInput ? dateInput.value : "";

        const updatedTime = timeInput ? timeInput.value : "";

        const updatedReason = reasonInput ? reasonInput.value.trim() : "";

        const updatedStatus = statusSelect
            ? statusSelect.options[
                  statusSelect.selectedIndex
              ]?.textContent.trim() || ""
            : "";

        const updatedNotes = notesInput ? notesInput.value.trim() : "";

        const updatedType = typeSelect
            ? typeSelect.options[
                  typeSelect.selectedIndex
              ]?.textContent.trim() || ""
            : "";

        let appointments = getAppointments();

        if (appointmentMode === "new") {
            const highestId = getHighestAppointmentId();
            const newAppointmentId = highestId + 1;

            const newAppointment = {
                id: newAppointmentId,
                patientId: updatedPatientId,
                doctorId: updatedDoctorId,
                department: updatedDepartment,
                date: updatedDate,
                time: updatedTime,
                reason: updatedReason,
                status: updatedStatus,
                notes: updatedNotes,
                type: updatedType,
            };

            appointments.push(newAppointment);

            saveAppointments(appointments);
            addActivity(
                "appointment",
                "New appointment created",
                `Appointment #${newAppointmentId} was added to the system.`,
            );
            console.log("Highest ID:", highestId);
            console.log("Creating new appointment:", newAppointmentId);
        }

        if (appointmentMode === "edit") {
            const appointmentId = localStorage.getItem("appointmentId");

            const appointmentIndex = appointments.findIndex(
                function (appointment) {
                    return String(appointment.id) === String(appointmentId);
                },
            );

            if (appointmentIndex !== -1) {
                const oldStatus = appointments[appointmentIndex].status;
                appointments[appointmentIndex] = {
                    id: appointments[appointmentIndex].id,
                    patientId: updatedPatientId,
                    doctorId: updatedDoctorId,
                    department: updatedDepartment,
                    date: updatedDate,
                    time: updatedTime,
                    reason: updatedReason,
                    status: updatedStatus,
                    notes: updatedNotes,
                    type: updatedType,
                };

                saveAppointments(appointments);
                if (
                    oldStatus !== updatedStatus &&
                    updatedStatus.toLowerCase() === "approved"
                ) {
                    addActivity(
                        "appointment",
                        "Appointment approved",
                        `Appointment #${appointments[appointmentIndex].id} was approved.`,
                    );
                }
                storeAppointmentDetails(appointments[appointmentIndex]);
            }
        }

        localStorage.removeItem("updatedPatientId");
        localStorage.removeItem("updatedDoctorId");
        localStorage.removeItem("updatedDepartment");
        localStorage.removeItem("updatedDate");
        localStorage.removeItem("updatedTime");
        localStorage.removeItem("updatedStatus");
        localStorage.removeItem("updatedNotes");
        localStorage.removeItem("updatedType");
        localStorage.removeItem("updatedReason");

        localStorage.setItem("appointmentMode", "view");

        window.location.href = "appointments.html";
    });
}

if (addBtn) {
    addBtn.addEventListener("click", function () {
        localStorage.setItem("appointmentMode", "new");

        clearAppointmentDetails();

        localStorage.removeItem("updatedPatientId");
        localStorage.removeItem("updatedDoctorId");
        localStorage.removeItem("updatedDepartment");
        localStorage.removeItem("updatedDate");
        localStorage.removeItem("updatedTime");
        localStorage.removeItem("updatedStatus");
        localStorage.removeItem("updatedNotes");
        localStorage.removeItem("updatedType");
        localStorage.removeItem("updatedReason");

        window.location.href = "edit-appointment.html";
    });
}

if (retrieveAppointmentId) {
    loadAppointmentDetails();
}

if (hamburger && sidebar) {
    hamburger.addEventListener("click", function () {
        sidebar.classList.toggle("unhide");
    });
}

if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener("click", function () {
        navbarMenu.classList.toggle("unhide");
    });
}
/* ========================================
   INDEX.HTML / DASHBOARD
======================================== */

const dashboard = document.querySelector(".dashboard");

const overviewCards = document.querySelectorAll(".overview-card");

const totalPatientsElement =
    overviewCards[0]?.querySelector(".overview-info h2");

const totalDoctorsElement =
    overviewCards[1]?.querySelector(".overview-info h2");

const totalAppointmentsElement =
    overviewCards[2]?.querySelector(".overview-info h2");

const totalDepartmentsElement =
    overviewCards[3]?.querySelector(".overview-info h2");

const appointmentPreview = document.querySelector(".appointment-preview");

const dashboardSearchInput = document.querySelector(".search-container input");

const hamburgerForIndexHtml = document.querySelector(".hamburgerForIndexHtml");

const navbarMenuForIndexHtml = document.querySelector(".navbar-menu");

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getUniqueValues(appointments, property) {
    const values = appointments
        .map(function (appointment) {
            return appointment[property];
        })
        .filter(function (value) {
            return value !== undefined && value !== null && value !== "";
        });

    return [...new Set(values)];
}

function getTimeInMinutes(timeValue) {
    if (!timeValue) {
        return 0;
    }

    const timeObject = new Date(`January 1, 2026 ${timeValue}`);

    if (isNaN(timeObject.getTime())) {
        return 0;
    }

    return timeObject.getHours() * 60 + timeObject.getMinutes();
}

function updateOverviewCards() {
    const appointments = getAppointments();

    /* Total Patients */

    if (totalPatientsElement) {
        const patients = getUniqueValues(appointments, "patientId");

        totalPatientsElement.textContent = patients.length;
    }

    /* Total Doctors */

    if (totalDoctorsElement) {
        const doctors = getUniqueValues(appointments, "doctorId");

        totalDoctorsElement.textContent = doctors.length;
    }

    /* Total Appointments */

    if (totalAppointmentsElement) {
        totalAppointmentsElement.textContent = appointments.length;
    }

    /* Total Departments */

    if (totalDepartmentsElement) {
        const departments = getUniqueValues(appointments, "department");

        totalDepartmentsElement.textContent = departments.length;
    }
}

function createDashboardAppointmentItem(appointment) {
    const appointmentItem = document.createElement("div");

    appointmentItem.className = "appointment-item";

    appointmentItem.innerHTML = `
        <div class="appointment-patient">

            <div class="patient-icon">
                <i class="fa-solid fa-user"></i>
            </div>

            <div>
                <strong>
                    Patient ${appointment.patientId || ""}
                </strong>

                <span>
                    Doctor ${appointment.doctorId || ""}
                    ·
                    ${appointment.department || ""}
                </span>
            </div>

        </div>


        <div class="appointment-time">

            <strong>
                ${formatTime(appointment.time)}
            </strong>

            <span>
                ${appointment.status || ""}
            </span>

        </div>
    `;

    return appointmentItem;
}

function displayUpcomingAppointments() {
    if (!appointmentPreview) {
        return;
    }

    const appointments = getAppointments();

    const today = getTodayDate();

    const todayAppointments = appointments
        .filter(function (appointment) {
            return appointment.date === today;
        })
        .sort(function (a, b) {
            return getTimeInMinutes(a.time) - getTimeInMinutes(b.time);
        });

    appointmentPreview.innerHTML = "";

    if (todayAppointments.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.textContent =
            "There are no appointments scheduled for today.";

        appointmentPreview.appendChild(emptyMessage);

        return;
    }

    todayAppointments.forEach(function (appointment) {
        appointmentPreview.appendChild(
            createDashboardAppointmentItem(appointment),
        );
    });
}

function updateTodayAppointmentCount() {
    const appointments = getAppointments();

    const today = getTodayDate();

    const todayAppointments = appointments.filter(function (appointment) {
        return appointment.date === today;
    });

    if (totalAppointmentsElement) {
        totalAppointmentsElement.textContent = todayAppointments.length;
    }
}

function searchDashboard() {
    if (!dashboardSearchInput) {
        return;
    }

    const searchValue = dashboardSearchInput.value.trim().toLowerCase();

    if (!dashboard) {
        return;
    }

    const searchableItems = dashboard.querySelectorAll(
        ".overview-card, .appointment-item, .activity-item",
    );

    searchableItems.forEach(function (item) {
        const text = item.textContent.toLowerCase();

        if (searchValue === "" || text.includes(searchValue)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

function initializeDashboard() {
    if (!dashboard) {
        return;
    }

    updateOverviewCards();

    displayUpcomingAppointments();
    renderActivities();
}

if (dashboard) {
    initializeDashboard();
}

if (dashboardSearchInput) {
    dashboardSearchInput.addEventListener("input", searchDashboard);
}

if (hamburgerForIndexHtml && navbarMenuForIndexHtml) {
    hamburgerForIndexHtml.addEventListener("click", function () {
        navbarMenuForIndexHtml.classList.toggle("unhide");
    });
}
