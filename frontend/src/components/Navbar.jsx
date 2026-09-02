import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-xl font-bold text-green-700"
                >
                    🌱 Plant Care Assistant
                </button>

                <div className="flex items-center gap-5">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Profile
                    </button>

                    <button
                        onClick={() => navigate("/journal")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Journal
                    </button>

                    <button
                        onClick={() => navigate("/reminders")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Reminders
                    </button>

                    <button
                        onClick={() => navigate("/disease")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Disease Analysis
                    </button>
                    <button
                        onClick={() => navigate("/ask-ai")}
                        className="text-gray-600 hover:text-green-600"
                    >
                        Ask AI
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;