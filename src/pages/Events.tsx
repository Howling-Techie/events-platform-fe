import {useContext, useEffect, useState} from "react";
import EventInterface from "../interfaces/EventInterface.ts";
import {getEvents} from "../services/API.ts";
import {EventPreview} from "../components/Events/EventPreview.tsx";
import {UserContext} from "../contexts/UserContext.tsx";
import {Link} from "react-router-dom";

export const Events = () => {
    const currentUserContext = useContext(UserContext);

    const [events, setEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded) {
            currentUserContext.checkTokenStatus();
            getEvents(currentUserContext.accessToken)
                .then(data => setEvents(data.events))
                .catch(error => console.error("Error fetching events", error));
        }
    }, [currentUserContext]);

    return (
        <>
            <header className="flex flex-row space-x-2 items-center">
                <h1 className="text-2xl font-bold">Events</h1>
                {currentUserContext && currentUserContext.user && <Link
                    to="/events/new"
                    className="m-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Create an Event"
                >
                    Create an Event
                </Link>}
            </header>
            {!events ? (<div>Loading Events</div>)
                : (
                    <div className="space-y-1 divide-y divide-gray-300">
                        {currentUserContext && currentUserContext.user && <div>
                            <h2 className="text-lg font-semibold">Your Events</h2>
                            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                                {events.filter(g => g.status).map((event) => (
                                    <EventPreview key={event.id} event={event}/>
                                ))}
                            </section>
                        </div>
                        }
                        <div>
                            <h2 className="text-lg font-semibold mt-2">Public Events</h2>
                            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                                {events.filter(g => !g.status).map((event) => (
                                    <EventPreview key={event.id} event={event}/>
                                ))}
                            </section>
                        </div>
                    </div>
                )}
        </>
    );
};