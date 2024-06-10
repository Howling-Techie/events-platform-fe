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
            <h1 className="text-2xl font-bold">Events</h1>
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