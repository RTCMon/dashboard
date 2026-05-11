const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export interface ApiOptions extends RequestInit {
    params?: Record<string, string>;
}

async function handleResponse(response: Response) {
    if (response.status === 401) {
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        return;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.status_message || errorData.message || response.statusText);
    }

    // Some endpoints might return empty/204
    if (response.status === 204) return null;

    return response.json();
}

export const api = {
    get: async <T>(url: string, options?: ApiOptions): Promise<T> => {
        const searchParams = new URLSearchParams(options?.params).toString();
        const fullUrl = `${BASE_URL}${url}${searchParams ? `?${searchParams}` : ''}`;
        return fetch(fullUrl, {
            ...options,
            method: 'GET',
            credentials: 'include',
        }).then(handleResponse);
    },

    post: async <T>(url: string, body?: any, options?: ApiOptions): Promise<T> => {
        return fetch(`${BASE_URL}${url}`, {
            ...options,
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }).then(handleResponse);
    },

    put: async <T>(url: string, body?: any, options?: ApiOptions): Promise<T> => {
        return fetch(`${BASE_URL}${url}`, {
            ...options,
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }).then(handleResponse);
    },

    delete: async <T>(url: string, options?: ApiOptions): Promise<T> => {
        return fetch(`${BASE_URL}${url}`, {
            ...options,
            method: 'DELETE',
            credentials: 'include',
            ...options,
        }).then(handleResponse);
    },
};
