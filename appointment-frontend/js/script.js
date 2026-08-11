const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");
const statusFilter = document.querySelector(".status-filter");
const departmentFilter = document.querySelector(".department-filter");
function filterAppointments() {
    const searchValue = appointmentSearch.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    const selectedDepartment = departmentFilter.value.toLowerCase();
    appointmentRows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();
        const statusCell = row.querySelector("td:nth-child(8)");
        const departmentCell = row.querySelector("td:nth-child(4)");
        const statusText = statusCell.textContent.toLowerCase();
        const departmentText = departmentCell.textContent.toLowerCase();
        if (
            rowText.includes(searchValue) &&
            (statusText === selectedStatus ||
                selectedStatus === "all status") &&
            (departmentText === selectedDepartment ||
                selectedDepartment === "all departments")
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
