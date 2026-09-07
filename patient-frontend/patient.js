/* ========================================
PATIENT MODULE
Shared JavaScript
======================================== */

/* ========================================
PATIENT DATA
======================================== */

let patients = JSON.parse(localStorage.getItem("patients")) || [
    {
        id: "P001",
        name: "Abebe Kebede",
        age: 35,
        gender: "Male",
        phone: "0912345678",
        email: "[abebe@email.com](mailto:abebe@email.com)",
        address: "Addis Ababa",
        status: "Admitted",
    },

    {
        id: "P002",
        name: "Almaz Tesfaye",
        age: 28,
        gender: "Female",
        phone: "0923456789",
        email: "almaz@email.com",
        address: "Addis Ababa",
        status: "Discharged",
    },

    {
        id: "P003",
        name: "Hana Bekele",
        age: 42,
        gender: "Female",
        phone: "0934567890",
        email: "hana@email.com",
        address: "Addis Ababa",
        status: "Check-up",
    },

    {
        id: "P004",
        name: "Samuel Tadesse",
        age: 30,
        gender: "Male",
        phone: "0945678901",
        email: "samuel@email.com",
        address: "Addis Ababa",
        status: "Admitted",
    },
];

/* ========================================
SAVE PATIENTS
======================================== */

function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

/* ========================================
GENERATE PATIENT ID
======================================== */

function generatePatientId() {
    if (patients.length === 0) {
        return "P001";
    }

    const numbers = patients.map((patient) => {
        return parseInt(patient.id.replace("P", ""));
    });

    const nextNumber = Math.max(...numbers) + 1;

    return `P${String(nextNumber).padStart(3, "0")}`;
}

/* ========================================
ADD / EDIT PATIENT PAGE
======================================== */

const patientForm = document.getElementById("patient-form");

if (patientForm) {
    const patientMode = localStorage.getItem("patientMode") || "add";

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));

    /* ====================================
   FORM ELEMENTS
==================================== */

    const formTitle = document.getElementById("form-title");

    const formDescription = document.getElementById("form-description");

    const saveButtonText = document.getElementById("save-button-text");

    const nameInput = document.getElementById("patient-name");

    const ageInput = document.getElementById("age");

    const genderInput = document.getElementById("gender");

    const phoneInput = document.getElementById("phone");

    const emailInput = document.getElementById("email");

    const addressInput = document.getElementById("address");

    /* ====================================
   EDIT MODE
==================================== */

    if (patientMode === "edit" && selectedPatient) {
        formTitle.textContent = "Edit Patient";

        formDescription.textContent = "Update the patient's information below.";

        saveButtonText.textContent = "Update Patient";

        nameInput.value = selectedPatient.name;

        ageInput.value = selectedPatient.age;

        genderInput.value = selectedPatient.gender.toLowerCase();

        phoneInput.value = selectedPatient.phone;

        emailInput.value = selectedPatient.email || "";

        addressInput.value = selectedPatient.address || "";
    }

    /* ====================================
   FORM SUBMISSION
==================================== */

    patientForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();

        const age = ageInput.value;

        const gender = genderInput.value;

        const phone = phoneInput.value.trim();

        const email = emailInput.value.trim();

        const address = addressInput.value.trim();

        /* ================================
           VALIDATION
        ================================= */

        if (!name || !age || !gender || !phone) {
            alert("Please fill in all required fields.");

            return;
        }

        /* ================================
           UPDATE EXISTING PATIENT
        ================================= */

        if (patientMode === "edit" && selectedPatient) {
            const patientIndex = patients.findIndex(
                (patient) => patient.id === selectedPatient.id,
            );

            if (patientIndex === -1) {
                alert("Patient not found.");

                return;
            }

            patients[patientIndex] = {
                ...patients[patientIndex],

                name: name,

                age: Number(age),

                gender: gender === "male" ? "Male" : "Female",

                phone: phone,

                email: email,

                address: address,
            };

            savePatients();

            /* ============================
               UPDATE SELECTED PATIENT
            ============================ */

            localStorage.setItem(
                "selectedPatient",
                JSON.stringify(patients[patientIndex]),
            );

            alert("Patient updated successfully.");

            localStorage.removeItem("patientMode");

            window.location.href = "patients-list.html";

            return;
        }

        /* ================================
           ADD NEW PATIENT
        ================================= */

        const newPatient = {
            id: generatePatientId(),

            name: name,

            age: Number(age),

            gender: gender === "male" ? "Male" : "Female",

            phone: phone,

            email: email,

            address: address,

            status: "Check-up",
        };

        patients.push(newPatient);

        savePatients();

        alert("Patient added successfully.");

        localStorage.removeItem("patientMode");

        window.location.href = "patients-list.html";
    });
}

