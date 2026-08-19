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
const saveButton = document.querySelector("save-btn");

function filterAppointments() {
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

        const doctorText = doctorCell.textContent.toLowerCase();
        const departmentText = departmentCell.textContent.toLowerCase();
        const statusText = statusCell.textContent.toLowerCase();

        const appointmentDateText = dateCell.textContent.trim();

        // Convert "10 Sep 2027" into "2027-09-10"
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
        const confirmDelete = confirm("Are you sure you want to delete it?");
        if (confirmDelete) {
            rowTarget.remove();
        }
    });
});

viewButtons.forEach(function (viewButton) {
    viewButton.addEventListener("click", function (event) {
        const rowTarget = event.target.closest("tr");
        const appointmentId =
            rowTarget.querySelector("td:nth-child(1)").textContent;
        const patientId =
            rowTarget.querySelector("td:nth-child(2)").textContent;
        const doctorId = rowTarget.querySelector("td:nth-child(3)").textContent;
        const department =
            rowTarget.querySelector("td:nth-child(4)").textContent;
        const date = rowTarget.querySelector("td:nth-child(5)").textContent;
        const reason = rowTarget.querySelector("td:nth-child(7)").textContent;
        const status = rowTarget.querySelector("td:nth-child(8)").textContent;
        const time = rowTarget.querySelector("td:nth-child(6)").textContent;
        const notes = rowTarget.querySelector("td:nth-child(9)").textContent;
        const type = rowTarget.querySelector("td:nth-child(10)").textContent;
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
        window.location.href = "appointment-details.html";
        console.log(appointmentId);
        console.log(patientId);
        console.log(doctorId);
        console.log(department);
        console.log(date);
        console.log(reason);
        console.log(status);
    });
});
const retrievedAppointmentId = localStorage.getItem("appointmentId");
if (retrieveAppointmentId) {
    retrieveAppointmentId.textContent = retrievedAppointmentId;
}
const retrievedPatientId = localStorage.getItem("patientId");
if (retrievePatientId) {
    retrievePatientId.textContent = retrievedPatientId;
}
const retrievedDoctorId = localStorage.getItem("doctorId");
if (retrieveDoctorId) {
    retrieveDoctorId.textContent = retrievedDoctorId;
}
const retrievedDepartment = localStorage.getItem("department");
if (retrieveDepartment) {
    retrieveDepartment.textContent = retrievedDepartment;
}
const retrievedDate = localStorage.getItem("date");
if (retrieveDate) {
    retrieveDate.textContent = retrievedDate;
}
const retrievedReason = localStorage.getItem("reason");
if (retrieveReason) {
    retrieveReason.textContent = retrievedReason;
}
const retrievedStatus = localStorage.getItem("status");
if (retrieveStatus) {
    retrieveStatus.textContent = retrievedStatus;
}
const retrievedTime = localStorage.getItem("time");
if (retrieveTime) {
    retrieveTime.textContent = retrievedTime;
}
const retrievedNotes = localStorage.getItem("notes");
if (retrieveNotes) {
    retrieveNotes.textContent = retrievedNotes;
}
const retrievedType = localStorage.getItem("type");
if (retrieveType) {
    retrieveType.textContent = retrievedType;
}

if (editAppointmentButton) {
    editAppointmentButton.addEventListener("click", function () {
        const appointmentArray = Array.from(appointmentRows);
        const storedAppointmentId = localStorage.getItem("appointmentId");

        if (storedAppointmentId) {
            const matchingRow = appointmentArray.find(function (row) {
                const rowAppointmentId = row
                    .querySelector("td:nth-child(1)")
                    .textContent.trim();

                return rowAppointmentId === storedAppointmentId;
            });

            if (matchingRow) {
                const appointmentId = matchingRow
                    .querySelector("td:nth-child(1)")
                    .textContent.trim();

                const patientId = matchingRow
                    .querySelector("td:nth-child(2)")
                    .textContent.trim();

                const doctorId = matchingRow
                    .querySelector("td:nth-child(3)")
                    .textContent.trim();

                const department = matchingRow
                    .querySelector("td:nth-child(4)")
                    .textContent.trim();

                const date = matchingRow
                    .querySelector("td:nth-child(5)")
                    .textContent.trim();

                const time = matchingRow
                    .querySelector("td:nth-child(6)")
                    .textContent.trim();

                const reason = matchingRow
                    .querySelector("td:nth-child(7)")
                    .textContent.trim();

                const status = matchingRow
                    .querySelector("td:nth-child(8)")
                    .textContent.trim();

                const notes = matchingRow
                    .querySelector("td:nth-child(9)")
                    .textContent.trim();

                const type = matchingRow
                    .querySelector("td:nth-child(10)")
                    .textContent.trim();

                localStorage.setItem("patientId", patientId);
                localStorage.setItem("doctorId", doctorId);
                localStorage.setItem("department", department);
                localStorage.setItem("date", date);
                localStorage.setItem("time", time);
                localStorage.setItem("reason", reason);
                localStorage.setItem("status", status);
                localStorage.setItem("notes", notes);
                localStorage.setItem("type", type);

                window.location.href = "edit-appointment.html";
            }
        }
    });
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
    const typeSelect = document.querySelector("#appointment-type").value;
    const typeOption = Array.from(typeSelect.options).find(function (option) {
        return (
            option.textContent.trim().toLowerCase() === storedType.toLowerCase()
        );
    });

    if (typeOption) {
        typeSelect.value = typeOption.value;
    }
}
if (storedStatus) {
    const statusSelect = document.querySelector("#status");
    const statusOption = Array.from(statusSelect.option).find(
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
if (storedNotes) {
    document.querySelector("#notes").value = storedNotes;
}
if (storedReason) {
    document.querySelector("#reason").value = storedReason;
}
if (saveButton) {
    saveButton.addEventListener("click", function () {
        const updatedPatientId = document.querySelector("#patient-id").value;
        const updatedDoctorId = document.querySelector("#doctor-id").value;
        const updatedDepartment = document.querySelector("#department").value;
        const updatedDate = document.querySelector("#appointment-date").value;
        const updatedTime = document.querySelector("#appointment-time").value;
        const updatedReason = document.querySelector("#reason").value;
        const updatedStatus = document.querySelector("#status").value;
        const updatedNotes = document.querySelector("#notes").value;
        const updatedType = document.querySelector("#appointment-type").value;

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
