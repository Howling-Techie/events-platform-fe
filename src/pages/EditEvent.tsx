import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {getEvent, updateEvent} from "../services/API.ts";
import EventInterface from "../interfaces/EventInterface.ts";

export const EditEvent = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();
    const {event_id} = useParams();

    const [event, setEvent] = useState<EventInterface>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [visibility, setVisibility] = useState(0);
    const [pastStartTime, setPastStartTime] = useState(false);

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && event_id) {
            currentUserContext.checkTokenStatus();
            getEvent(+event_id, currentUserContext.accessToken)
                .then((data) => {
                    setEvent(data.event);
                    setTitle(data.event.title);
                    setDescription(data.event.description);
                    setLocation(data.event.location || "");
                    setStartTime(data.event.start_time.replace("Z", ""));
                    setVisibility(data.event.visibility);
                    setPastStartTime(new Date(data.event.start_time) < new Date());
                })
                .catch(error => console.error("Error fetching event", error));
        }
    }, [currentUserContext, event_id]);

    const handleUpdateEvent = () => {
        if (!event || !currentUserContext || !currentUserContext.accessToken)
            return;
        if (!title.trim()) {
            alert('Title cannot be empty');
            return;
        }

        if (new Date(startTime) < new Date()) {
            alert('Event start time must be in the future');
            return;
        }

        const updatedEvent: EventInterface = {
            ...event,
            title,
            start_time: startTime,
            description,
            location,
            visibility,
        };
        updateEvent(updatedEvent, currentUserContext.accessToken)
            .then(() => {
                alert('Event updated successfully');
                navigate(`/events/${event_id}`);
            })
            .catch(error => console.error("Error updating event", error));
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Edit Event</h1>
            {event && <>
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
                        disabled={pastStartTime}
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
                    onClick={handleUpdateEvent}
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                    Update
                </button>
            </>}
        </div>
    );
};