/* ========================================
PATIENT LIST
======================================== */

const patientTableBody = document.getElementById("patient-table-body");

if (patientTableBody) {
    displayPatients();

    /* ====================================
   SEARCH
==================================== */

    const searchInput = document.getElementById("search-patient");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            displayPatients();
        });
    }

    /* ====================================
   STATUS FILTER
==================================== */

    const statusFilter = document.getElementById("patient-status-filter");

    if (statusFilter) {
        statusFilter.addEventListener("change", function () {
            displayPatients();
        });
    }
}

/* ========================================
DISPLAY PATIENTS
======================================== */

function displayPatients() {
    if (!patientTableBody) {
        return;
    }

    const searchInput = document.getElementById("search-patient");

    const statusFilter = document.getElementById("patient-status-filter");

    const searchValue = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedStatus = statusFilter ? statusFilter.value : "all";

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchValue) ||
            patient.id.toLowerCase().includes(searchValue) ||
            patient.phone.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            patient.status.toLowerCase() === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    patientTableBody.innerHTML = "";

    if (filteredPatients.length === 0) {
        patientTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="no-patients">
                No patients found.
            </td>
        </tr>
    `;

        return;
    }

    filteredPatients.forEach((patient) => {
        const row = document.createElement("tr");

        const statusClass =
            patient.status === "Admitted"
                ? "admitted"
                : patient.status === "Discharged"
                  ? "discharged"
                  : "checkup";

        row.innerHTML = `
        <td>${patient.id}</td>

        <td>${patient.name}</td>

        <td>${patient.age}</td>

        <td>${patient.gender}</td>

        <td>${patient.phone}</td>

        <td>
            <span class="status ${statusClass}">
                ${patient.status}
            </span>
        </td>

        <td class="actions">

            <button
                class="view-btn"
                onclick="viewPatient('${patient.id}')"
            >
                <i class="fa-solid fa-eye"></i>
                View
            </button>

            <button
                class="edit-btn"
                onclick="editPatient('${patient.id}')"
            >
                <i class="fa-solid fa-pen"></i>
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deletePatient('${patient.id}')"
            >
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </td>
    `;

        patientTableBody.appendChild(row);
    });
}

/* ========================================
VIEW PATIENT
======================================== */

function viewPatient(patientId) {
    const patient = patients.find((patient) => patient.id === patientId);

    if (!patient) {
        alert("Patient not found.");
        return;
    }

    localStorage.setItem("selectedPatient", JSON.stringify(patient));

    window.location.href = "patient-details.html";
}

/* ========================================
EDIT PATIENT
======================================== */

function editPatient(patientId) {
    const patient = patients.find((patient) => patient.id === patientId);

    if (!patient) {
        alert("Patient not found.");

        return;
    }

    localStorage.setItem("selectedPatient", JSON.stringify(patient));

    localStorage.setItem("patientMode", "edit");

    localStorage.setItem("patientSource", "patient-list");

    window.location.href = "add-patient.html";
}

/* ========================================
DELETE PATIENT
======================================== */

function deletePatient(patientId) {
    const patient = patients.find((patient) => patient.id === patientId);

    if (!patient) {
        alert("Patient not found.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${patient.name}?`,
    );

    if (!confirmed) {
        return;
    }

    patients = patients.filter((patient) => patient.id !== patientId);

    savePatients();

    displayPatients();
}

/* ========================================
PATIENT DETAILS PAGE
======================================== */

const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));

if (selectedPatient && document.querySelector(".patient-details")) {
    const patientName = document.getElementById("patient-name");

    const patientId = document.getElementById("patient-id");

    const patientGender = document.getElementById("patient-gender");

    const patientAge = document.getElementById("patient-age");

    const patientPhone = document.getElementById("patient-phone");

    const patientEmail = document.getElementById("patient-email");

    const patientAddress = document.getElementById("patient-address");

    const patientStatus = document.getElementById("patient-status");

    if (patientName) {
        patientName.textContent = selectedPatient.name;
    }

    if (patientId) {
        patientId.textContent = selectedPatient.id;
    }

    if (patientGender) {
        patientGender.textContent = selectedPatient.gender;
    }

    if (patientAge) {
        patientAge.textContent = selectedPatient.age;
    }

    if (patientPhone) {
        patientPhone.textContent = selectedPatient.phone;
    }

    if (patientEmail) {
        patientEmail.textContent = selectedPatient.email || "Not provided";
    }

    if (patientAddress) {
        patientAddress.textContent = selectedPatient.address || "Not provided";
    }

    if (patientStatus) {
        patientStatus.textContent = selectedPatient.status;
    }
}

