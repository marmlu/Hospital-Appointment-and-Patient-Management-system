const appointmentMode = localStorage.getItem("appointmentMode");

const appointmentSearch = document.querySelector(".appointment-search-input");
let appointmentRows = document.querySelectorAll("tbody tr");
const appointmentIds = document.querySelectorAll("tbody tr td:nth-child(1)");

const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
const doctorFilter = document.querySelector(".doctor-filter");
const appointmentDate = document.querySelector("#appointment-date");

let deleteButtons = document.querySelectorAll(".delete-btn");

let viewButtons = document.querySelectorAll(".view-btn");
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
const saveButton = document.querySelector(".save-btn");
const appointmentForm = document.querySelector("#appointment-form");

const hamburger = document.querySelector(".hamburger");
const navbarMenu = document.querySelector(".navbar-menu");
const addBtn = document.querySelector(".add-btn");

function getHighestAppointmentId() {
    let highestId = 0;

    appointmentIds.forEach(function (appointmentId) {
        const id = Number(appointmentId.textContent.trim());

        if (!isNaN(id) && id > highestId) {
            highestId = id;
        }
    });

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.forEach(function (appointment) {
        const id = Number(appointment.id);

        if (!isNaN(id) && id > highestId) {
            highestId = id;
        }
    });

    return highestId;
}

function filterAppointments() {
    if (
        !appointmentSearch ||
        !statusFilter ||
        !departmentFilter ||
        !doctorFilter ||
        !appointmentDate
    ) {
        return;
    }

    const searchValue = appointmentSearch.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    const selectedDepartment = departmentFilter.value.toLowerCase();
    const selectedDoctor = doctorFilter.value.toLowerCase();
    const selectedDate = appointmentDate.value;

    const months = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12",
    };

    appointmentRows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();

        const doctorCell = row.querySelector("td:nth-child(3)");
        const departmentCell = row.querySelector("td:nth-child(4)");
        const dateCell = row.querySelector("td:nth-child(5)");
        const statusCell = row.querySelector("td:nth-child(8)");

        if (!doctorCell || !departmentCell || !dateCell || !statusCell) {
            return;
        }

        const doctorText = doctorCell.textContent.toLowerCase();
        const departmentText = departmentCell.textContent.toLowerCase();
        const statusText = statusCell.textContent.toLowerCase();

        const appointmentDateText = dateCell.textContent.trim();
        const dateParts = appointmentDateText.split(" ");

        if (dateParts.length < 3) {
            return;
        }

        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];

        const rowDate = `${year}-${months[month.toLowerCase()]}-${day.padStart(2, "0")}`;

        const matchesSearch = rowText.includes(searchValue);

        const matchesStatus =
            statusText === selectedStatus || selectedStatus === "all status";

        const matchesDepartment =
            departmentText === selectedDepartment ||
            selectedDepartment === "all departments";

        const matchesDoctor =
            doctorText === selectedDoctor || selectedDoctor === "all doctors";

        const matchesDate = selectedDate === "" || rowDate === selectedDate;

        row.style.display =
            matchesSearch &&
            matchesStatus &&
            matchesDepartment &&
            matchesDoctor &&
            matchesDate
                ? ""
                : "none";
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

deleteButtons.forEach(function (deleteButton) {
    deleteButton.addEventListener("click", function (event) {
        const rowTarget = event.target.closest("tr");

        if (!rowTarget) {
            return;
        }

        const appointmentId = rowTarget
            .querySelector("td:nth-child(1)")
            .textContent.trim();

        const confirmDelete = confirm("Are you sure you want to delete it?");

        if (confirmDelete) {
            rowTarget.remove();

            let appointments =
                JSON.parse(localStorage.getItem("appointments")) || [];

            appointments = appointments.filter(function (appointment) {
                return String(appointment.id) !== String(appointmentId);
            });

            localStorage.setItem("appointments", JSON.stringify(appointments));
        }
    });
});

