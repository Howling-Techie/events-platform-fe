const headers = {
    "Content-Type": "application/json",
};

const baseURL = import.meta.env.VITE_API_URL;

// Helper function for handling response
const handleResponse = async (response: Response) => {
    return await response.json();
};

const signUserIn = async (username: string, password: string) => {
    console.log(`Calling ${baseURL}/auth/signin with username ${username}`);
    const response = await fetch(`${baseURL}/auth/signin`, {
        method: "POST",
        headers,
        body: JSON.stringify({username, password})
    });
    return handleResponse(response);
};

const registerUser = async (username: string, displayName: string, email: string, password: string) => {
    const response = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({username, display_name: displayName, password, email}),
    });
    return handleResponse(response);
};
const refreshToken = async (refreshToken: string) => {
    const response = await fetch(`${baseURL}/auth/refresh`, {
        method: "POST",
        headers,
        body: JSON.stringify({refreshToken})
    });
    return handleResponse(response);
};

export {
    signUserIn,
    registerUser,
    refreshToken
};