/* ========================================
ADD PATIENT BUTTON
======================================== */

const addPatientButton = document.getElementById("add-patient-btn");

if (addPatientButton) {
    addPatientButton.addEventListener("click", function () {
        localStorage.removeItem("selectedPatient");

        localStorage.setItem("patientMode", "add");

        window.location.href = "add-patient.html";
    });
}

/* ========================================
QUICK SAFETY CHECK
======================================== */

savePatients();
/* ========================================
PATIENT DETAILS BUTTONS
======================================== */

const editPatientButton = document.getElementById("edit-patient-btn");

const backPatientListButton = document.getElementById("back-patient-list-btn");

/* ========================================
EDIT FROM PATIENT DETAILS
======================================== */

if (editPatientButton) {
    editPatientButton.addEventListener("click", function () {
        const patient = JSON.parse(localStorage.getItem("selectedPatient"));

        if (!patient) {
            alert("No patient selected.");

            return;
        }

        localStorage.setItem("patientMode", "edit");

        localStorage.setItem("patientSource", "patient-details");

        window.location.href = "add-patient.html";
    });
}

/* ========================================
BACK TO PATIENT LIST
======================================== */

if (backPatientListButton) {
    backPatientListButton.addEventListener("click", function () {
        window.location.href = "patients-list.html";
    });
}
/* ========================================
PATIENT DASHBOARD
======================================== */

const totalPatientsElement = document.getElementById("total-patients");

const dischargedPatientsElement = document.getElementById(
    "discharged-patients",
);

const newPatientsElement = document.getElementById("new-patients");

const admittedPatientsElement = document.getElementById("admitted-patients");

if (
    totalPatientsElement ||
    dischargedPatientsElement ||
    newPatientsElement ||
    admittedPatientsElement
) {
    /* ================================
   TOTAL PATIENTS
================================= */

    if (totalPatientsElement) {
        totalPatientsElement.textContent = patients.length;
    }

    /* ================================
   DISCHARGED PATIENTS
================================= */

    if (dischargedPatientsElement) {
        const dischargedPatients = patients.filter(
            (patient) => patient.status === "Discharged",
        );

        dischargedPatientsElement.textContent = dischargedPatients.length;
    }

    /* ================================
   ADMITTED PATIENTS
================================= */

    if (admittedPatientsElement) {
        const admittedPatients = patients.filter(
            (patient) => patient.status === "Admitted",
        );

        admittedPatientsElement.textContent = admittedPatients.length;
    }

    /* ================================
   NEW PATIENTS
================================= */

    if (newPatientsElement) {
        /*
         * For now, "New Patients" means
         * patients currently marked as
         * Check-up.
         *
         * Later, when the backend is connected,
         * we can use created_at/date information
         * to calculate truly new patients.
         */

        const newPatients = patients.filter(
            (patient) => patient.status === "Check-up",
        );

        newPatientsElement.textContent = newPatients.length;
    }
}
/* ========================================
RECENT PATIENTS
======================================== */

const recentPatientsBody = document.getElementById("recent-patients-body");

if (recentPatientsBody) {
    displayRecentPatients();
}

/* ========================================
DISPLAY RECENT PATIENTS
======================================== */

function displayRecentPatients() {
    if (!recentPatientsBody) {
        return;
    }

    recentPatientsBody.innerHTML = "";

    /*
     * Display the most recently added
     * patients first.
     *
     * Since our current patient objects
     * don't have createdAt yet, we use
     * the order stored in the array.
     */

    const recentPatients = [...patients].reverse().slice(0, 5);

    if (recentPatients.length === 0) {
        recentPatientsBody.innerHTML = `
        <tr>
            <td colspan="6">
                No patients found.
            </td>
        </tr>
    `;

        return;
    }

    recentPatients.forEach((patient) => {
        const row = document.createElement("tr");

        row.innerHTML = `

        <td>
            ${patient.id}
        </td>

        <td>
            ${patient.name}
        </td>

        <td>
            ${patient.gender}
        </td>

        <td>
            ${patient.age}
        </td>

        <td>
            <span class="status ${getStatusClass(patient.status)}">
                ${patient.status}
            </span>
        </td>

        <td>

          <button 
    class="view-btn" 
    onclick="viewPatient('${patient.id}')"
    style="
        background-color: #e8f3ff;
        color: #1976d2;
        border: 1px solid #b9dcff;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: 0.2s ease;
    "
>
    <i class="fa-solid fa-eye"></i>
    View
</button>

<button 
    class="edit-btn" 
    onclick="editPatient('${patient.id}')"
    style="
        background-color: #fff4e5;
        color: #e67e22;
        border: 1px solid #ffd39b;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: 0.2s ease;
    "
>
    <i class="fa-solid fa-pen"></i>
    Edit
</button>

        </td>

    `;

        recentPatientsBody.appendChild(row);
    });
}

