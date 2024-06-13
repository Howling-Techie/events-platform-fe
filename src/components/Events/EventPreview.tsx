import EventInterface from "../../interfaces/EventInterface.ts";
import {Link} from "react-router-dom";

interface EventPreviewProps {
    event: EventInterface;
}

export const EventPreview = ({event}: EventPreviewProps) => {
    return (
        <Link
            className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-md cursor-pointer"
            to={`/events/${event.id}`}
        >
            <div className="flex items-center mb-4">
                {event.group.avatar ? (
                    <img src={event.group.avatar} alt={event.group.name} className="w-16 h-16 rounded-full mr-4"/>
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">{event.group.name.charAt(0)}</span>
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-gray-500 italic">{(new Date(event.start_time)).toDateString()}</p>
                </div>
            </div>
            <p className="text-gray-600 text-sm text-center line-clamp-2">{event.description}</p>
        </Link>
    );
};