function displayStoredAppointments() {
    const tbody = document.querySelector("tbody");

    if (!tbody) {
        return;
    }

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.forEach(function (appointment) {
        const existingRows = Array.from(tbody.querySelectorAll("tr"));

        const alreadyExists = existingRows.some(function (row) {
            const idCell = row.querySelector("td:nth-child(1)");

            if (!idCell) {
                return false;
            }

            return idCell.textContent.trim() === String(appointment.id);
        });

        if (alreadyExists) {
            return;
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.id}</td>
            <td>${appointment.patientId}</td>
            <td>${appointment.doctorId}</td>
            <td>${appointment.department}</td>
            <td>${formatAppointmentDate(appointment.date)}</td>
            <td>${formatAppointmentTime(appointment.time)}</td>
            <td>${appointment.reason}</td>
            <td>${appointment.status}</td>
            <td>${appointment.notes}</td>
            <td>${appointment.type}</td>
            <td class="actions">
                <a href="#" class="view-btn">
                    <i class="fa-solid fa-eye"></i>
                </a>
                <a href="#" class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </a>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function formatAppointmentDate(date) {
    if (!date) {
        return "";
    }

    const dateObject = new Date(date);

    if (isNaN(dateObject)) {
        return date;
    }

    return dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatAppointmentTime(time) {
    if (!time) {
        return "";
    }

    const timeObject = new Date(`January 1, 2026 ${time}`);

    if (isNaN(timeObject)) {
        return time;
    }

    return timeObject.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

displayStoredAppointments();

function formatAppointmentDate(date) {
    if (!date) {
        return "";
    }

    const dateObject = new Date(date);

    if (isNaN(dateObject)) {
        return date;
    }

    return dateObject.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatAppointmentTime(time) {
    if (!time) {
        return "";
    }

    const timeObject = new Date(`January 1, 2026 ${time}`);

    if (isNaN(timeObject)) {
        return time;
    }

    return timeObject.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

displayStoredAppointments();

appointmentRows = document.querySelectorAll("tbody tr");
deleteButtons = document.querySelectorAll(".delete-btn");

viewButtons = document.querySelectorAll(".view-btn");

viewButtons.forEach(function (viewButton) {
    viewButton.addEventListener("click", function (event) {
        const rowTarget = event.target.closest("tr");

        if (!rowTarget) {
            return;
        }

        const appointmentId = rowTarget
            .querySelector("td:nth-child(1)")
            .textContent.trim();

        const patientId = rowTarget
            .querySelector("td:nth-child(2)")
            .textContent.trim();

        const doctorId = rowTarget
            .querySelector("td:nth-child(3)")
            .textContent.trim();

        const department = rowTarget
            .querySelector("td:nth-child(4)")
            .textContent.trim();

        const date = rowTarget
            .querySelector("td:nth-child(5)")
            .textContent.trim();

        const time = rowTarget
            .querySelector("td:nth-child(6)")
            .textContent.trim();

        const reason = rowTarget
            .querySelector("td:nth-child(7)")
            .textContent.trim();

        const status = rowTarget
            .querySelector("td:nth-child(8)")
            .textContent.trim();

        const notes = rowTarget
            .querySelector("td:nth-child(9)")
            .textContent.trim();

        const type = rowTarget
            .querySelector("td:nth-child(10)")
            .textContent.trim();

        localStorage.setItem("appointmentId", appointmentId);
        localStorage.setItem("patientId", patientId);
        localStorage.setItem("doctorId", doctorId);
        localStorage.setItem("department", department);
        localStorage.setItem("date", date);
        localStorage.setItem("reason", reason);
        localStorage.setItem("status", status);
        localStorage.setItem("time", time);
        localStorage.setItem("notes", notes);
        localStorage.setItem("type", type);

        localStorage.setItem("appointmentMode", "edit");

        window.location.href = "appointment-details.html";
    });
});

const retrievedAppointmentId = localStorage.getItem("appointmentId");

const retrievedPatientId = localStorage.getItem("patientId");

const retrievedDoctorId = localStorage.getItem("doctorId");

const retrievedDepartment = localStorage.getItem("department");

const retrievedDate = localStorage.getItem("date");

const retrievedReason = localStorage.getItem("reason");

const retrievedStatus = localStorage.getItem("status");

const retrievedTime = localStorage.getItem("time");

const retrievedNotes = localStorage.getItem("notes");

const retrievedType = localStorage.getItem("type");

if (retrieveAppointmentId) {
    retrieveAppointmentId.textContent = retrievedAppointmentId || "";
}

if (retrievePatientId) {
    retrievePatientId.textContent = retrievedPatientId || "";
}

if (retrieveDoctorId) {
    retrieveDoctorId.textContent = retrievedDoctorId || "";
}

if (retrieveDepartment) {
    retrieveDepartment.textContent = retrievedDepartment || "";
}

if (retrieveDate) {
    retrieveDate.textContent = retrievedDate || "";
}

if (retrieveReason) {
    retrieveReason.textContent = retrievedReason || "";
}

if (retrieveStatus) {
    retrieveStatus.textContent = retrievedStatus || "";
}

if (retrieveTime) {
    retrieveTime.textContent = retrievedTime || "";
}

if (retrieveNotes) {
    retrieveNotes.textContent = retrievedNotes || "";
}

if (retrieveType) {
    retrieveType.textContent = retrievedType || "";
}

if (editAppointmentButton) {
    editAppointmentButton.addEventListener("click", function () {
        const storedAppointmentId = localStorage.getItem("appointmentId");

        if (!storedAppointmentId) {
            return;
        }

        const matchingRow = Array.from(appointmentRows).find(function (row) {
            const firstCell = row.querySelector("td:nth-child(1)");

            if (!firstCell) {
                return false;
            }

            const rowAppointmentId = firstCell.textContent.trim();

            return rowAppointmentId === storedAppointmentId;
        });

        if (!matchingRow) {
            return;
        }

        localStorage.setItem(
            "patientId",
            matchingRow.querySelector("td:nth-child(2)").textContent.trim(),
        );

        localStorage.setItem(
            "doctorId",
            matchingRow.querySelector("td:nth-child(3)").textContent.trim(),
        );

        localStorage.setItem(
            "department",
            matchingRow.querySelector("td:nth-child(4)").textContent.trim(),
        );

        localStorage.setItem(
            "date",
            matchingRow.querySelector("td:nth-child(5)").textContent.trim(),
        );

        localStorage.setItem(
            "time",
            matchingRow.querySelector("td:nth-child(6)").textContent.trim(),
        );

        localStorage.setItem(
            "reason",
            matchingRow.querySelector("td:nth-child(7)").textContent.trim(),
        );

        localStorage.setItem(
            "status",
            matchingRow.querySelector("td:nth-child(8)").textContent.trim(),
        );

        localStorage.setItem(
            "notes",
            matchingRow.querySelector("td:nth-child(9)").textContent.trim(),
        );

        localStorage.setItem(
            "type",
            matchingRow.querySelector("td:nth-child(10)").textContent.trim(),
        );

        localStorage.setItem("appointmentMode", "edit");

        window.location.href = "edit-appointment.html";
    });
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
        patientSelect.selectedIndex = -1;
        patientSelect.value = "";
    }

    if (doctorSelect) {
        doctorSelect.selectedIndex = -1;
        doctorSelect.value = "";
    }

    if (departmentSelect) {
        departmentSelect.selectedIndex = -1;
        departmentSelect.value = "";
    }

    if (dateInput) {
        dateInput.value = "";
    }

    if (timeInput) {
        timeInput.value = "";
    }

    if (typeSelect) {
        typeSelect.selectedIndex = -1;
        typeSelect.value = "";
    }

    if (statusSelect) {
        statusSelect.selectedIndex = -1;
        statusSelect.value = "";
    }

    if (reasonInput) {
        reasonInput.value = "";
    }

    if (notesInput) {
        notesInput.value = "";
    }
}

function loadAppointmentIntoForm() {
    if (!appointmentForm) {
        return;
    }

    const storedPatientId = localStorage.getItem("patientId");

    const storedDoctorId = localStorage.getItem("doctorId");

    const storedDepartment = localStorage.getItem("department");

    const storedDate = localStorage.getItem("date");

    const storedTime = localStorage.getItem("time");

    const storedReason = localStorage.getItem("reason");

    const storedStatus = localStorage.getItem("status");

    const storedNotes = localStorage.getItem("notes");

    const storedType = localStorage.getItem("type");

    const patientSelect = document.querySelector("#patient-id");

    const doctorSelect = document.querySelector("#doctor-id");

    const departmentSelect = document.querySelector("#department");

    const dateInput = document.querySelector("#appointment-date");

    const timeInput = document.querySelector("#appointment-time");

    const typeSelect = document.querySelector("#appointment-type");

    const statusSelect = document.querySelector("#status");

    const notesInput = document.querySelector("#notes");

    const reasonInput = document.querySelector("#reason");

    if (patientSelect && storedPatientId) {
        patientSelect.value = storedPatientId;
    }

    if (doctorSelect && storedDoctorId) {
        doctorSelect.value = storedDoctorId;
    }

    if (departmentSelect && storedDepartment) {
        const departmentOption = Array.from(departmentSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    storedDepartment.toLowerCase()
                );
            },
        );

        if (departmentOption) {
            departmentSelect.value = departmentOption.value;
        }
    }

    if (dateInput && storedDate) {
        const dateObject = new Date(storedDate);

        if (!isNaN(dateObject)) {
            const year = dateObject.getFullYear();

            const month = String(dateObject.getMonth() + 1).padStart(2, "0");

            const day = String(dateObject.getDate()).padStart(2, "0");

            dateInput.value = `${year}-${month}-${day}`;
        }
    }

    if (timeInput && storedTime) {
        const timeObject = new Date(`January 1, 2026 ${storedTime}`);

        if (!isNaN(timeObject)) {
            const hours = String(timeObject.getHours()).padStart(2, "0");

            const minutes = String(timeObject.getMinutes()).padStart(2, "0");

            timeInput.value = `${hours}:${minutes}`;
        }
    }

    if (typeSelect && storedType) {
        const typeOption = Array.from(typeSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    storedType.toLowerCase()
                );
            },
        );

        if (typeOption) {
            typeSelect.value = typeOption.value;
        }
    }

    if (statusSelect && storedStatus) {
        const statusOption = Array.from(statusSelect.options).find(
            function (option) {
                return (
                    option.textContent.trim().toLowerCase() ===
                    storedStatus.toLowerCase()
                );
            },
        );

        if (statusOption) {
            statusSelect.value = statusOption.value;
        }
    }

    if (notesInput) {
        notesInput.value = storedNotes || "";
    }

    if (reasonInput) {
        reasonInput.value = storedReason || "";
    }
}

if (appointmentForm) {
    if (appointmentMode === "new") {
        clearNewAppointmentForm();
    } else {
        loadAppointmentIntoForm();
    }

    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const patientSelect = document.querySelector("#patient-id");

        const doctorSelect = document.querySelector("#doctor-id");

        const departmentSelect = document.querySelector("#department");

        const dateInput = document.querySelector("#appointment-date");

        const timeInput = document.querySelector("#appointment-time");

        const reasonInput = document.querySelector("#reason");

        const statusSelect = document.querySelector("#status");

        const notesInput = document.querySelector("#notes");

        const typeSelect = document.querySelector("#appointment-type");

        const updatedPatientId = patientSelect?.value || "";

        const updatedDoctorId = doctorSelect?.value || "";

        const updatedDepartment =
            departmentSelect?.options[
                departmentSelect.selectedIndex
            ]?.textContent.trim() || "";

        const updatedDate = dateInput?.value || "";

        const updatedTime = timeInput?.value || "";

        const updatedReason = reasonInput?.value || "";

        const updatedStatus =
            statusSelect?.options[
                statusSelect.selectedIndex
            ]?.textContent.trim() || "";

        const updatedNotes = notesInput?.value || "";

        const updatedType =
            typeSelect?.options[typeSelect.selectedIndex]?.textContent.trim() ||
            "";

        if (appointmentMode === "new") {
            let appointments =
                JSON.parse(localStorage.getItem("appointments")) || [];

            let highestId = 7;

            appointments.forEach(function (appointment) {
                const id = Number(appointment.id);

                if (!isNaN(id) && id > highestId) {
                    highestId = id;
                }
            });

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

            localStorage.setItem("appointments", JSON.stringify(appointments));

            localStorage.setItem("newAppointmentId", String(newAppointmentId));

            console.log("Highest ID:", highestId);
            console.log("Creating new appointment:", newAppointmentId);
        }
        window.location.href = "appointments.html";
    });
}

