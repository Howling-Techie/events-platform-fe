import GroupInterface from "../../interfaces/GroupInterface.ts";

interface GroupPreviewProps {
    group: GroupInterface;
}

export const GroupPreview = ({group}: GroupPreviewProps) => {
    return (
        <a
            className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-md cursor-pointer"
            href={`/groups/${group.id}`}
        >
            <div className="flex items-center mb-4">
                {group.avatar ? (
                    <img src={group.avatar} alt={group.name} className="w-16 h-16 rounded-full mr-4"/>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">{group.name.charAt(0)}</span>
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold">{group.name}</h3>
                </div>
            </div>
            <p className="text-gray-600 text-sm text-center line-clamp-2">{group.about}</p>
        </a>
    );
};