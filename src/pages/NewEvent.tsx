import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {createEvent, getGroups} from "../services/API.ts";
import {useNavigate} from "react-router-dom";
import GroupInterface from "../interfaces/GroupInterface.ts";

export const NewEvent = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();

    const [groups, setGroups] = useState<GroupInterface[]>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [visibility, setVisibility] = useState(0);
    const [group, setGroup] = useState(0);

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && currentUserContext.user) {
            currentUserContext.checkTokenStatus();
            getGroups(currentUserContext.accessToken)
                .then(data => {
                    const groupData = data.groups.filter(g => g.owner_id === currentUserContext.user?.id || g.user_access_level && g.user_access_level > 2)
                    setGroups(groupData);
                    setGroup(groupData[0].id)
                })
                .catch(error => console.error("Error fetching groups", error));
        }
    }, [currentUserContext]);

    const handleCreateEvent = () => {
        if (!title.trim()) {
            alert('Event title cannot be empty');
            return;
        }

        if (startTime.length < 1 || new Date(startTime) <= new Date()) {
            alert('Event start time must be in the future');
            return;
        }
        const newEvent = {
            title,
            description,
            visibility,
            location,
            start_time: startTime,
            group_id: group
        };

        // Go to new event page after creating the event
        if (currentUserContext && currentUserContext.accessToken) {
            createEvent(newEvent, currentUserContext.accessToken)
                .then(data => navigate(`/events/${data.event.id}`))
                .catch(error => console.error("Error creating event", error));
        }

    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Create New Event</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter event title"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Describe your event"
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
            {!groups && <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="visibility">
                    Group
                </label>
                <select
                    id="group"
                    value={group}
                    onChange={(e) => setGroup(+e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={true}
                >
                    <option value={0}>Loading Groups...</option>
                </select>
            </div>}
            {groups && <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="visibility">
                    Group
                </label>
                <select
                    id="group"
                    value={group}
                    onChange={(e) => setGroup(+e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    {groups.map(g =>
                        <option value={g.id} key={g.id}>{g.name}</option>
                    )}
                </select>
            </div>}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="location">
                    Location
                </label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter event location"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="startTime">
                    Event Start Time
                </label>
                <input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>
            <button
                onClick={handleCreateEvent}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Create Event
            </button>
        </div>
    );
};