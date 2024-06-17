import {useContext, useEffect, useState} from "react";
import EventInterface from "../interfaces/EventInterface.ts";
import {getUserEvents} from "../services/API.ts";
import {EventPreview} from "../components/Events/EventPreview.tsx";
import {UserContext} from "../contexts/UserContext.tsx";
import {Link} from "react-router-dom";

export const Home = () => {
    const currentUserContext = useContext(UserContext);

    const [events, setEvents] = useState<EventInterface[]>([]);

    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded && currentUserContext.user) {
            currentUserContext.checkTokenStatus();
            getUserEvents(currentUserContext.user.username, currentUserContext.accessToken)
                .then(data => setEvents(data.events))
                .catch(error => console.error("Error fetching events", error));
        }
    }, [currentUserContext]);

    return (
        <>
            {(currentUserContext && currentUserContext.user) &&
                (<div className="space-y-1 divide-y divide-gray-300">
                    {currentUserContext && currentUserContext.user && <div>
                        <h2 className="text-lg font-semibold">Your Events</h2>
                        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {events.filter(g => g.status).map((event) => (
                                <EventPreview key={event.id} event={event}/>
                            ))}
                        </section>
                    </div>
                    }
                </div>)
            }
            <div className="min-w-full bg-gray-100">
                <main className="container mx-auto p-8">
                    <section className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Welcome to Eventful</h2>
                        <p className="text-lg text-gray-700">
                            Your one-stop platform for creating, managing, and signing up for events.
                            Whether you're hosting a free event, a fixed price event, or a flexible price event,
                            Eventful has you covered.
                        </p>
                    </section>
                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">How It Works</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">1. Register</h4>
                                <p className="text-gray-700 mb-4">
                                    Sign up for an account to get started. It only takes a few minutes!
                                </p>
                                <Link to="/signin" className="text-blue-500 hover:underline">Register Now</Link>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">2. Create a Group</h4>
                                <p className="text-gray-700 mb-4">
                                    Organize your events by creating groups. Manage your group members and their
                                    roles.
                                </p>
                                <Link to="/groups/new" className="text-blue-500 hover:underline">Create a
                                    Group</Link>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">3. Create Events</h4>
                                <p className="text-gray-700 mb-4">
                                    Create events for your group. Set a price if needed, and let us handle the
                                    payments.
                                </p>
                                <Link to="/events/new" className="text-blue-500 hover:underline">Create an
                                    Event</Link>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">Google Calendar Integration</h4>
                                <p className="text-gray-700">
                                    Automatically create and display Google Calendar events when you create an
                                    event.
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">Flexible Pricing</h4>
                                <p className="text-gray-700">
                                    Set fixed prices or minimum prices for your events. Users can choose to pay more
                                    if they
                                    wish.
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">Easy Payments</h4>
                                <p className="text-gray-700">
                                    We handle the payments for your events, making it easy for you to collect fees.
                                </p>
                            </div>
                            <div className="bg-white shadow-md rounded-lg p-6">
                                <h4 className="text-xl font-bold mb-2">User Management</h4>
                                <p className="text-gray-700">
                                    Manage group members and their roles efficiently.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Get Started with Eventful</h3>
                        <p className="text-lg text-gray-700 mb-6">
                            Ready to start creating and managing your events? Register now and join the Eventful
                            community!
                        </p>
                        <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Register Now
                        </Link>
                    </section>
                </main>
            </div>
        </>
    );
};