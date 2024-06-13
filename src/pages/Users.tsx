import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {getUsers} from "../services/API.ts";
import UserInterface from "../interfaces/UserInterface.ts";
import {UserPreview} from "../components/Users/UserPreview.tsx";

export const Users = () => {
    const currentUserContext = useContext(UserContext);

    const [users, setUsers] = useState<UserInterface[]>([]);

    useEffect(() => {
        if (currentUserContext) {
            currentUserContext.checkTokenStatus();
            getUsers(currentUserContext.accessToken)
                .then(data => setUsers(data.users))
                .catch(error => console.error("Error fetching users", error));
        }
    }, [currentUserContext]);

    return (
        <>
            <h1 className="text-2xl font-bold">Users</h1>
            {!users ?
                (<div>Loading Users</div>)
                :
                (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {users.map((user) => (
                        <UserPreview key={user.username} user={user}/>
                    ))}
                </div>)
            }
        </>
    );
};