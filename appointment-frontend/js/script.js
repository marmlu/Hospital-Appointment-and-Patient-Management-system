const appointmentSearch = document.querySelector(".appointment-search-input");
const appointmentRows = document.querySelectorAll("tbody tr");

appointmentSearch.addEventListener("input", function () {
    const searchValue = appointmentSearch.value.toLowerCase();
    appointmentRows.forEach(function (row) {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
