import {useContext, useState} from "react";
import {UserContext} from "../contexts/UserContext.jsx";

export const SignIn = ({toggleForm, showPopup}: {
    toggleForm: (e: React.MouseEvent<HTMLButtonElement>) => void,
    showPopup: (title: string, message: string, type: string, allowClose?: boolean) => void
}) => {
    const [formData, setFormData] = useState({username: "", password: ""});
    const currentUserContext = useContext(UserContext);
    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        showPopup("Please wait", "Signing in...", "info", false);
        const response = await currentUserContext?.signIn(formData.username, formData.password);
        console.log(response);
        if (response?.success) {
            showPopup("Success", "Signing in...", "success", false);
        } else {
            if (response && "message" in response) {
                showPopup("Error", response.message, "error");
            }
        }
    };

    return (
        <article className="max-w-md mx-auto p-6 border rounded shadow-md h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-grow flex-col justify-between">
                <section>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-blue-400 focus:outline-offset-1"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-blue-400 focus:outline-offset-1"
                        />
                    </div>
                </section>
                <section>
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={toggleForm} className="text-blue-500 hover:underline">
                            Register
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Sign In
                        </button>
                    </div>
                </section>
            </form>
        </article>
    );
};