import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddPlant() {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [wateringFrequency, setWateringFrequency] = useState("");
    const [sunlight, setSunlight] = useState("");
    const [fertilizer, setFertilizer] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                "/api/plants",
                {
                    name,
                    species,
                    careInfo: {
                        wateringFrequency,
                        sunlight,
                        fertilizer
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add plant. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold hover:underline mb-6"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-500 p-8 text-white">

                        <div className="flex items-center gap-4">

                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
                                🌱
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold">
                                    Add a New Plant
                                </h1>

                                <p className="text-green-100 mt-1">
                                    Add your plant and its care information.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Form */}
                    <div className="p-8">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Plant Name *
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Money Plant"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Species
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Epipremnum aureum"
                                    value={species}
                                    onChange={(e) =>
                                        setSpecies(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-6">

                                <h2 className="text-xl font-bold text-gray-800 mb-1">
                                    Care Information
                                </h2>

                                <p className="text-sm text-gray-500 mb-5">
                                    You can add these details now or leave
                                    them blank and update them later.
                                </p>

                                <div className="space-y-5">

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            💧 Watering Frequency
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="e.g. Every 7 days"
                                            value={wateringFrequency}
                                            onChange={(e) =>
                                                setWateringFrequency(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            ☀️ Sunlight Requirements
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="e.g. Bright indirect light"
                                            value={sunlight}
                                            onChange={(e) =>
                                                setSunlight(e.target.value)
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            🌿 Fertilizer Information
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="e.g. Once a month"
                                            value={fertilizer}
                                            onChange={(e) =>
                                                setFertilizer(e.target.value)
                                            }
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                                >
                                    {loading
                                        ? "Adding Plant..."
                                        : "Add Plant 🌱"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AddPlant;