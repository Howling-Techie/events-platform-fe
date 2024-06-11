import UserInterface, {EventUserInterface} from "../../interfaces/UserInterface.ts";
import {FaUser, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaUserTimes, FaUserShield} from 'react-icons/fa';
import {useState} from "react";

interface EventUserManagerProps {
    eventUsers: EventUserInterface[];
    onApproveRequest: (userId: number) => void;
    onDenyRequest: (userId: number) => void;
    onKickUser: (userId: number) => void;
    onPromoteToModerator: (userId: number) => void;
    onDemoteToUser: (userId: number) => void;
}

export const EventUserManager = ({
                                     eventUsers,
                                     onApproveRequest,
                                     onDenyRequest,
                                     onKickUser,
                                     onPromoteToModerator,
                                     onDemoteToUser,
                                 }: EventUserManagerProps) => {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<keyof UserInterface | 'user_access'>('username');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: keyof UserInterface | 'user_access') => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const getStatusIcon = (accessLevel: number) => {
        switch (accessLevel) {
            case 0:
                return (<><FaUser className="text-gray-500 inline"/> Requested Access</>);
            case 1:
                return (<><FaUser className="text-green-500 inline"/> Approved</>);
            case 2:
                return (<><FaUserShield className="text-blue-500 inline"/> Moderator</>);
            case 3:
                return (<><FaUserShield className="text-yellow-500 inline"/> Event Creator</>);
            default:
                return null;
        }
    };

    const filteredUsers = eventUsers.filter((eventUser) =>
        eventUser.user.username.toLowerCase().includes(search.toLowerCase()) ||
        eventUser.user.display_name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a.user[sortKey as keyof UserInterface] || a[sortKey as 'status'];
        const bValue = b.user[sortKey as keyof UserInterface] || b[sortKey as 'status'];

        if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Event Users</h1>
            <input
                type="text"
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-4 border rounded-md"
            />
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort('avatar')}>Avatar</th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort('username')}>Username</th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort('display_name')}>Display Name
                    </th>
                    <th className="border p-2 cursor-pointer" onClick={() => handleSort('user_access')}>Status
                    </th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedUsers.map((eventUser) => (
                    <tr key={eventUser.user.id} className="text-center">
                        <td className="border p-2">
                            {eventUser.user.avatar ? (
                                <img src={eventUser.user.avatar} alt="Avatar" className="w-8 h-8 rounded-full mx-auto"/>
                            ) : (
                                <FaUser className="text-gray-500 w-8 h-8 mx-auto"/>
                            )}
                        </td>
                        <td className="border p-2">{eventUser.user.username}</td>
                        <td className="border p-2">{eventUser.user.display_name}</td>
                        <td className="border p-2">{getStatusIcon(eventUser.status.status)}</td>
                        <td className="border p-2">
                            {eventUser.status.status === 0 && (
                                <>
                                    <button
                                        className="bg-green-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onApproveRequest(eventUser.user.id)}
                                    >
                                        <FaCheck/>
                                    </button>
                                    <button
                                        className="bg-red-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onDenyRequest(eventUser.user.id)}
                                    >
                                        <FaTimes/>
                                    </button>
                                </>
                            )}
                            {eventUser.status.status === 1 && (
                                <>
                                    <button
                                        className="bg-red-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onKickUser(eventUser.user.id)}
                                    >
                                        <FaUserTimes/>
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onPromoteToModerator(eventUser.user.id)}
                                    >
                                        <FaArrowUp/>
                                    </button>
                                </>
                            )}
                            {eventUser.status.status === 2 && (
                                <>
                                    <button
                                        className="bg-red-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onKickUser(eventUser.user.id)}
                                    >
                                        <FaUserTimes/>
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white p-1 rounded-md mx-1"
                                        onClick={() => onDemoteToUser(eventUser.user.id)}
                                    >
                                        <FaArrowDown/>
                                    </button>
                                </>
                            )}
                            {eventUser.status.status === 3 && (
                                <span className="text-gray-500">Owner</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};