import {Link} from "react-router-dom";
import {UserContext} from "../contexts/UserContext.tsx";
import {useContext, useState} from "react";

export const NavBar = () => {
    const currentUserContext = useContext(UserContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="bg-gray-100 p-4 flex justify-between items-center">
            <div className="flex justify-start">
                <Link to="/" className="text-2xl font-bold">Eventful</Link>
            </div>
            <div className="flex justify-start flex-grow collapse md:visible">
                <Link to="/" className="ml-8 text-black hover:bg-gray-200 p-2 rounded">
                    Home
                </Link>
                <Link to="/groups" className="text-black hover:bg-gray-200 p-2 rounded">
                    Groups
                </Link>
                <Link to="/events" className="text-black hover:bg-gray-200 p-2 rounded">
                    Events
                </Link>
            </div>
            <div className="flex justify-end">
                {currentUserContext && currentUserContext.user &&
                    <div className="rounded hover:cursor-pointer"
                         onMouseEnter={() => setIsProfileOpen(true)}
                         onMouseLeave={() => setIsProfileOpen(false)}>
                        <div className="text-black hover:bg-gray-200 p-2 rounded">
                            {currentUserContext.user.display_name}
                        </div>
                        {isProfileOpen && (
                            <div className="absolute bg-white border border-gray-300 py-2 rounded shadow-lg z-10">
                                <Link
                                    to={`/profile`}
                                    key="profile"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to={`/signout`}
                                    key="signout"
                                    className="block px-4 py-2 hover:bg-gray-200"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Sign Out
                                </Link>
                            </div>
                        )}
                    </div>}
                {currentUserContext && !currentUserContext.user &&
                    <Link to="/signin" className="text-black hover:bg-gray-200 p-2 rounded">Sign In</Link>}
            </div>
        </nav>
    );
};
