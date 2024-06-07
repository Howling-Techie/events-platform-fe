import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "../contexts/UserContext.jsx";

export const UserSignOut = () => {
    const currentUserContext = useContext(UserContext);
    const navigator = useNavigate();

    useEffect(() => {
        if (currentUserContext) {
            currentUserContext.signOut();
            if (!currentUserContext.user) {
                navigator("/");
            }
        }
    }, [navigator, currentUserContext]);
    return (
        <h2 className="text-2xl font-bold mb-4">Signing Out...</h2>
    );
};