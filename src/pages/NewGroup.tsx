import {useContext, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {createGroup} from "../services/API.ts";
import {useNavigate} from "react-router-dom";

export const NewGroup = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState('');
    const [about, setAbout] = useState('');
    const [visibility, setVisibility] = useState(0);

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            alert('Group name cannot be empty');
            return;
        }
        const newGroup = {
            name: groupName,
            about,
            visibility,
        };

        // Go to new group page after creating the group
        if (currentUserContext && currentUserContext.accessToken) {
            createGroup(newGroup, currentUserContext.accessToken)
                .then(data => navigate(`/groups/${data.group.id}`))
                .catch(error => console.error("Error creating group", error));
        }

    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Create New Group</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="groupName">
                    Group Name
                </label>
                <input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter group name"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="about">
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
                onClick={handleCreateGroup}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Create Group
            </button>
        </div>
    );
};