import {useContext, useEffect, useState} from "react";
import EventInterface from "../interfaces/EventInterface.ts";
import {getEvents} from "../services/API.ts";
import {EventPreview} from "../components/Events/EventPreview.tsx";
import {UserContext} from "../contexts/UserContext.tsx";

export const Events = () => {
    const currentUserContext = useContext(UserContext);

    const [events, setEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken) {
            currentUserContext.checkTokenStatus();
            getEvents(currentUserContext.accessToken)
                .then(data => setEvents(data.events))
                .catch(error => console.error("Error fetching events", error));
        }
    }, [currentUserContext]);

    return (
        <>
            <div className="flex flex-row space-x-2 align-middle">
                <h1 className="flex items-center mb-1 text-2xl font-bold">Events</h1>
                <a
                    href={`/events/new`}
                    className="flex m-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Create an Event
                </a>
            </div>
            {events.length === 0 &&
                <div>Loading Events</div>}
            {events &&
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {events.map((event) => (
                        <EventPreview key={event.id} event={event}/>
                    ))}
                </div>
            }
        </>
    );
};