import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import UserInterface from "../interfaces/UserInterface.ts";
import {getEvent, insertEventUser, searchGroupUsers} from "../services/API.ts";
import {useParams} from "react-router-dom";
import EventInterface from "../interfaces/EventInterface.ts";

export const EventInvites = () => {
    const currentUserContext = useContext(UserContext);
    const {event_id} = useParams();

    const [event, setEvent] = useState<EventInterface>();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserInterface[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && event_id) {
            currentUserContext.checkTokenStatus();
            getEvent(+event_id, currentUserContext.accessToken)
                .then(data => {
                    setEvent(data.event);
                });
        }
    }, [currentUserContext, event_id]);

    const handleSearch = async () => {
        if (currentUserContext && currentUserContext.accessToken && event) {
            const results = await searchGroupUsers(event.group.id, searchTerm, currentUserContext.accessToken);
            setSearchResults(results.users.map(u => u.user));
        }
    };

    const toggleUserSelection = (userId: number) => {
        const newSelectedUsers = new Set(selectedUsers);
        if (newSelectedUsers.has(userId)) {
            newSelectedUsers.delete(userId);
        } else {
            newSelectedUsers.add(userId);
        }
        setSelectedUsers(newSelectedUsers);
    };

    const handleAddUsersToEvent = async () => {
        if (currentUserContext && currentUserContext.accessToken && event_id) {
            for (const userId of selectedUsers) {
                await insertEventUser(userId, +event_id, 1, currentUserContext.accessToken);
            }
            setSelectedUsers(new Set());
            setSearchResults([]);
            setSearchTerm("");
            alert("Selected users have been added to the event");
        }
    };

    return (
        <section className="p-4">
            <h1 className="text-2xl font-bold mb-4">Invite Users to Event</h1>
            <div className="mb-4">
                <label htmlFor="user-search" className="sr-only">Search for users</label>
                <input
                    id="user-search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for users..."
                    className="border border-gray-300 rounded p-2 mr-2"
                    aria-label="Search for users"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Search"
                >
                    Search
                </button>
            </div>
            <div className="mb-4">
                <ul>
                    {searchResults.map((user) => (
                        <li key={user.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`user-${user.id}`}
                                checked={selectedUsers.has(user.id)}
                                onChange={() => toggleUserSelection(user.id)}
                                className="mr-2"
                                aria-labelledby={`user-label-${user.id}`}
                            />
                            {user.avatar && (
                                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full mr-2"/>
                            )}
                            <label htmlFor={`user-${user.id}`} id={`user-label-${user.id}`}
                                   className="flex items-center">
                                <div className="font-bold">{user.display_name}</div>
                                <div className="text-gray-500 italic">@{user.username}</div>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedUsers.size > 0 && (
                <button
                    onClick={handleAddUsersToEvent}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    aria-label="Add Selected Users to Event"
                >
                    Add Selected Users to Event
                </button>
            )}
        </section>
    );
};