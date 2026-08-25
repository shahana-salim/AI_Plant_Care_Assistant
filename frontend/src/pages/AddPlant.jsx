import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddPlant() {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [wateringFrequency, setWateringFrequency] = useState("");
    const [sunlight, setSunlight] = useState("");
    const [fertilizer, setFertilizer] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:5000/api/plants",
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
                "Failed to add plant."
            );
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Add a Plant 🌱
                </h1>

                <p className="text-gray-500 mb-6">
                    Add your plant and its basic care information.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Plant name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Species (optional)"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Watering frequency"
                        value={wateringFrequency}
                        onChange={(e) => setWateringFrequency(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Sunlight requirements"
                        value={sunlight}
                        onChange={(e) => setSunlight(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Fertilizer information"
                        value={fertilizer}
                        onChange={(e) => setFertilizer(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <div className="flex gap-3 pt-2">

                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Add Plant
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            </div>

        </div>
    );
}

export default AddPlant;