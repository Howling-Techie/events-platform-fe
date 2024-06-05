import {useParams} from "react-router-dom";

export const User = () => {
    const {username} = useParams();

    return (
        <>
            <div className="text-l font-bold text-gray-900">Page Under Construction</div>
            <div className="text-m text-gray-900">Page for user {username}</div>
        </>
    );
};