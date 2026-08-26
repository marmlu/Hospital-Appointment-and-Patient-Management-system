const appointmentMode = localStorage.getItem("appointmentMode");

const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");

const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
const doctorFilter = document.querySelector(".doctor-filter");
const appointmentDate = document.querySelector("#appointment-date");

const deleteButtons = document.querySelectorAll(".delete-btn");
const viewButtons = document.querySelectorAll(".view-btn");

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

        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];

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

        const rowDate = `${year}-${months[month.toLowerCase()]}-${day.padStart(
            2,
            "0",
        )}`;

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

        const confirmDelete = confirm("Are you sure you want to delete it?");

        if (confirmDelete) {
            rowTarget.remove();
        }
    });
});

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
            const rowAppointmentId = row
                .querySelector("td:nth-child(1)")
                .textContent.trim();

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

    if (storedPatientId) {
        document.querySelector("#patient-id").value = storedPatientId;
    }

    if (storedDoctorId) {
        document.querySelector("#doctor-id").value = storedDoctorId;
    }

    if (storedDepartment) {
        const departmentSelect = document.querySelector("#department");

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

    if (storedDate) {
        const dateObject = new Date(storedDate);

        if (!isNaN(dateObject)) {
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");

            document.querySelector("#appointment-date").value =
                `${year}-${month}-${day}`;
        }
    }

    if (storedTime) {
        const timeObject = new Date(`January 1, 2026 ${storedTime}`);

        if (!isNaN(timeObject)) {
            const hours = String(timeObject.getHours()).padStart(2, "0");
            const minutes = String(timeObject.getMinutes()).padStart(2, "0");

            document.querySelector("#appointment-time").value =
                `${hours}:${minutes}`;
        }
    }

    if (storedType) {
        const typeSelect = document.querySelector("#appointment-type");

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

    if (storedStatus) {
        const statusSelect = document.querySelector("#status");

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

    if (document.querySelector("#notes")) {
        document.querySelector("#notes").value = storedNotes || "";
    }

    if (document.querySelector("#reason")) {
        document.querySelector("#reason").value = storedReason || "";
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

        const updatedPatientId = document.querySelector("#patient-id").value;

        const updatedDoctorId = document.querySelector("#doctor-id").value;

        const departmentSelect = document.querySelector("#department");

        const updatedDepartment =
            departmentSelect.options[
                departmentSelect.selectedIndex
            ]?.textContent.trim() || "";

        const updatedDate = document.querySelector("#appointment-date").value;

        const updatedTime = document.querySelector("#appointment-time").value;

        const updatedReason = document.querySelector("#reason").value;

        const statusSelect = document.querySelector("#status");

        const updatedStatus =
            statusSelect.options[
                statusSelect.selectedIndex
            ]?.textContent.trim() || "";

        const updatedNotes = document.querySelector("#notes").value;

        const typeSelect = document.querySelector("#appointment-type");

        const updatedType =
            typeSelect.options[typeSelect.selectedIndex]?.textContent.trim() ||
            "";

        localStorage.setItem("updatedPatientId", updatedPatientId);
        localStorage.setItem("updatedDoctorId", updatedDoctorId);
        localStorage.setItem("updatedDepartment", updatedDepartment);
        localStorage.setItem("updatedDate", updatedDate);
        localStorage.setItem("updatedTime", updatedTime);
        localStorage.setItem("updatedStatus", updatedStatus);
        localStorage.setItem("updatedNotes", updatedNotes);
        localStorage.setItem("updatedType", updatedType);
        localStorage.setItem("updatedReason", updatedReason);

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
        const rowAppointmentId = row
            .querySelector("td:nth-child(1)")
            .textContent.trim();

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