/* ========================================
STATUS CLASS
======================================== */

function getStatusClass(status) {
    if (status === "Admitted") {
        return "admitted";
    }

    if (status === "Discharged") {
        return "discharged";
    }

    if (status === "Check-up") {
        return "checkup";
    }

    return "";
}
/* ========================================
DASHBOARD QUICK ACTIONS
======================================== */

/* ========================================
QUICK ACTION - ADD PATIENT
======================================== */

const quickAddPatient = document.getElementById("quick-add-patient");

if (quickAddPatient) {
    quickAddPatient.addEventListener("click", function () {
        localStorage.removeItem("selectedPatient");

        localStorage.setItem("patientMode", "add");

        localStorage.setItem("patientSource", "dashboard");

        window.location.href = "add-patient.html";
    });
}

/* ========================================
VIEW ALL PATIENTS
======================================== */

const quickViewPatients = document.getElementById("quick-view-patients");

if (quickViewPatients) {
    quickViewPatients.addEventListener("click", function () {
        window.location.href = "patients-list.html";
    });
}

/* ========================================
APPOINTMENTS
======================================== */

const quickAppointments = document.getElementById("quick-appointments");

if (quickAppointments) {
    quickAppointments.addEventListener("click", function () {
        /*
         * This page belongs to the
         * Appointment module.
         *
         * Replace the filename with
         * your group's final appointment
         * page filename if necessary.
         */

        window.location.href = "appointments.html";
    });
}

/* ========================================
PATIENT RECORDS
======================================== */

const quickRecords = document.getElementById("quick-records");

if (quickRecords) {
    quickRecords.addEventListener("click", function () {
        /*
         * This page belongs to the
         * Medical Records module.
         *
         * Replace the filename with your
         * teammate's final filename.
         */

        window.location.href = "medical-records.html";
    });
}
/* ========================================
DASHBOARD HEADER - ADD PATIENT
======================================== */

const dashboardAddPatient = document.getElementById("dashboard-add-patient");

if (dashboardAddPatient) {
    dashboardAddPatient.addEventListener("click", function () {
        localStorage.removeItem("selectedPatient");

        localStorage.setItem("patientMode", "add");

        localStorage.setItem("patientSource", "dashboard");

        window.location.href = "add-patient.html";
    });
}

/* ========================================
SIDEBAR - PATIENTS
======================================== */

const sidebarPatients = document.getElementById("sidebar-patients");

if (sidebarPatients) {
    sidebarPatients.addEventListener("click", function () {
        window.location.href = "patient-dashboard.html";
    });
}
/* ========================================
PATIENT LIST - ADD PATIENT
======================================== */

const listAddPatient = document.getElementById("list-add-patient");

if (listAddPatient) {
    listAddPatient.addEventListener("click", function () {
        localStorage.removeItem("selectedPatient");

        localStorage.setItem("patientMode", "add");

        localStorage.setItem("patientSource", "patient-list");

        window.location.href = "add-patient.html";
    });
}

/* ========================================
PATIENT LIST - DASHBOARD
======================================== */

const patientDashboardButton = document.getElementById("patient-dashboard-btn");

if (patientDashboardButton) {
    patientDashboardButton.addEventListener("click", function () {
        window.location.href = "patient-dashboard.html";
    });
}
/* ========================================
ADD / EDIT PATIENT - CANCEL
======================================== */

const cancelPatientButton = document.getElementById("cancel-patient");

if (cancelPatientButton) {
    cancelPatientButton.addEventListener("click", function () {
        const patientSource = localStorage.getItem("patientSource");

        /* ================================
           REMOVE TEMPORARY DATA
        ================================= */

        localStorage.removeItem("patientMode");

        localStorage.removeItem("patientSource");

        /* ================================
           RETURN TO PREVIOUS PAGE
        ================================= */

        if (patientSource === "patient-list") {
            window.location.href = "patients-list.html";

            return;
        }

        if (patientSource === "patient-details") {
            window.location.href = "patient-details.html";

            return;
        }

        /* ================================
           DEFAULT
        ================================= */

        window.location.href = "patient-dashboard.html";
    });
}
