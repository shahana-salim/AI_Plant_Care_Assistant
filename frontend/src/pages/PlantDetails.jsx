import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function PlantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlant = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/plants/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setPlant(response.data.plant);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load plant details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlant();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50">
                <Navbar />

                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-500">
                        Loading plant details...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-green-50">
                <Navbar />

                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <p className="text-red-500 mb-4">
                            {error}
                        </p>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold hover:underline mb-6"
                >
                    ← Back to Dashboard
                </button>

                {/* Plant Header */}
                <div className="bg-linear-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg mb-6">

                    <div className="flex items-center gap-5">

                        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl">
                            🌿
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                {plant.name}
                            </h1>

                            <p className="text-green-100 mt-1">
                                {plant.species ||
                                    "Species not specified"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Care Information */}
                <section>

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Care Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                            <div className="text-3xl mb-4">
                                💧
                            </div>

                            <h3 className="font-bold text-gray-800">
                                Watering
                            </h3>

                            <p className="text-gray-500 mt-2">
                                {plant.careInfo?.wateringFrequency ||
                                    "Not specified"}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                            <div className="text-3xl mb-4">
                                ☀️
                            </div>

                            <h3 className="font-bold text-gray-800">
                                Sunlight
                            </h3>

                            <p className="text-gray-500 mt-2">
                                {plant.careInfo?.sunlight ||
                                    "Not specified"}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
                            <div className="text-3xl mb-4">
                                🌿
                            </div>

                            <h3 className="font-bold text-gray-800">
                                Fertilizer
                            </h3>

                            <p className="text-gray-500 mt-2">
                                {plant.careInfo?.fertilizer ||
                                    "Not specified"}
                            </p>
                        </div>

                    </div>

                </section>

                {/* Actions */}
                <section className="mt-8">

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Plant Care
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <button
                            onClick={() => navigate("/journal")}
                            className="bg-white rounded-2xl border border-green-100 p-6 text-left shadow-sm hover:shadow-lg transition"
                        >
                            <div className="text-3xl mb-3">
                                📔
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Plant Journal
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Record updates about this plant.
                            </p>
                        </button>

                        <button
                            onClick={() => navigate("/reminders")}
                            className="bg-white rounded-2xl border border-green-100 p-6 text-left shadow-sm hover:shadow-lg transition"
                        >
                            <div className="text-3xl mb-3">
                                ⏰
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg">
                                Care Reminders
                            </h3>

                            <p className="text-gray-500 text-sm mt-1">
                                Manage watering and care reminders.
                            </p>
                        </button>

                    </div>

                </section>

            </main>
        </div>
    );
}

export default PlantDetails;