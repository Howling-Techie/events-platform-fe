import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import GroupInterface from "../interfaces/GroupInterface.ts";
import {getGroups} from "../services/API.ts";
import {GroupPreview} from "../components/Groups/GroupPreview.tsx";

export const Groups = () => {
    const currentUserContext = useContext(UserContext);

    const [groups, setGroups] = useState<GroupInterface[]>([]);

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken) {
            currentUserContext.checkTokenStatus()
            getGroups(currentUserContext.accessToken)
                .then(data => setGroups(data.groups))
                .catch(error => console.error("Error fetching groups", error));
        }
    }, [currentUserContext]);

    return (
        <>
            <div className="flex flex-row space-x-2 align-middle">
                <h1 className="flex items-center mb-1 text-2xl font-bold">Groups</h1>
                <a
                    href={`/groups/new`}
                    className="flex m-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Create a Group
                </a>
            </div>
            {groups.length === 0 &&
                <div>Loading Groups</div>}
            {groups &&
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {groups.map((group) => (
                        <GroupPreview key={group.id} group={group}/>
                    ))}
                </div>
            }
        </>
    );
};