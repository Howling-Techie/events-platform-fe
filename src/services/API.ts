import axios, {AxiosRequestConfig} from 'axios';
import User from "../interfaces/User.ts";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL,
});

// Function to set the access token in the headers
const setAccessToken = (token: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

// Function to handle API requests
const makeRequest = async (config: AxiosRequestConfig) => {
    try {
        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export const getUsers = async (accessToken?: string): Promise<{ users: User[] }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/users`,
        ...config,
    });
};

export const getUser = async (username: string, accessToken?: string): Promise<{ user: User }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/users/${username}`,
        ...config,
    });
};

export const updateUser = async (user: User, accessToken: string): Promise<{ user: User }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'patch',
        url: `/users/${user.username}`,
        data: user,
        ...config,
    });
};