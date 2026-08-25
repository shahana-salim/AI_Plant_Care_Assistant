import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function PlantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlant = async () => {
            const token = localStorage.getItem("token");

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
                    "Failed to load plant."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlant();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading plant...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 px-6 py-10">

            <div className="max-w-3xl mx-auto">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold mb-6 hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-green-700">
                        {plant.name} 🌱
                    </h1>

                    {plant.species && (
                        <p className="text-gray-500 mt-1">
                            {plant.species}
                        </p>
                    )}

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-700">
                                💧 Watering
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {plant.careInfo?.wateringFrequency ||
                                    "Not specified"}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-700">
                                ☀️ Sunlight
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {plant.careInfo?.sunlight ||
                                    "Not specified"}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-700">
                                🌿 Fertilizer
                            </h3>
                            <p className="text-gray-600 mt-2">
                                {plant.careInfo?.fertilizer ||
                                    "Not specified"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PlantDetails;