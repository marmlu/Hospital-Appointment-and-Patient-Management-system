const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");
const statusFilter = document.querySelector(".status-filter");

function filterAppointments() {
    const searchValue = appointmentSearch.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    appointmentRows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();
        const statusCell = row.querySelector("td:nth-child(8)");
        const statusText = statusCell.textContent.toLowerCase();
        if (
            rowText.includes(searchValue) &&
            (statusText === selectedStatus || selectedStatus === "all status")
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

appointmentSearch.addEventListener("input", filterAppointments);
statusFilter.addEventListener("change", filterAppointments);
