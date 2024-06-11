import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import EventInterface from "../interfaces/EventInterface.ts";
import {getEvent, joinEvent, leaveEvent} from "../services/API.ts";
import {GroupPreview} from "../components/Groups/GroupPreview.tsx";
import {UserPreview} from "../components/Users/UserPreview.tsx";

export const Event = () => {
    const currentUserContext = useContext(UserContext);
    const {event_id} = useParams();

    const [event, setEvent] = useState<EventInterface>();
    const [visibility, setVisibility] = useState("");
    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && event_id) {
            currentUserContext.checkTokenStatus();
            getEvent(+event_id, currentUserContext.accessToken)
                .then(data => {
                    setEvent(data.event);
                    switch (data.event.visibility) {
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
    }, [currentUserContext, event_id]);

    const handleJoinRequest = () => {
        if (currentUserContext && currentUserContext.accessToken && event) {
            if (event.user_status !== undefined) {
                leaveEvent(event.id, currentUserContext.accessToken)
                    .then(data => {
                        setEvent(prevState => {
                            if (prevState) {
                                const newState = {...prevState}
                                newState.user_status = data.event_user.status;
                                return newState;
                            }
                            return prevState;
                        })
                    })
                    .catch(error => console.error("Error updating event", error));
            } else {
                joinEvent(event.id, currentUserContext.accessToken)
                    .then(data => {
                        setEvent(prevState => {
                            if (prevState) {
                                const newState = {...prevState}
                                newState.user_status = data.event_user.status;
                                return newState;
                            }
                            return prevState;
                        })
                    })
                    .catch(error => console.error("Error updating event", error));
            }
        }
    };

    return (
        <>

            {!event &&
                <>
                    <h1 className="text-2xl font-bold">{event_id}</h1>
                    <div>Loading Event</div>
                </>
            }
            {event &&
                <>
                    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                        <div className="flex items-center mb-4">
                            {event.group.avatar ? (
                                <img src={event.group.avatar} alt={event.group.name}
                                     className="w-24 h-24 rounded-full mr-4"/>
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">{event.group.name.charAt(0)}</span>
                                </div>
                            )}
                            <div className="space-x-2">
                                <h1 className="text-3xl font-bold">{visibility} {event.title}</h1>
                                <p className="text-gray-500 italic">Part of {event.group.name}</p>
                                <p className="text-gray-500 italic">Created by {event.creator.display_name}</p>
                                {event.user_status !== undefined ?
                                    (
                                        <button
                                            onClick={handleJoinRequest}
                                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            {event.user_status === 0 ? "Cancel Request" : "Leave Event"}
                                        </button>) : (currentUserContext && currentUserContext.user && currentUserContext.user.id === event.creator.id) ?
                                        <button disabled={true}
                                                className="mt-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-md"
                                        >Cannot Leave Event You Created</button> : (
                                            <button
                                                onClick={handleJoinRequest}
                                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Request To Attend
                                            </button>
                                        )}
                                {(event.user_status && event.user_status > 1) || event.creator.id == currentUserContext?.user?.id &&
                                    <a
                                        href={`/events/${event_id}/invite`}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Add users to group
                                    </a>
                                }
                            </div>
                        </div>
                        <div>
                            <p>{event.description}</p>
                        </div>

                        {event.google_link &&
                            <div className="mt-2"><AddToCalendarButton googleEventUrl={event.google_link}/></div>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto py-4">
                        <div>
                            <h2 className="text-xl font-bold pb-2">Group Info</h2>
                            <GroupPreview group={event.group}/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold pb-2">Creator Info</h2>
                            <UserPreview user={event.creator}/>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

const AddToCalendarButton = ({googleEventUrl}: { googleEventUrl: string }) => {
    return (
        <a
            href={googleEventUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            Add to Google Calendar
        </a>
    );
};