import UserInterface, {GroupUserInterface} from "../../interfaces/UserInterface.ts";
import {FaUser, FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaUserTimes, FaUserShield} from "react-icons/fa";
import {useState} from "react";

interface GroupUserManagerProps {
    groupUsers: GroupUserInterface[];
    onApproveRequest: (userId: number) => void;
    onDenyRequest: (userId: number) => void;
    onKickUser: (userId: number) => void;
    onPromoteToModerator: (userId: number) => void;
    onDemoteToUser: (userId: number) => void;
}

export const GroupUserManager = ({
                                     groupUsers,
                                     onApproveRequest,
                                     onDenyRequest,
                                     onKickUser,
                                     onPromoteToModerator,
                                     onDemoteToUser,
                                 }: GroupUserManagerProps) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof UserInterface | "user_access">("username");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const handleSort = (key: keyof UserInterface | "user_access") => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const getStatusIcon = (accessLevel: number) => {
        switch (accessLevel) {
            case 0:
                return <FaUser className="text-gray-500"/>;
            case 1:
                return <FaUser className="text-green-500"/>;
            case 2:
                return <FaUserShield className="text-blue-500"/>;
            case 3:
                return <FaUserShield className="text-yellow-500"/>;
            default:
                return null;
        }
    };

    const filteredUsers = groupUsers.filter((groupUser) =>
        groupUser.user.username.toLowerCase().includes(search.toLowerCase()) ||
        groupUser.user.display_name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a.user[sortKey as keyof UserInterface] || a[sortKey as "user_access_level"];
        const bValue = b.user[sortKey as keyof UserInterface] || b[sortKey as "user_access_level"];

        if (aValue < bValue) {
            return sortOrder === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Group Users</h1>
            <form className="mb-4">
                <label htmlFor="search" className="sr-only">Search users</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Search users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-md"
                />
            </form>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th scope="col" className="border p-2 cursor-pointer"
                            onClick={() => handleSort("avatar")}>Avatar
                        </th>
                        <th scope="col" className="border p-2 cursor-pointer"
                            onClick={() => handleSort("username")}>Username
                        </th>
                        <th scope="col" className="border p-2 cursor-pointer"
                            onClick={() => handleSort("display_name")}>Display Name
                        </th>
                        <th scope="col" className="border p-2 cursor-pointer"
                            onClick={() => handleSort("user_access")}>Status
                        </th>
                        <th scope="col" className="border p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedUsers.map((groupUser) => (
                        <tr key={groupUser.user.id} className="text-center">
                            <td className="border p-2">
                                {groupUser.user.avatar ? (
                                    <img src={groupUser.user.avatar} alt="Avatar"
                                         className="w-8 h-8 rounded-full mx-auto"/>
                                ) : (
                                    <FaUser className="text-gray-500 w-8 h-8 mx-auto"/>
                                )}
                            </td>
                            <td className="border p-2">{groupUser.user.username}</td>
                            <td className="border p-2">{groupUser.user.display_name}</td>
                            <td className="border p-2">{getStatusIcon(groupUser.user_access_level)}</td>
                            <td className="border p-2">
                                {groupUser.user_access_level === 0 && (
                                    <>
                                        <button
                                            className="bg-green-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onApproveRequest(groupUser.user.id)}
                                        >
                                            <FaCheck/>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onDenyRequest(groupUser.user.id)}
                                        >
                                            <FaTimes/>
                                        </button>
                                    </>
                                )}
                                {groupUser.user_access_level === 1 && (
                                    <>
                                        <button
                                            className="bg-red-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onKickUser(groupUser.user.id)}
                                        >
                                            <FaUserTimes/>
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onPromoteToModerator(groupUser.user.id)}
                                        >
                                            <FaArrowUp/>
                                        </button>
                                    </>
                                )}
                                {groupUser.user_access_level === 2 && (
                                    <>
                                        <button
                                            className="bg-red-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onKickUser(groupUser.user.id)}
                                        >
                                            <FaUserTimes/>
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white p-1 rounded-md mx-1"
                                            onClick={() => onDemoteToUser(groupUser.user.id)}
                                        >
                                            <FaArrowDown/>
                                        </button>
                                    </>
                                )}
                                {groupUser.user_access_level === 3 && (
                                    <span className="text-gray-500">Owner</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};