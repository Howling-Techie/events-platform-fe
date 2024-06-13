import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {deleteEventUser, getEvent, getEventUsers, updateEvent, updateEventUser} from "../services/API.ts";
import EventInterface from "../interfaces/EventInterface.ts";
import {EventUserInterface} from "../interfaces/UserInterface.ts";
import {EventUserManager} from "../components/Events/EventUserManager.tsx";

export const EditEvent = () => {
    const currentUserContext = useContext(UserContext);
    const navigate = useNavigate();
    const {event_id} = useParams();

    const [event, setEvent] = useState<EventInterface>();
    const [eventUsers, setEventUsers] = useState<EventUserInterface[]>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [visibility, setVisibility] = useState(0);
    const [pastStartTime, setPastStartTime] = useState(false);

    useEffect(() => {
        if (currentUserContext && event_id) {
            currentUserContext.checkTokenStatus();
            getEvent(+event_id, currentUserContext.accessToken)
                .then((data) => {
                    if (!data.event.status || data.event.status.status < 2) {
                        navigate(`/error?code=401&message="You are not authorised to view this page"`);
                    }
                    setEvent(data.event);
                    setTitle(data.event.title);
                    setDescription(data.event.description);
                    setLocation(data.event.location || "");
                    setStartTime(data.event.start_time.replace("Z", ""));
                    setVisibility(data.event.visibility);
                    setPastStartTime(new Date(data.event.start_time) < new Date());
                })
                .catch(error => {
                    navigate(`/error?code=${error.status}&message=${error.data.msg}`);
                });
            getEventUsers(+event_id, currentUserContext.accessToken)
                .then((data) => {
                    setEventUsers(data.users);
                })
                .catch(error => alert(`Error getting users: ${error.data.msg}`));
        }
    }, [currentUserContext, event_id, navigate]);

    const handleUpdateEvent = () => {
        if (!event || !currentUserContext || !currentUserContext.accessToken)
            return;
        if (!title.trim()) {
            alert("Title cannot be empty");
            return;
        }

        if (new Date(startTime) < new Date()) {
            alert("Event start time must be in the future");
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
                alert("Event updated successfully");
                navigate(`/events/${event_id}`);
            })
            .catch(error => alert(`Error updating event: ${error.data.msg}`));
    };

    const handleApproveRequest = (userId: number) => {
        if (!currentUserContext || !currentUserContext.accessToken || !event)
            return;
        updateEventUser(userId, event.id, 1, currentUserContext.accessToken).then(data => {
            setEventUsers(prevState => {
                if (prevState) {
                    const newState = [...prevState];
                    const userIndex = newState.findIndex(u => u.user.id == userId);
                    newState[userIndex] = {
                        ...newState[userIndex],
                        status: data.status
                    };
                    return newState;
                }
            });
        })
            .catch(error => alert(`Error updating user: ${error.data.msg}`));
    };

    const handleDenyRequest = (userId: number) => {
        if (!currentUserContext || !currentUserContext.accessToken || !event)
            return;
        deleteEventUser(userId, event.id, currentUserContext.accessToken).then(() => {
            setEventUsers(prevState => {
                if (prevState) {
                    const newState = [...prevState];
                    const userIndex = newState.findIndex(u => u.user.id == userId);
                    newState.splice(userIndex, 1);
                    return newState;
                }
            });
        })
            .catch(error => alert(`Error updating user: ${error.data.msg}`));
    };

    const handleKickUser = (userId: number) => {
        if (!currentUserContext || !currentUserContext.accessToken || !event)
            return;
        deleteEventUser(userId, event.id, currentUserContext.accessToken).then(() => {
            setEventUsers(prevState => {
                if (prevState) {
                    const newState = [...prevState];
                    const userIndex = newState.findIndex(u => u.user.id == userId);
                    newState.splice(userIndex, 1);
                    return newState;
                }
            });
        })
            .catch(error => alert(`Error updating user: ${error.data.msg}`));
    };

    const handlePromoteToModerator = (userId: number) => {
        if (!currentUserContext || !currentUserContext.accessToken || !event)
            return;
        updateEventUser(userId, event.id, 2, currentUserContext.accessToken).then(data => {
            setEventUsers(prevState => {
                if (prevState) {
                    const newState = [...prevState];
                    const userIndex = newState.findIndex(u => u.user.id == userId);
                    newState[userIndex] = {
                        ...newState[userIndex],
                        status: data.status
                    };
                    return newState;
                }
            });
        })
            .catch(error => alert(`Error updating user: ${error.data.msg}`));
    };

    const handleDemoteToUser = (userId: number) => {
        if (!currentUserContext || !currentUserContext.accessToken || !event)
            return;
        updateEventUser(userId, event.id, 1, currentUserContext.accessToken).then(data => {
            setEventUsers(prevState => {
                if (prevState) {
                    const newState = [...prevState];
                    const userIndex = newState.findIndex(u => u.user.id == userId);
                    newState[userIndex] = {
                        ...newState[userIndex],
                        status: data.status
                    };
                    return newState;
                }
            });
        })
            .catch(error => alert(`Error updating user: ${error.data.msg}`));
    };

    return (
        <>
            <section className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Edit Event</h1>
                {event && (
                    <form>
                        <fieldset className="mb-4">
                            <legend className="block text-gray-700 font-bold mb-2" id="title-legend">
                                Title
                            </legend>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter event title"
                                aria-labelledby="title-legend"
                            />
                        </fieldset>
                        <fieldset className="mb-4">
                            <legend className="block text-gray-700 font-bold mb-2" id="description-legend">
                                Description
                            </legend>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Describe your event"
                                aria-labelledby="description-legend"
                            />
                        </fieldset>
                        <fieldset className="mb-4">
                            <legend className="block text-gray-700 font-bold mb-2" id="location-legend">
                                Location
                            </legend>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter event location"
                                aria-labelledby="location-legend"
                            />
                        </fieldset>
                        <fieldset className="mb-4">
                            <legend className="block text-gray-700 font-bold mb-2" id="startTime-legend">
                                Event Start Time
                            </legend>
                            <input
                                id="startTime"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                disabled={pastStartTime}
                                aria-labelledby="startTime-legend"
                            />
                        </fieldset>
                        <fieldset className="mb-4">
                            <legend className="block text-gray-700 font-bold mb-2" id="visibility-legend">
                                Visibility
                            </legend>
                            <select
                                id="visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(+e.target.value)}
                                className="w-full p-2 border rounded-md"
                                aria-labelledby="visibility-legend"
                            >
                                <option value={0}>Public</option>
                                <option value={1}>Users Require Approval</option>
                                <option value={2}>Invite Only</option>
                            </select>
                        </fieldset>
                        <button
                            type="button"
                            onClick={handleUpdateEvent}
                            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                            aria-label="Update Event"
                        >
                            Update
                        </button>
                    </form>
                )}
            </section>
            {eventUsers && (
                <section className="mt-2">
                    <EventUserManager
                        eventUsers={eventUsers}
                        onApproveRequest={handleApproveRequest}
                        onDenyRequest={handleDenyRequest}
                        onKickUser={handleKickUser}
                        onPromoteToModerator={handlePromoteToModerator}
                        onDemoteToUser={handleDemoteToUser}
                    />
                </section>
            )}
        </>

    );
};