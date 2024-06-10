import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import {getUser, unfollowUser, followUser, updateUserNote, getUserGroups} from "../services/API.ts";
import UserInterface from "../interfaces/UserInterface.ts";
import {useParams} from "react-router-dom";
import {GroupPreview} from "../components/Groups/GroupPreview.tsx";
import GroupInterface from "../interfaces/GroupInterface.ts";

export const User = () => {
    const currentUserContext = useContext(UserContext);
    const {username} = useParams();

    const [user, setUser] = useState<UserInterface>();
    const [groups, setGroups] = useState<GroupInterface[]>();
    const [editingNote, setEditingNote] = useState(false);
    const [note, setNote] = useState(user?.contact?.note || '');

    useEffect(() => {
        if (currentUserContext && currentUserContext.accessToken && username) {
            currentUserContext.checkTokenStatus();
            getUser(username, currentUserContext.accessToken)
                .then(data => setUser(data.user))
                .catch(error => console.error("Error fetching user", error));
            getUserGroups(username, currentUserContext.accessToken)
                .then(data => setGroups(data.groups))
                .catch(error => console.error("Error fetching groups", error));
        }
    }, [currentUserContext, username]);

    const handleFollowToggle = () => {
        if (currentUserContext && currentUserContext.accessToken && user) {
            if (user.contact) {
                unfollowUser(user.username, currentUserContext.accessToken)
                    .then(data => {
                        setUser(data.user)
                    })
                    .catch(error => console.error("Error updating user", error));
            } else {
                followUser(user.username, currentUserContext.accessToken)
                    .then(data => setUser(data.user))
                    .catch(error => console.error("Error updating user", error));
            }
        }

    };

    const handleEditNote = () => {
        if (currentUserContext && currentUserContext.accessToken && user) {
            if (editingNote) {
                updateUserNote(user.username, note, currentUserContext.accessToken)
                    .then(data => setUser(data.user))
                    .catch(error => console.error("Error updating user", error));
            }
            setEditingNote(!editingNote);
        }
    }

    return (
        <>
            {!user &&
                <div>
                    <h1 className="text-2xl font-bold">{username}</h1>
                    Loading User
                </div>}
            {user &&
                <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
                    <div className="flex items-center mb-4">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.display_name} className="w-24 h-24 rounded-full mr-4"/>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                                <span className="text-gray-500 text-xl">{user.display_name.charAt(0)}</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">{user.display_name}</h1>
                            <p className="text-gray-500 italic">{user.username}</p>
                            {user.contact ? (
                                <button
                                    onClick={handleFollowToggle}
                                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Follow
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-700 mb-4">{user.about}</p>
                    {user.contact && (
                        <div className="border-t pt-4">
                            <p className="text-gray-600">
                                <strong>Note:</strong> {user.contact.note}
                            </p>
                            <p className="text-gray-600">
                                <strong>Friends:</strong> {user.contact.friends ? 'Yes' : 'No'}
                            </p>
                            <div className="mt-4">
                                {editingNote ? (
                                    <>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
                                        <button
                                            onClick={handleEditNote}
                                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        >
                                            Save Note
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditNote}
                                        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    >
                                        Edit Note
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            }
            {!groups &&
                <div>Loading Groups</div>}
            {groups &&
                <div className="mx-auto p-4">
                    <h2 className="text-xl font-bold">Groups</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                        {groups.map((group) => (
                            <GroupPreview key={group.id} group={group}/>
                        ))}
                    </div>
                </div>
            }
        </>
    );
};