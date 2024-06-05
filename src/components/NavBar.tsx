import {Link} from "react-router-dom";

export const NavBar = () => {

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
                <Link to="/signin" className="text-black hover:bg-gray-200 p-2 rounded">Sign In</Link>
            </div>
        </nav>
    );
};
