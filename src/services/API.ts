import axios, {AxiosRequestConfig} from 'axios';
import UserInterface from "../interfaces/UserInterface.ts";
import GroupInterface from "../interfaces/GroupInterface.ts";
import EventInterface from "../interfaces/EventInterface.ts";

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

export const getUsers = async (accessToken?: string): Promise<{ users: UserInterface[] }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/users`,
        ...config,
    });
};

export const getUser = async (username: string, accessToken?: string): Promise<{ user: UserInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/users/${username}`,
        ...config,
    });
};

export const getUserGroups = async (username: string, accessToken?: string): Promise<{ groups: GroupInterface[] }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/users/${username}/groups`,
        ...config,
    });
};

export const getGroups = async (accessToken?: string): Promise<{ groups: GroupInterface[] }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/groups`,
        ...config,
    });
};

export const getGroup = async (id: number, accessToken?: string): Promise<{ group: GroupInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/groups/${id}`,
        ...config,
    });
};

export const updateUser = async (user: UserInterface, accessToken: string): Promise<{ user: UserInterface }> => {
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

export const updateUserNote = async (username: string, note: string, accessToken: string): Promise<{
    user: UserInterface
}> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'patch',
        url: `/users/${username}/note`,
        data: {note},
        ...config,
    });
};

export const followUser = async (username: string, accessToken: string): Promise<{ user: UserInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/users/${username}/follow`,
        ...config,
    });
};

export const unfollowUser = async (username: string, accessToken: string): Promise<{ user: UserInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'delete',
        url: `/users/${username}/follow`,
        ...config,
    });
};

export const joinGroup = async (id: number, accessToken: string): Promise<{ group: GroupInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/groups/${id}/join`,
        ...config,
    });
};

export const leaveGroup = async (id: number, accessToken: string): Promise<{ group: GroupInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/groups/${id}/leave`,
        ...config,
    });
};

export const updateGroup = async (group: GroupInterface, accessToken: string): Promise<{ group: GroupInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'patch',
        url: `/groups/${group.id}`,
        data: group,
        ...config,
    });
};

export const createGroup = async (group: {
    name: string,
    about: string,
    visibility: number
}, accessToken: string): Promise<{ group: GroupInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/groups`,
        data: group,
        ...config,
    });
};

export const getEvents = async (accessToken?: string): Promise<{ events: EventInterface[] }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/events`,
        ...config,
    });
};

export const getEvent = async (id: number, accessToken?: string): Promise<{ event: EventInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'get',
        url: `/events/${id}`,
        ...config,
    });
};

export const joinEvent = async (id: number, accessToken: string): Promise<{
    event_user: { user_id: number, event_id: number, status: number | undefined }
}> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/events/${id}/users`,
        ...config,
    });
};

export const leaveEvent = async (id: number, accessToken: string): Promise<{
    event_user: { user_id: number, event_id: number, status: number | undefined }
}> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'delete',
        url: `/events/${id}/users`,
        ...config,
    });
};

export const createEvent = async (event: {
    title: string,
    description: string,
    location: string,
    start_time: string,
    visibility: number,
    group_id: number
}, accessToken: string): Promise<{ event: EventInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'post',
        url: `/events`,
        data: event,
        ...config,
    });
};

export const updateEvent = async (event: EventInterface, accessToken: string): Promise<{ event: EventInterface }> => {
    const config: AxiosRequestConfig = accessToken
        ? setAccessToken(accessToken)
        : {};

    return makeRequest({
        method: 'patch',
        url: `/events/${event.id}`,
        data: event,
        ...config,
    });
};