const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");
const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
const doctorFilter = document.querySelector(".doctor-filter");
function filterAppointments() {
    const searchValue = appointmentSearch.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    const selectedDepartment = departmentFilter.value.toLowerCase();
    const selectedDoctor = doctorFilter.value.toLowerCase();
    appointmentRows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();
        const statusCell = row.querySelector("td:nth-child(8)");
        const departmentCell = row.querySelector("td:nth-child(4)");
        const doctorCell = row.querySelector("td:nth-child(3)");
        const statusText = statusCell.textContent.toLowerCase();
        const departmentText = departmentCell.textContent.toLowerCase();
        const doctorText = doctorCell.textContent.toLowerCase();
        if (
            rowText.includes(searchValue) &&
            (statusText === selectedStatus ||
                selectedStatus === "all status") &&
            (departmentText === selectedDepartment ||
                selectedDepartment === "all departments") &&
            (doctorText === selectedDoctor || selectedDoctor === "all doctors")
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