const appointmentIdForUpdate = localStorage.getItem("appointmentId");

const updatedPatientIdForUpdate = localStorage.getItem("updatedPatientId");

const updatedDoctorIdForUpdate = localStorage.getItem("updatedDoctorId");

const updatedDepartmentForUpdate = localStorage.getItem("updatedDepartment");

const updatedDateForUpdate = localStorage.getItem("updatedDate");

const updatedTimeForUpdate = localStorage.getItem("updatedTime");

const updatedStatusForUpdate = localStorage.getItem("updatedStatus");

const updatedNotesForUpdate = localStorage.getItem("updatedNotes");

const updatedTypeForUpdate = localStorage.getItem("updatedType");

const updatedReasonForUpdate = localStorage.getItem("updatedReason");

if (
    appointmentRows.length > 0 &&
    appointmentIdForUpdate &&
    appointmentMode !== "new"
) {
    const matchingRow = Array.from(appointmentRows).find(function (row) {
        const firstCell = row.querySelector("td:nth-child(1)");

        if (!firstCell) {
            return false;
        }

        const rowAppointmentId = firstCell.textContent.trim();

        return rowAppointmentId === appointmentIdForUpdate;
    });

    if (matchingRow) {
        if (updatedPatientIdForUpdate) {
            matchingRow.querySelector("td:nth-child(2)").textContent =
                updatedPatientIdForUpdate;
        }

        if (updatedDoctorIdForUpdate) {
            matchingRow.querySelector("td:nth-child(3)").textContent =
                updatedDoctorIdForUpdate;
        }

        if (updatedDepartmentForUpdate) {
            matchingRow.querySelector("td:nth-child(4)").textContent =
                updatedDepartmentForUpdate;
        }

        if (updatedDateForUpdate) {
            const dateObject = new Date(updatedDateForUpdate);

            matchingRow.querySelector("td:nth-child(5)").textContent =
                dateObject.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
        }

        if (updatedTimeForUpdate) {
            const timeObject = new Date(
                `January 1, 2026 ${updatedTimeForUpdate}`,
            );

            matchingRow.querySelector("td:nth-child(6)").textContent =
                timeObject.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
        }

        if (updatedReasonForUpdate) {
            matchingRow.querySelector("td:nth-child(7)").textContent =
                updatedReasonForUpdate;
        }

        if (updatedStatusForUpdate) {
            matchingRow.querySelector("td:nth-child(8)").textContent =
                updatedStatusForUpdate;
        }

        if (updatedNotesForUpdate) {
            matchingRow.querySelector("td:nth-child(9)").textContent =
                updatedNotesForUpdate;
        }

        if (updatedTypeForUpdate) {
            matchingRow.querySelector("td:nth-child(10)").textContent =
                updatedTypeForUpdate;
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
    }
}

if (hamburger && navbarMenu) {
    hamburger.addEventListener("click", function () {
        navbarMenu.classList.toggle("unhide");
    });
}

if (addBtn) {
    addBtn.addEventListener("click", function () {
        localStorage.setItem("appointmentMode", "new");

        localStorage.removeItem("appointmentId");

        localStorage.removeItem("patientId");

        localStorage.removeItem("doctorId");

        localStorage.removeItem("department");

        localStorage.removeItem("date");

        localStorage.removeItem("reason");

        localStorage.removeItem("status");

        localStorage.removeItem("time");

        localStorage.removeItem("notes");

        localStorage.removeItem("type");

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
