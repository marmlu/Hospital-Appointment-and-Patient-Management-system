const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");

const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
const doctorFilter = document.querySelector(".doctor-filter");
const appointmentDate = document.querySelector("#appointment-date");
const deleteButtons = document.querySelectorAll(".delete-btn");
const viewButtons = document.querySelectorAll(".view-btn");

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

appointmentSearch.addEventListener("input", filterAppointments);
statusFilter.addEventListener("change", filterAppointments);
departmentFilter.addEventListener("change", filterAppointments);
doctorFilter.addEventListener("change", filterAppointments);
appointmentDate.addEventListener("change", filterAppointments);

console.log(deleteButtons);
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
        const patientId = rowTarget.querySelector("td:nth-child(2)");
        const doctorId = rowTarget.querySelector("td:nth-child(3)");
        const department = rowTarget.querySelector("td:nth-child(4)");
        const date = rowTarget.querySelector("td:nth-child(5)");
        const reason = rowTarget.querySelector("td:nth-child(7)");
        const status = rowTarget.querySelector("td:nth-child(8)");
        console.log(patientId.textContent.trim());
        console.log(doctorId.textContent.trim());
        console.log(department.textContent.trim());
        console.log(date.textContent.trim());
        console.log(reason.textContent.trim());
        console.log(status.textContent.trim());
    });
});
