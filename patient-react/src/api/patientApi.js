const API_URL = "http://127.0.0.1:8000/api/patients";

export async function getPatients() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch patients.");
    }

    return response.json();
}

export async function getPatient(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch patient.");
    }

    return response.json();
}

export async function createPatient(patient) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(patient),
    });

    if (!response.ok) {
        throw new Error("Failed to create patient.");
    }

    return response.json();
}

export async function updatePatient(id, patient) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(patient),
    });

    if (!response.ok) {
        throw new Error("Failed to update patient.");
    }

    return response.json();
}

export async function deletePatient(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete patient.");
    }

    return response.json();
}
