import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

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

                setPlants(response.data.plants || []);
            } catch (error) {
                console.error("Failed to fetch plants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlants();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Welcome Section */}
                <section className="bg-linear-to-r from-green-600 to-emerald-500 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-10">

                    <p className="text-green-100 mb-2">
                        Welcome back 👋
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold">
                        {user?.name || "Plant Lover"} 🌱
                    </h1>

                    <p className="mt-3 text-green-50 max-w-2xl">
                        Keep your plants healthy, track their growth,
                        and stay on top of their care.
                    </p>

                    <button
                        onClick={() => navigate("/plants/add")}
                        className="mt-6 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
                    >
                        + Add New Plant
                    </button>

                </section>

                {/* Quick Actions */}
                <section className="mb-10">

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <button
                            onClick={() => navigate("/plants/add")}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-left border border-green-100"
                        >
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-4">
                                🌱
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Add Plant
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Add a new plant to your collection.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/journal")}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-left border border-green-100"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-4">
                                📔
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Plant Journal
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Record your plant's growth and care.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/reminders")}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-left border border-green-100"
                        >
                            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl mb-4">
                                ⏰
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Reminders
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Stay on top of plant care tasks.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/disease")}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-left border border-green-100"
                        >
                            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl mb-4">
                                🔍
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Disease Analysis
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Check your plant's health.
                            </p>
                        </button>

                    </div>

                </section>

                {/* My Plants */}
                <section>

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                My Plants 🌿
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Your personal plant collection
                            </p>
                        </div>

                        {plants.length > 0 && (
                            <button
                                onClick={() => navigate("/plants/add")}
                                className="text-green-600 font-semibold hover:underline"
                            >
                                + Add Plant
                            </button>
                        )}

                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                            <p className="text-gray-500">
                                Loading your plants...
                            </p>
                        </div>
                    ) : plants.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-dashed border-green-200">

                            <div className="text-5xl mb-4">
                                🪴
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">
                                No plants yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Add your first plant and start tracking
                                its care and growth.
                            </p>

                            <button
                                onClick={() => navigate("/plants/add")}
                                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                Add Your First Plant
                            </button>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {plants.map((plant) => (
                                <button
                                    key={plant._id}
                                    onClick={() =>
                                        navigate(`/plants/${plant._id}`)
                                    }
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-left border border-green-100"
                                >

                                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
                                        🌿
                                    </div>

                                    <h3 className="text-xl font-bold text-green-700">
                                        {plant.name}
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        {plant.species || "Plant species not specified"}
                                    </p>

                                    <p className="text-green-600 font-medium text-sm mt-4">
                                        View plant details →
                                    </p>

                                </button>
                            ))}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;