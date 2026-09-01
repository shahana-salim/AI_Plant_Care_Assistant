import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EditPlant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        species: "",
        wateringFrequency: "",
        sunlight: "",
        fertilizer: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

                const plant = response.data.plant;

                setFormData({
                    name: plant.name || "",
                    species: plant.species || "",
                    wateringFrequency:
                        plant.careInfo?.wateringFrequency || "",
                    sunlight:
                        plant.careInfo?.sunlight || "",
                    fertilizer:
                        plant.careInfo?.fertilizer || ""
                });
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
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Plant name is required.");
            return;
        }

        const token = localStorage.getItem("token");

        setSaving(true);
        setError("");

        try {
            await axios.put(
                `http://localhost:5000/api/plants/${id}`,
                {
                    name: formData.name.trim(),
                    species: formData.species.trim(),
                    careInfo: {
                        wateringFrequency:
                            formData.wateringFrequency.trim(),
                        sunlight:
                            formData.sunlight.trim(),
                        fertilizer:
                            formData.fertilizer.trim()
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate(`/plants/${id}`);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update plant."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50">
                <Navbar />

                <div className="flex justify-center py-20">
                    <p className="text-gray-500">
                        Loading plant...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-3xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate(`/plants/${id}`)}
                    className="text-green-700 font-semibold hover:underline mb-6"
                >
                    ← Back to Plant
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8">

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Edit Plant
                    </h1>

                    <p className="text-gray-500 mb-8">
                        Update your plant's information and care details.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Plant Name */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Plant Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Species */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Species
                            </label>

                            <input
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                placeholder="e.g. Epipremnum aureum"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Watering */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Watering Frequency
                            </label>

                            <input
                                type="text"
                                name="wateringFrequency"
                                value={formData.wateringFrequency}
                                onChange={handleChange}
                                placeholder="e.g. Once every 7-10 days"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Sunlight */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Sunlight
                            </label>

                            <input
                                type="text"
                                name="sunlight"
                                value={formData.sunlight}
                                onChange={handleChange}
                                placeholder="e.g. Bright indirect sunlight"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Fertilizer */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Fertilizer
                            </label>

                            <input
                                type="text"
                                name="fertilizer"
                                value={formData.fertilizer}
                                onChange={handleChange}
                                placeholder="e.g. Balanced fertilizer once a month"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/plants/${id}`)
                                }
                                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default EditPlant;