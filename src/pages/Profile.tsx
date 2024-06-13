import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import UserInterface from "../interfaces/UserInterface.ts";
import {getUser, updateUser} from "../services/API.ts";
import {useNavigate} from "react-router-dom";

export const Profile = () => {
    const currentUserContext = useContext(UserContext);
    const [user, setUser] = useState<UserInterface>();
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded) {
            if (!currentUserContext.user) {
                navigate(`/error?code=401&message=You must be logged in to view this page`);
                return;
            }
            currentUserContext.checkTokenStatus();
            getUser(currentUserContext.user.username, currentUserContext.accessToken)
                .then(data => setUser(data.user))
                .catch(error => console.error("Error fetching user", error));
        }
    }, [currentUserContext]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setUser((prevUser) => {
            if (prevUser) {
                return {...prevUser, [name]: value};
            }
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === "newPassword") {
            setNewPassword(value);
        } else {
            setConfirmNewPassword(value);
        }
    };

    const submitUserUpdate = () => {
        if (!user || !currentUserContext)
            return;
        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match");
            return;
        }
        if (newPassword.length > 0) {
            const newUserInfo = {
                password: newPassword,
                ...user
            };
            updateUser(newUserInfo, currentUserContext.accessToken ?? "")
                .then(data => {
                    setUser(data.user);
                    currentUserContext.setUser(data.user);
                    alert("Successfully Updated!");
                }, (data) => alert(data.message));
        } else {
            updateUser(user, currentUserContext.accessToken ?? "")
                .then(data => {
                    setUser(data.user);
                    currentUserContext.setUser(data.user);
                    alert("Successfully Updated!");
                }, (data) => alert(data.message));
        }
    };

    return (
        <form onSubmit={submitUserUpdate} className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <fieldset>
                <legend className="text-3xl font-bold mb-6 text-center">User Profile</legend>

                {!currentUserContext || !user ? (
                    <div>Loading Profile</div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={user.username}
                                disabled
                                className="w-full p-2 mt-1 border rounded bg-gray-100"
                                aria-describedby="usernameHelpText"
                            />
                            <p id="usernameHelpText" className="text-sm text-gray-500">Your username cannot be
                                changed.</p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="displayName" className="block text-gray-700">Display Name</label>
                            <input
                                id="displayName"
                                type="text"
                                name="display_name"
                                value={user.display_name}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded"
                                aria-label="Display Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded"
                                aria-label="Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="about" className="block text-gray-700">About</label>
                            <textarea
                                id="about"
                                name="about"
                                value={user.about}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 border rounded"
                                aria-label="About"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 mt-1 border rounded"
                                aria-label="New Password"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmNewPassword" className="block text-gray-700">Confirm New
                                Password</label>
                            <input
                                id="confirmNewPassword"
                                type="password"
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 mt-1 border rounded"
                                aria-label="Confirm New Password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                            aria-label="Update Profile Button"
                        >
                            Update
                        </button>
                    </>
                )}
            </fieldset>
        </form>
    );
};