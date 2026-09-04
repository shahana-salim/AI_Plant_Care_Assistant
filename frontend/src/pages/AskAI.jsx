import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";

function AskAI() {
    const [plants, setPlants] = useState([]);
    const [plantId, setPlantId] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchPlants = async () => {
            try {
                const response = await axios.get(
                    "/api/plants",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setPlants(response.data.plants || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load your plants."
                );
            }
        };

        fetchPlants();
    }, []);

    const handleAsk = async (e) => {
        e.preventDefault();

        setError("");
        setAnswer("");

        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "/api/ai/ask",
                {
                    question: question.trim(),
                    plantId: plantId || undefined
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAnswer(response.data.answer || "");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to get an answer from AI."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">

            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold hover:underline mb-6"
                >
                    ← Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl">
                            🤖
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Ask Plant AI
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Ask questions about plant care, health,
                                watering, sunlight and more.
                            </p>
                        </div>

                    </div>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Question Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8">

                    <form
                        onSubmit={handleAsk}
                        className="space-y-6"
                    >

                        {/* Plant */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ask about a specific plant
                            </label>

                            <select
                                value={plantId}
                                onChange={(e) =>
                                    setPlantId(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">
                                    General plant-care question
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

                        {/* Question */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Your Question
                            </label>

                            <textarea
                                value={question}
                                onChange={(e) =>
                                    setQuestion(e.target.value)
                                }
                                placeholder="For example: Why are the leaves of my plant turning yellow?"
                                rows="6"
                                maxLength="1000"
                                className="w-full border border-gray-200 rounded-2xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <p className="text-xs text-gray-400 text-right mt-2">
                                {question.length}/1000
                            </p>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                        >
                            {loading
                                ? "AI is thinking..."
                                : "Ask AI 🤖"}
                        </button>

                    </form>

                </div>

                {/* Answer */}
                {answer && (
                    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">

                        <div className="bg-green-600 px-6 py-4 text-white">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                    🤖
                                </div>

                                <div>
                                    <p className="font-bold">
                                        Plant AI
                                    </p>

                                    <p className="text-xs text-green-100">
                                        AI-generated plant-care guidance
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div className="p-6">

                            {plantId && (
                                <div className="bg-green-50 rounded-xl px-4 py-3 mb-5">

                                    <p className="text-xs text-green-600 font-semibold">
                                        ANSWERING ABOUT
                                    </p>

                                    <p className="text-sm font-semibold text-gray-700 mt-1">
                                        {plants.find(
                                            (plant) =>
                                                plant._id === plantId
                                        )?.name || "Selected plant"}
                                    </p>

                                </div>
                            )}

                            <div className="text-gray-700 text-base leading-8">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => (
                                            <h1 className="text-2xl font-bold text-gray-800 mt-8 mb-5">
                                                {children}
                                            </h1>
                                        ),

                                        h2: ({ children }) => (
                                            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
                                                {children}
                                            </h2>
                                        ),

                                        h3: ({ children }) => (
                                            <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">
                                                {children}
                                            </h3>
                                        ),

                                        p: ({ children }) => (
                                            <p className="mb-5 leading-8">
                                                {children}
                                            </p>
                                        ),

                                        ul: ({ children }) => (
                                            <ul className="list-disc pl-7 mb-6 space-y-3">
                                                {children}
                                            </ul>
                                        ),

                                        ol: ({ children }) => (
                                            <ol className="list-decimal pl-7 mb-6 space-y-3">
                                                {children}
                                            </ol>
                                        ),

                                        li: ({ children }) => (
                                            <li className="pl-2 leading-8">
                                                {children}
                                            </li>
                                        ),

                                        strong: ({ children }) => (
                                            <strong className="font-bold text-gray-800">
                                                {children}
                                            </strong>
                                        ),

                                        em: ({ children }) => (
                                            <em className="italic">
                                                {children}
                                            </em>
                                        ),

                                        hr: () => (
                                            <hr className="my-8 border-gray-200" />
                                        )
                                    }}
                                >
                                    {answer}
                                </ReactMarkdown>
                            </div>

                        </div>

                    </div>
                )}

                {/* Suggested Questions */}
                <div className="mt-8">

                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        💡 Try asking
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {[
                            "How often should I water my plant?",
                            "Why are my leaves turning yellow?",
                            "How much sunlight does my plant need?",
                            "What should I do if I see pests?"
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() =>
                                    setQuestion(suggestion)
                                }
                                className="text-left bg-white border border-green-100 rounded-xl p-4 text-sm text-gray-600 hover:border-green-400 hover:bg-green-50 transition"
                            >
                                {suggestion}
                            </button>
                        ))}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AskAI;