import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {createEvent, getGroups} from "../services/API.ts";
import {useNavigate} from "react-router-dom";
import GroupInterface from "../interfaces/GroupInterface.ts";

export const NewEvent = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();

    const [groups, setGroups] = useState<GroupInterface[]>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isFree, setIsFree] = useState(true);
    const [price, setPrice] = useState<number>(0);
    const [payWhatYouWant, setPayWhatYouWant] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [visibility, setVisibility] = useState(0);
    const [group, setGroup] = useState(0);

    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded) {
            if (!currentUserContext.user) {
                navigate(`/error?code=401&message=You must be logged in to view this page`);
            }
            currentUserContext.checkTokenStatus();
            getGroups(currentUserContext.accessToken)
                .then(data => {
                    const groupData = data.groups.filter(g => g.owner_id === currentUserContext.user?.id || g.user_access_level && g.user_access_level > 2);
                    if (groupData.length === 0) {
                        navigate(`/error?code=401&message=You must be at least a moderator in at least one group to create an event`);
                    }
                    setGroups(groupData);
                    setGroup(groupData[0].id);
                })
                .catch(error => console.error("Error fetching groups", error));
        }
    }, [currentUserContext, navigate]);

    const handleCreateEvent = () => {
        if (!title.trim()) {
            alert("Event title cannot be empty");
            return;
        }

        if (startTime.length < 1 || new Date(startTime) <= new Date()) {
            alert("Event start time must be in the future");
            return;
        }
        const newEvent = {
            title,
            description,
            visibility,
            location,
            start_time: startTime,
            group_id: group,
            price: isFree ? 0 : price,
            pay_what_you_want: payWhatYouWant,
        };

        // Go to new event page after creating the event
        if (currentUserContext && currentUserContext.accessToken) {
            createEvent(newEvent, currentUserContext.accessToken)
                .then(data => navigate(`/events/${data.event.id}`))
                .catch(error => console.error("Error creating event", error));
        }

    };

    return (
        <div className="max-w-xl min-w-full mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Create New Event</h1>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter event title"
                    aria-label="Event Title"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Describe your event"
                    aria-label="Event Description"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="visibility" className="block text-gray-700 font-bold mb-2">
                    Visibility
                </label>
                <select
                    id="visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(+e.target.value)}
                    className="w-full p-2 border rounded-md"
                    aria-label="Event Visibility"
                >
                    <option value={0}>Public</option>
                    <option value={1}>Users Require Approval</option>
                    <option value={2}>Invite Only</option>
                </select>
            </div>
            {!groups ? (
                <div className="mb-4">
                    <label htmlFor="group" className="block text-gray-700 font-bold mb-2">
                        Group
                    </label>
                    <select
                        id="group"
                        value={group}
                        onChange={(e) => setGroup(+e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled
                        aria-label="Loading Groups"
                    >
                        <option value={0}>Loading Groups...</option>
                    </select>
                </div>
            ) : (
                <div className="mb-4">
                    <label htmlFor="group" className="block text-gray-700 font-bold mb-2">
                        Group
                    </label>
                    <select
                        id="group"
                        value={group}
                        onChange={(e) => setGroup(+e.target.value)}
                        className="w-full p-2 border rounded-md"
                        aria-label="Select Group"
                    >
                        {groups.map((g) => (
                            <option value={g.id} key={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                    Location
                </label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter event location"
                    aria-label="Event Location"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="isFree" className="block text-gray-700 font-bold mb-2">
                    Is the Event Free?
                </label>
                <input
                    id="isFree"
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="isFree" className="text-gray-700">
                    Yes
                </label>
            </div>
            {!isFree && (
                <>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
                            Event Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter event price"
                            aria-label="Event Price"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="payWhatYouWant" className="block text-gray-700 font-bold mb-2">
                            Allow Pay What You Want?
                        </label>
                        <input
                            id="payWhatYouWant"
                            type="checkbox"
                            checked={payWhatYouWant}
                            onChange={(e) => setPayWhatYouWant(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="payWhatYouWant" className="text-gray-700">
                            Yes
                        </label>
                    </div>
                </>
            )}
            <div className="mb-4">
                <label htmlFor="startTime" className="block text-gray-700 font-bold mb-2">
                    Event Start Time
                </label>
                <input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    aria-label="Event Start Time"
                />
            </div>
            <button
                onClick={handleCreateEvent}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                aria-label="Create Event Button"
            >
                Create Event
            </button>
        </div>
    );
};