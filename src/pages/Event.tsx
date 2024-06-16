import {Link, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import EventInterface from "../interfaces/EventInterface.ts";
import {getEvent, joinEvent, leaveEvent, updateEventPayment} from "../services/API.ts";
import {GroupPreview} from "../components/Groups/GroupPreview.tsx";
import {UserPreview} from "../components/Users/UserPreview.tsx";
import {EventPayment} from "../components/Events/EventPayment.tsx";

export const Event = () => {
    const currentUserContext = useContext(UserContext);
    const {event_id} = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<EventInterface>();
    const [visibility, setVisibility] = useState("");
    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded && event_id) {
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
                .catch(error => {
                    navigate(`/error?code=${error.status}&message=${error.data.msg}`);
                });
        }
    }, [currentUserContext, event_id, navigate]);

    const handleJoinRequest = () => {
        if (currentUserContext && currentUserContext.accessToken && event) {
            if (event.status !== undefined) {
                leaveEvent(event.id, currentUserContext.accessToken)
                    .then(data => {
                        setEvent(prevState => {
                            if (prevState) {
                                const newState = {...prevState};
                                newState.status = data.event_user.status;
                                return newState;
                            }
                            return prevState;
                        });
                    })
                    .catch(error => console.error("Error updating event", error));
            } else {
                joinEvent(event.id, currentUserContext.accessToken)
                    .then(data => {
                        setEvent(prevState => {
                            if (prevState) {
                                const newState = {...prevState};
                                newState.status = {
                                    status: data.event_user.status,
                                    paid: data.event_user.paid,
                                    amount_paid: data.event_user.amount_paid
                                };
                                return newState;
                            }
                            return prevState;
                        });
                    })
                    .catch(error => console.error("Error updating event", error));
            }
        }
    };

    const handleSuccessfulPayment = async (amount: number) => {
        if (currentUserContext && currentUserContext.user && currentUserContext.accessToken && event_id) {
            const userStatusResult = await updateEventPayment(currentUserContext.user.id, +event_id, amount, currentUserContext.accessToken);
            setEvent(prevState => {
                if (prevState) {
                    const newState = {...prevState};
                    newState.status = userStatusResult.event_user;
                    return newState;
                }
                return prevState;
            });
        }
    };

    return (
        <>
            {!event && (
                <>
                    <h1 className="text-2xl font-bold">{event_id}</h1>
                    <div>Loading Event</div>
                </>
            )}
            {event && (
                <>
                    <section className="w-full max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                        <header className="flex items-center mb-4">
                            {event.group.avatar ? (
                                <img
                                    src={event.group.avatar}
                                    alt={event.group.name}
                                    className="w-24 h-24 rounded-full mr-4"
                                />
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                    <span className="text-gray-500 text-xl">{event.group.name.charAt(0)}</span>
                                </div>
                            )}
                            <div className="flex flex-col flex-grow">
                                <h1 className="text-3xl font-bold">
                                    {visibility} {event.title}
                                </h1>
                                <p className="text-gray-500 italic">
                                    When: {new Date(event.start_time).toLocaleDateString()}{" "}
                                    {new Date(event.start_time).toLocaleTimeString()}
                                </p>
                                {event.location && (
                                    <p className="text-gray-500 italic">Where: {event.location}</p>
                                )}
                                {event.status && event.status.status >= 0 && event.status.status < 3 ? (
                                    <button
                                        onClick={handleJoinRequest}
                                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        aria-label={
                                            event.status.status === 0
                                                ? "Cancel Request"
                                                : "Leave Event"
                                        }
                                    >
                                        {event.status.status === 0 ? "Cancel Request" : "Leave Event"}
                                    </button>
                                ) : event.status && event.status.status === 3 ? (
                                    <button
                                        disabled
                                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-md"
                                    >
                                        Cannot Leave Event You Created
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleJoinRequest}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        aria-label="Request To Attend"
                                    >
                                        Request To Attend
                                    </button>
                                )}
                                {event.status && event.status.status > 1 && (
                                    <div className="flex-wrap md:space-x-2 grid grid-cols-1 md:grid-cols-2"><Link
                                        to={`/events/${event_id}/invite`}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex justify-center"
                                        aria-label="Add users to event"
                                    >
                                        Add users to event
                                    </Link>
                                        <Link
                                            to={`/events/${event_id}/edit`}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex justify-center"
                                            aria-label="Edit event"
                                        >
                                            Edit event
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </header>
                        <article>
                            <p>{event.description}</p>
                        </article>
                        {event.google_link && (
                            <div className="mt-2">
                                <AddToCalendarButton googleEventUrl={event.google_link}/>
                            </div>
                        )}
                    </section>
                    {(event.price > 0 || event.pay_what_you_want) &&
                        event.status &&
                        !event.status.paid &&
                        currentUserContext &&
                        currentUserContext.user &&
                        event.status.status >= 1 && (
                            <section className="max-w-2xl mx-auto p-4 mt-4 bg-white shadow-md rounded-lg min-w-full">
                                <EventPayment
                                    eventId={event.id}
                                    price={event.price}
                                    userId={currentUserContext.user.id}
                                    payWhatYouWant={event.pay_what_you_want}
                                    confirmPayment={handleSuccessfulPayment}
                                />
                            </section>
                        )}
                    {event.status && event.status.paid && (
                        <section
                            className="max-w-2xl mx-auto p-4 mt-4 bg-white shadow-md rounded-lg divide-y space-y-2">
                            <p className="text-2xl font-bold">You're good to go!</p>
                            <p>
                                We've received your payment of{" "}
                                <span className="font-semibold">£{event.status.amount_paid}</span>!
                            </p>
                        </section>
                    )}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto py-4 w-full">
                        <article>
                            <h2 className="text-xl font-bold pb-2">Group Info</h2>
                            <GroupPreview group={event.group}/>
                        </article>
                        <article>
                            <h2 className="text-xl font-bold pb-2">Creator Info</h2>
                            <UserPreview user={event.creator}/>
                        </article>
                    </section>
                </>
            )}
        </>
    );
};

const AddToCalendarButton = ({googleEventUrl}: { googleEventUrl: string }) => {
    return (
        <a
            href={googleEventUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Add to Google Calendar"
        >
            Add to Google Calendar
        </a>
    );
};