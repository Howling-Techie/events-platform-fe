import {createContext, ReactNode, useEffect, useState} from "react";
import {refreshTokens, registerUser, signUserIn} from "../services/UserManager.js";
import UserInterface from "../interfaces/UserInterface.ts";

interface UserContextType {
    user: UserInterface | null,
    accessToken: string | null,
    refreshToken: string | null,
    setUser: (user: UserInterface | null) => void,
    setAccessToken: (accessToken: string | null) => void,
    setRefreshToken: (refreshToken: string | null) => void,
    checkTokenStatus: () => void,
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
    const [user, setUser] = useState<UserInterface | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [tokenExpiration, setTokenExpiration] = useState<{ auth: number, refresh: number } | null>(null);
    // Get stored tokens on load
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        const storedUser: UserInterface = userJson ? JSON.parse(userJson) : null;
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const tokenExpirationJson = localStorage.getItem("tokenExpiration");
        const storedTokenExpiration = tokenExpirationJson ? JSON.parse(tokenExpirationJson) : null;

        if (storedUser && storedAccessToken && storedRefreshToken) {
            setUser(storedUser);
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setTokenExpiration(storedTokenExpiration);
        }
    }, []);

    // Update stored tokens
    useEffect(() => {
        if (user && accessToken && refreshToken) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("tokenExpiration", JSON.stringify(tokenExpiration));
        }
    }, [user, accessToken, refreshToken, tokenExpiration]);

    // Refresh tokens if they have expired
    useEffect(() => {
        if (tokenExpiration && tokenExpiration.auth < Date.now()) {
            if (accessToken && refreshToken)
                refreshTokens(accessToken, refreshToken).then((data) => {
                    setAccessToken(data.accessToken);
                    setRefreshToken(data.refreshToken);
                    setTokenExpiration(data.expiration);
                }, () => signOut());
        }
    },);

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
        if (data.user) {
            setUser(data.user);
            setAccessToken(data.tokens.accessToken);
            setRefreshToken(data.tokens.refreshToken);
            setTokenExpiration(data.expiration);
            return {success: true};
        } else {
            return {success: false, message: data.msg};
        }
    };

    const signOut = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setTokenExpiration(null);

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiration");
    };

    const checkTokenStatus = () => {
        if (tokenExpiration && tokenExpiration.auth < Date.now()) {
            if (accessToken && refreshToken)
                refreshTokens(accessToken, refreshToken).then((data) => {
                    setAccessToken(data.tokens.accessToken);
                    setRefreshToken(data.tokens.refreshToken);
                    setTokenExpiration(data.expiration);
                    window.location.reload();
                }, () => signOut());
        }
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
                checkTokenStatus,
                register,
                signIn,
                signOut
            }}>
            {children}
        </UserContext.Provider>
    );
};

export {UserContext, UserProvider};