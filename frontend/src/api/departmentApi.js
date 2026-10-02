const API_URL = "http://127.0.0.1:8000/api/departments";

export async function getDepartments() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch departments.");
    }

    return response.json();
}

export async function createDepartment(department) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(department),
    });

    if (!response.ok) {
        throw new Error("Failed to create department.");
    }

    return response.json();
}

export async function updateDepartment(id, department) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(department),
    });

    if (!response.ok) {
        throw new Error("Failed to update department.");
    }

    return response.json();
}

export async function deleteDepartment(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete department.");
    }

    return response.json();
}