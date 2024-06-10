import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {getGroup, updateGroup} from "../services/API.ts";
import GroupInterface from "../interfaces/GroupInterface.ts";

export const EditGroup = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();
    const {group_id} = useParams();

    const [group, setGroup] = useState<GroupInterface>();
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [visibility, setVisibility] = useState(0);

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && group_id) {
            currentUserContext.checkTokenStatus();
            getGroup(+group_id, currentUserContext.accessToken)
                .then((data) => {
                    setGroup(data.group);
                    setName(data.group.name);
                    setAbout(data.group.about);
                    setVisibility(data.group.visibility);
                })
                .catch(error => console.error("Error fetching group", error));
        }
    }, [currentUserContext, group_id]);

    const handleUpdateGroup = () => {
        if (!group || !currentUserContext || !currentUserContext.accessToken)
            return;
        if (!name.trim()) {
            alert('Name cannot be empty');
            return;
        }

        const updatedGroup: GroupInterface = {
            ...group,
            name,
            about,
            visibility,
        };
        updateGroup(updatedGroup, currentUserContext.accessToken)
            .then(() => {
                alert('Group updated successfully');
                navigate(`/groups/${group_id}`);
            })
            .catch(error => console.error("Error updating group", error));
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Group</h1>
            {group && <>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter group name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                        About
                    </label>
                    <textarea
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Describe your group"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="visibility">
                        Visibility
                    </label>
                    <select
                        id="visibility"
                        value={visibility}
                        onChange={(e) => setVisibility(+e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value={0}>Public</option>
                        <option value={1}>Users Require Approval</option>
                        <option value={2}>Invite Only</option>
                    </select>
                </div>
                <button
                    onClick={handleUpdateGroup}
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                    Update
                </button>
            </>}
        </div>
    );
};