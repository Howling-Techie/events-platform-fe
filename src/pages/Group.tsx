import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import GroupInterface from "../interfaces/GroupInterface.ts";
import {getGroup, joinGroup, leaveGroup} from "../services/API.ts";

export const Group = () => {
    const currentUserContext = useContext(UserContext);
    const {group_id} = useParams();

    const [group, setGroup] = useState<GroupInterface>();
    const [visibility, setVisibility] = useState("");
    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && group_id) {
            currentUserContext.checkTokenStatus();
            getGroup(+group_id, currentUserContext.accessToken)
                .then(data => {
                    setGroup(data.group);
                    switch (data.group.visibility) {
                        case 0:
                            setVisibility("📖");
                            break;
                        case 1:
                            setVisibility("📨");
                            break;
                        case 2:
                            setVisibility("🔒");
                            break;
                    }
                })
                .catch(error => console.error("Error fetching user", error));
        }
    }, [currentUserContext, group_id]);

    const handleJoinRequest = () => {
        if (currentUserContext && currentUserContext.accessToken && group) {
            if (group.user_access_level !== undefined) {
                leaveGroup(group.id, currentUserContext.accessToken)
                    .then(data => {
                        setGroup(data.group)
                    })
                    .catch(error => console.error("Error updating group", error));
            } else {
                joinGroup(group.id, currentUserContext.accessToken)
                    .then(data => setGroup(data.group))
                    .catch(error => console.error("Error updating group", error));
            }
        }
    };

    return (
        <>

            {!group &&
                <>
                    <h1 className="text-2xl font-bold">{group_id}</h1>
                    <div>Loading Group</div>
                </>
            }
            {group &&
                <>
                    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-4">
                            {group.avatar ? (
                                <img src={group.avatar} alt={group.name} className="w-24 h-24 rounded-full mr-4"/>
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">{group.name.charAt(0)}</span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold">{visibility} {group.name}</h1>
                                <p className="text-gray-500 italic">Owned by {group.owner.display_name}</p>
                                {group.user_access_level !== undefined ?
                                    (
                                        <button
                                            onClick={handleJoinRequest}
                                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            {group.user_access_level === 0 ? "Cancel Request" : "Leave Group"}
                                        </button>) : (currentUserContext && currentUserContext.user && currentUserContext.user.id === group.owner.id) ?
                                        <button disabled={true}
                                                className="mt-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-md"
                                        >Cannot Leave Group You Own</button> : (
                                            <button
                                                onClick={handleJoinRequest}
                                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Request To Join
                                            </button>
                                        )}
                            </div>
                        </div>
                        <div>
                            <p>{group.about}</p>
                        </div>
                    </div>
                </>
            }
        </>
    );
};