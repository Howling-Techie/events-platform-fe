import {createContext, ReactNode, useEffect, useState} from "react";
import {registerUser, signUserIn} from "../services/UserManager.js";
import User from "../interfaces/User.ts";

interface UserContextType {
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    setUser: (user: User | null) => void,
    setAccessToken: (accessToken: string | null) => void,
    setRefreshToken: (refreshToken: string | null) => void,
    register: (username: string, displayName: string, password: string, email: string) => Promise<{
        success: boolean,
        message: string
    } | {
        success: boolean
    }>,
    signIn: (username: string, password: string) => Promise<{
        success: boolean,
        message: string
    } | {
        success: boolean
    }>,
    signOut: () => void
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        const storedUser: User = userJson ? JSON.parse(userJson) : null;
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUser && storedAccessToken && storedRefreshToken) {
            setUser(storedUser);
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    useEffect(() => {
        if (user && accessToken && refreshToken) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
    }, [user, accessToken, refreshToken]);

    const register = async (username: string, displayName: string, password: string, email: string): Promise<{
        success: boolean,
        message: string
    } | {
        success: boolean
    }> => {
        const data = await registerUser(username, displayName, email, password);
        if (data.user) {
            setUser(data.user);
            setAccessToken(data.tokens.accessToken);
            setRefreshToken(data.tokens.refreshToken);
            return {success: true};
        } else {
            return {success: false, message: data.msg};
        }
    };
    const signIn = async (username: string, password: string): Promise<{
        success: boolean,
        message: string
    } | {
        success: boolean
    }> => {
        const data = await signUserIn(username, password);
        console.log(data);
        if (data.user) {
            setUser(data.user);
            setAccessToken(data.tokens.accessToken);
            setRefreshToken(data.tokens.refreshToken);
            return {success: true};
        } else {
            return {success: false, message: data.msg};
        }
    };

    const signOut = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    return (
        <UserContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                setUser,
                setAccessToken,
                setRefreshToken,
                register,
                signIn,
                signOut
            }}>
            {children}
        </UserContext.Provider>
    );
};

export {UserContext, UserProvider};