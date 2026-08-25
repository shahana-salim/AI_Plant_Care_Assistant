import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function DiseaseAnalysis() {
    const [analyses, setAnalyses] = useState([]);
    const [plants, setPlants] = useState([]);

    const [plantId, setPlantId] = useState("");
    const [image, setImage] = useState("");
    const [disease, setDisease] = useState("");
    const [confidence, setConfidence] = useState("");
    const [recommendation, setRecommendation] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [analysisResponse, plantResponse] = await Promise.all([
                axios.get("http://localhost:5000/api/disease", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get("http://localhost:5000/api/plants", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setAnalyses(analysisResponse.data.analyses);
            setPlants(plantResponse.data.plants);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load disease analysis data."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axios.post(
                "http://localhost:5000/api/disease",
                {
                    plantId,
                    image,
                    disease,
                    confidence: Number(confidence),
                    recommendation
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPlantId("");
            setImage("");
            setDisease("");
            setConfidence("");
            setRecommendation("");

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save disease analysis."
            );
        }
    };

    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <Navbar />

            <div className="max-w-6xl mx-auto">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold mb-6 hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Disease Analysis 🔍🌿
                </h1>

                <p className="text-gray-600 mb-8">
                    Analyze your plant and keep a history of previous results.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Analysis Form */}
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Add Analysis Result
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <select
                            value={plantId}
                            onChange={(e) => setPlantId(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <option value="">
                                Select a plant
                            </option>

                            {plants.map((plant) => (
                                <option
                                    key={plant._id}
                                    value={plant._id}
                                >
                                    {plant.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Image filename or image reference"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <input
                            type="text"
                            placeholder="Disease name"
                            value={disease}
                            onChange={(e) => setDisease(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <input
                            type="number"
                            placeholder="Confidence (%)"
                            value={confidence}
                            onChange={(e) => setConfidence(e.target.value)}
                            min="0"
                            max="100"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <textarea
                            placeholder="Recommendation"
                            value={recommendation}
                            onChange={(e) =>
                                setRecommendation(e.target.value)
                            }
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                        >
                            Save Analysis
                        </button>

                    </form>
                </div>

                {/* Analysis History */}
                <div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Analysis History
                    </h2>

                    {analyses.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 text-center">
                            <p className="text-gray-500">
                                No disease analyses yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {analyses.map((analysis) => (
                                <div
                                    key={analysis._id}
                                    className="bg-white rounded-2xl shadow p-6"
                                >
                                    <h3 className="text-xl font-semibold text-green-700">
                                        {analysis.disease}
                                    </h3>

                                    <p className="text-gray-600 mt-2">
                                        Plant:{" "}
                                        {analysis.plantId?.name ||
                                            "Unknown plant"}
                                    </p>

                                    <p className="text-gray-600 mt-1">
                                        Confidence:{" "}
                                        {analysis.confidence ?? "N/A"}%
                                    </p>

                                    <p className="text-gray-700 mt-3">
                                        {analysis.recommendation ||
                                            "No recommendation available."}
                                    </p>

                                    <p className="text-sm text-gray-400 mt-3">
                                        {analysis.image}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default DiseaseAnalysis;