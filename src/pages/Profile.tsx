import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import User from "../interfaces/User.ts";
import {getUser, updateUser} from "../services/API.ts";

export const Profile = () => {
    const currentUserContext = useContext(UserContext);
    const [user, setUser] = useState<User>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        if (currentUserContext && currentUserContext.user && currentUserContext.accessToken) {
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
                return {...prevUser, [name]: value}
            }
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else {
            setConfirmNewPassword(value);
        }
    };

    const submitUserUpdate = () => {
        if (!user || !currentUserContext)
            return;
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match');
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
                }, (data) => alert(data.message))
        } else {
            updateUser(user, currentUserContext.accessToken ?? "")
                .then(data => {
                    setUser(data.user);
                    currentUserContext.setUser(data.user);
                    alert("Successfully Updated!");
                }, (data) => alert(data.message))
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold">User Profile</h1>
            {(!currentUserContext || !user) &&
                <div>Loading Profile</div>}
            {currentUserContext && user &&
                <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full p-2 mt-1 border rounded bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Display Name</label>
                        <input
                            type="text"
                            name="display_name"
                            value={user.display_name}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">About</label>
                        <textarea
                            name="about"
                            value={user.about}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 border rounded"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={handlePasswordChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                    <button
                        onClick={submitUserUpdate}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Update
                    </button>
                </div>
            }
        </>
    );
}