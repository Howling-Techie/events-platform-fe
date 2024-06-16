import {Link, useLocation} from "react-router-dom";

export const Error = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorCode = searchParams.get("code") || "Unknown";
    const errorMessage = searchParams.get("message") || "An error occurred.";

    return (
        <div className="flex flex-grow items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full outline outline-1 outline-gray-200">
                <h2 className="text-3xl font-bold text-center mb-4">{errorCode}</h2>
                <p className="text-lg text-center mb-8">{errorMessage}</p>
                <div className="flex justify-center">
                    <Link
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        to={"/"}
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};