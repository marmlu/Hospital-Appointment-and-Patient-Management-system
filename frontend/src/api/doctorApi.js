const API_URL = "http://127.0.0.1:8000/api/doctors";

export async function getDoctors() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch doctors.");
    }

    return response.json();
}

export async function createDoctor(doctor) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(doctor),
    });

    if (!response.ok) {
        throw new Error("Failed to create doctor.");
    }

    return response.json();
}

export async function updateDoctor(id, doctor) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(doctor),
    });

    if (!response.ok) {
        throw new Error("Failed to update doctor.");
    }

    return response.json();
}

export async function deleteDoctor(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete doctor.");
    }

    return response.json();
}