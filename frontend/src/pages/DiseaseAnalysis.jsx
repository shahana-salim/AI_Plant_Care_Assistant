import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function DiseaseAnalysis() {
    const [plants, setPlants] = useState([]);
    const [analyses, setAnalyses] = useState([]);

    const [analysisType, setAnalysisType] = useState("myPlant");
    const [plantId, setPlantId] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [plantsResponse, analysesResponse] = await Promise.all([
                axios.get("/api/plants", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get("/api/disease", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setPlants(plantsResponse.data.plants || []);
            setAnalyses(analysesResponse.data.analyses || []);
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

    const handleTypeChange = (type) => {
        setAnalysisType(type);
        setPlantId("");
        setResult(null);
        setError("");
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (!selectedImage) {
            return;
        }

        if (!selectedImage.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (selectedImage.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB.");
            return;
        }

        setError("");
        setImage(selectedImage);
        setPreview(URL.createObjectURL(selectedImage));
        setResult(null);
    };

    const resetUpload = () => {
        setImage(null);
        setPreview("");

        const fileInput =
            document.getElementById("plant-image");

        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();

        setError("");
        setResult(null);

        if (analysisType === "myPlant" && !plantId) {
            setError("Please select a plant.");
            return;
        }

        if (!image) {
            setError("Please upload a plant image.");
            return;
        }

        const formData = new FormData();

        if (analysisType === "myPlant") {
            formData.append("plantId", plantId);
        }

        formData.append("image", image);

        setLoading(true);

        try {
            const response = await axios.post(
                "/api/disease/analyze",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResult({
                ...response.data.analysis,
                symptoms: response.data.symptoms,
                registeredPlant: response.data.registeredPlant
            });

            resetUpload();

            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to analyze the plant image."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlants = async () => {
        if (!result) {
            return;
        }

        try {
            setLoading(true);
            setError("");

            // First create the plant
            const response = await axios.post(
                "/api/plants",
                {
                    name: result.plantName || "My New Plant",
                    species: result.plantSpecies || ""
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const newPlant = response.data.plant;

            // Then link the existing disease analysis
            // to the newly created plant.
            await axios.patch(
                `/api/disease/${result._id}/link`,
                {
                    plantId: newPlant._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPlants((previousPlants) => [
                ...previousPlants,
                newPlant
            ]);

            setAnalysisType("myPlant");
            setPlantId(newPlant._id);

            setResult({
                ...result,
                registeredPlant: true,
                plantId: newPlant._id,
                plantName: newPlant.name
            });

            await fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add plant to your collection."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold hover:underline mb-6"
                >
                    ← Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-3xl">
                            🔍
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                AI Disease Analysis
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Upload a plant image and let AI analyze
                                its health.
                            </p>
                        </div>

                    </div>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Analysis Type */}
                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 mb-6">

                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        What would you like to analyze?
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Analyze a plant already in your collection or
                        check a new plant.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <button
                            type="button"
                            onClick={() =>
                                handleTypeChange("myPlant")
                            }
                            className={`p-5 rounded-2xl border-2 text-left transition ${analysisType === "myPlant"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                                }`}
                        >
                            <div className="text-3xl mb-3">
                                🌱
                            </div>

                            <h3 className="font-bold text-gray-800">
                                My Plant
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Analyze a plant already added to your
                                collection.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleTypeChange("newPlant")
                            }
                            className={`p-5 rounded-2xl border-2 text-left transition ${analysisType === "newPlant"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                                }`}
                        >
                            <div className="text-3xl mb-3">
                                🪴
                            </div>

                            <h3 className="font-bold text-gray-800">
                                New / Unregistered Plant
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Analyze a plant that isn't in your
                                collection yet.
                            </p>
                        </button>

                    </div>

                </div>

                {/* Upload */}
                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 mb-10">

                    <form
                        onSubmit={handleAnalyze}
                        className="space-y-6"
                    >

                        {analysisType === "myPlant" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Plant
                                </label>

                                <select
                                    value={plantId}
                                    onChange={(e) =>
                                        setPlantId(e.target.value)
                                    }
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">
                                        Choose a plant
                                    </option>

                                    {plants.map((plant) => (
                                        <option
                                            key={plant._id}
                                            value={plant._id}
                                        >
                                            {plant.name}
                                            {plant.species
                                                ? ` — ${plant.species}`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Plant Image
                            </label>

                            <label
                                htmlFor="plant-image"
                                className="block cursor-pointer"
                            >
                                <div className="border-2 border-dashed border-green-200 rounded-2xl p-8 text-center hover:border-green-400 hover:bg-green-50 transition">

                                    {preview ? (
                                        <div>
                                            <img
                                                src={preview}
                                                alt="Plant preview"
                                                className="max-h-72 mx-auto rounded-xl object-contain"
                                            />

                                            <p className="text-sm text-green-600 font-medium mt-4">
                                                Image selected — click
                                                to choose another
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-5xl mb-3">
                                                📷
                                            </div>

                                            <p className="font-semibold text-gray-700">
                                                Upload a plant image
                                            </p>

                                            <p className="text-sm text-gray-400 mt-2">
                                                JPG, PNG or other image
                                                files • Maximum 5 MB
                                            </p>
                                        </>
                                    )}

                                </div>
                            </label>

                            <input
                                id="plant-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                        >
                            {loading
                                ? "AI is analyzing your plant..."
                                : "Analyze Plant 🔍"}
                        </button>

                    </form>

                </div>

                {/* Result */}
                {result && (
                    <section className="mb-10">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Analysis Result
                        </h2>

                        <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">

                            <div className="bg-linear-to-r from-green-600 to-emerald-500 p-6 text-white">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    <div>
                                        <p className="text-green-100 text-sm">
                                            Plant
                                        </p>

                                        <h3 className="text-2xl font-bold mt-1">
                                            {result.plantName ||
                                                "Unknown Plant"}
                                        </h3>

                                        <p className="text-green-100 mt-3">
                                            Detected condition:{" "}
                                            <span className="font-semibold text-white">
                                                {result.disease}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                                        <p className="text-xs text-green-100">
                                            Confidence
                                        </p>

                                        <p className="text-2xl font-bold">
                                            {result.confidence}%
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="p-6 space-y-6">

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">
                                        🌿 Symptoms
                                    </h4>

                                    <p className="text-gray-600 leading-relaxed">
                                        {result.symptoms ||
                                            "No symptoms were provided."}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-6">

                                    <h4 className="font-bold text-gray-800 mb-2">
                                        💡 Recommendation
                                    </h4>

                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {result.recommendation ||
                                            "No recommendation was provided."}
                                    </p>

                                </div>

                                {!result.registeredPlant && (
                                    <div className="border-t border-gray-100 pt-6">

                                        <div className="bg-green-50 rounded-2xl p-5">

                                            <h4 className="font-bold text-gray-800">
                                                Add this plant to your collection?
                                            </h4>

                                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                                Save this plant so you can
                                                manage it and track future
                                                health analyses.
                                            </p>

                                            <button
                                                onClick={handleAddToPlants}
                                                disabled={loading}
                                                className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                                            >
                                                {loading
                                                    ? "Adding..."
                                                    : "Add to My Plants 🌱"}
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </section>
                )}

                {/* History */}
                <section>

                    <div className="mb-5">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Analysis History
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {analyses.length}{" "}
                            {analyses.length === 1
                                ? "analysis"
                                : "analyses"}{" "}
                            recorded
                        </p>

                    </div>

                    {analyses.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-dashed border-green-200 p-12 text-center">

                            <div className="text-5xl mb-4">
                                🌿
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">
                                No analyses yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Upload a plant image to get your first
                                AI-powered analysis.
                            </p>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {analyses.map((analysis) => (
                                <article
                                    key={analysis._id}
                                    className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>
                                            <h3 className="text-xl font-bold text-green-700">
                                                {analysis.disease}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                🌱{" "}
                                                {analysis.plantId?.name ||
                                                    analysis.plantName ||
                                                    "Unknown plant"}
                                            </p>
                                        </div>

                                        {analysis.confidence !==
                                            undefined && (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {analysis.confidence}%
                                                </span>
                                            )}

                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {analysis.recommendation ||
                                            "No recommendation available."}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-4">
                                        {analysis.createdAt
                                            ? new Date(analysis.createdAt).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true
                                            })
                                            : "Unknown date"}
                                    </p>

                                </article>
                            ))}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default DiseaseAnalysis;