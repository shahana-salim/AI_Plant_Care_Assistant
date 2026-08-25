import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));

        const fetchPlants = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/plants",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setPlants(response.data.plants);
            } catch (error) {
                console.error("Failed to fetch plants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-green-50">

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                    <h1 className="text-2xl font-bold text-green-700">
                        🌱 Plant Care Assistant
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>

                </div>
            </header>

            {/* Main */}
            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Welcome, {user?.name}! 🌿
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Take care of your plants and keep track of their health.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    <button
                        onClick={() => navigate("/plants/add")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-left"
                    >
                        <div className="text-3xl mb-3">🌱</div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Add Plant
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Add a new plant to your collection.
                        </p>
                    </button>

                    <button
                        onClick={() => navigate("/journal")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-left"
                    >
                        <div className="text-3xl mb-3">📔</div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Plant Journal
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Record and track your plant growth.
                        </p>
                    </button>

                    <button
                        onClick={() => navigate("/disease")}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-left"
                    >
                        <div className="text-3xl mb-3">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Disease Analysis
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Analyze plant health and diseases.
                        </p>
                    </button>

                </div>

                {/* Plants */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        My Plants
                    </h2>

                    {loading ? (
                        <p className="text-gray-500">Loading plants...</p>
                    ) : plants.length === 0 ? (
                        <div className="bg-white rounded-2xl p-8 text-center shadow">
                            <p className="text-gray-500">
                                You haven't added any plants yet.
                            </p>

                            <button
                                onClick={() => navigate("/plants/add")}
                                className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                            >
                                Add Your First Plant
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plants.map((plant) => (
                                <div
                                    key={plant._id}
                                    onClick={() => navigate(`/plants/${plant._id}`)}
                                    className="bg-white rounded-2xl shadow p-5 cursor-pointer hover:shadow-lg transition"
                                >
                                    <h3 className="text-xl font-semibold text-green-700">
                                        {plant.name}
                                    </h3>

                                    {plant.species && (
                                        <p className="text-gray-500 mt-1">
                                            {plant.species}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}

export default Dashboard;