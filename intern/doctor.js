/* =========================================
   DOCTOR & DEPARTMENT MANAGEMENT
   STAGE 3 - JAVASCRIPT
========================================= */


/* =========================================
   TEMPORARY DOCTOR DATA
   Later this will come from Laravel API
========================================= */

let doctors = [
    {
        id: 1,
        name: "Dr. Hana",
        specialization: "Cardiology",
        qualification: "MD",
        experience: 8,
        phone: "0912345678",
        department: "Cardiology",
        working_days: "Monday - Friday",
        working_hours: "8:00 AM - 4:00 PM"
    },

    {
        id: 2,
        name: "Dr. Samuel",
        specialization: "Neurology",
        qualification: "MBBS",
        experience: 5,
        phone: "0923456789",
        department: "Neurology",
        working_days: "Monday - Thursday",
        working_hours: "9:00 AM - 3:00 PM"
    },

    {
        id: 3,
        name: "Dr. Abebe",
        specialization: "Pediatrics",
        qualification: "MD",
        experience: 10,
        phone: "0934567890",
        department: "Pediatrics",
        working_days: "Monday - Friday",
        working_hours: "8:00 AM - 4:00 PM"
    }
];


/* =========================================
   DISPLAY DOCTORS
========================================= */

function displayDoctors(list = doctors) {

    const tableBody = document.querySelector(
        "#doctorTableBody"
    );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    list.forEach(function(doctor) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="doctor-name">

                    <div class="doctor-icon">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>

                    <span>${doctor.name}</span>

                </div>
            </td>

            <td>${doctor.specialization}</td>

            <td>${doctor.qualification}</td>

            <td>${doctor.experience} Years</td>

            <td>${doctor.phone}</td>

            <td>${doctor.department}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editDoctor(${doctor.id})"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteDoctor(${doctor.id})"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>
        `;

        tableBody.appendChild(row);
    });


    /* Update total */

    const total = document.querySelector("#totalDoctors");

    if (total) {
        total.textContent = `Total Doctors: ${doctors.length}`;
    }
}


/* =========================================
   SEARCH DOCTORS
========================================= */

function searchDoctors() {

    const searchInput = document.querySelector(
        "#doctorSearch"
    );

    if (!searchInput) {
        return;
    }

    const searchText = searchInput.value
        .toLowerCase()
        .trim();


    const filteredDoctors = doctors.filter(function(doctor) {

        return (
            doctor.name.toLowerCase().includes(searchText) ||
            doctor.specialization.toLowerCase().includes(searchText) ||
            doctor.department.toLowerCase().includes(searchText)
        );

    });


    displayDoctors(filteredDoctors);
}


/* =========================================
   DELETE DOCTOR
========================================= */

function deleteDoctor(id) {

    const doctor = doctors.find(function(item) {
        return item.id === id;
    });


    if (!doctor) {
        return;
    }


    const confirmDelete = confirm(
        `Are you sure you want to delete ${doctor.name}?`
    );


    if (confirmDelete) {

        doctors = doctors.filter(function(item) {
            return item.id !== id;
        });

        displayDoctors();

        alert("Doctor deleted successfully.");
    }
}


/* =========================================
   EDIT DOCTOR
========================================= */

function editDoctor(id) {

    const doctor = doctors.find(function(item) {
        return item.id === id;
    });


    if (!doctor) {
        return;
    }


    alert(
        `Edit Doctor:\n\n${doctor.name}\n${doctor.specialization}`
    );

    /*
        Later we will replace this alert
        with the real Edit Doctor form.
    */
}


/* =========================================
   INITIALIZE DOCTOR PAGE
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    displayDoctors();


    const searchInput = document.querySelector(
        "#doctorSearch"
    );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchDoctors
        );

    }

});