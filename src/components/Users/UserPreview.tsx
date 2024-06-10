import UserInterface from "../../interfaces/UserInterface.ts";

interface UserPreviewProps {
    user: UserInterface;
}

export const UserPreview = ({user}: UserPreviewProps) => {
    return (
        <a
            className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-md cursor-pointer"
            href={`/users/${user.username}`}
        >
            <div className="flex items-center mb-4">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.display_name} className="w-16 h-16 rounded-full mr-4"/>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">{user.display_name.charAt(0)}</span>
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold">{user.display_name}</h3>
                    <p className="text-gray-500 italic">{user.username}</p>
                </div>
            </div>
            <p className="text-gray-600 text-sm text-center line-clamp-2">{user.about}</p>
        </a>
    );
};