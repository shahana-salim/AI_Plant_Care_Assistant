import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Journal() {
    const [entries, setEntries] = useState([]);
    const [plants, setPlants] = useState([]);

    const [plantId, setPlantId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [journalResponse, plantResponse] = await Promise.all([
                axios.get("/api/journal", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }),
                axios.get("/api/plants", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            ]);

            setEntries(journalResponse.data.entries || []);
            setPlants(plantResponse.data.plants || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load journal data."
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

    const resetForm = () => {
        setPlantId("");
        setTitle("");
        setContent("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (editingId) {
                await axios.put(
                    `/api/journal/${editingId}`,
                    {
                        title,
                        content
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                await axios.post(
                    "/api/journal",
                    {
                        plantId,
                        title,
                        content
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            resetForm();
            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save journal entry."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setEditingId(entry._id);
        setTitle(entry.title);
        setContent(entry.content);
        setPlantId(entry.plantId?._id || entry.plantId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this journal entry?")) {
            return;
        }

        try {
            await axios.delete(
                `/api/journal/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete journal entry."
            );
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

                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
                            📔
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Plant Journal
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Record observations, growth and important
                                updates about your plants.
                            </p>
                        </div>

                    </div>

                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Add / Edit Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 mb-10">

                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId
                                    ? "Edit Journal Entry"
                                    : "Create Journal Entry"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {editingId
                                    ? "Update your journal entry."
                                    : "Write down what you observed about your plant."}
                            </p>
                        </div>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {!editingId && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Plant
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
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. New leaves appeared"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Observation
                            </label>

                            <textarea
                                placeholder="Write about your plant..."
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                required
                                rows="5"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                        >
                            {loading
                                ? "Saving..."
                                : editingId
                                    ? "Update Entry"
                                    : "Add Entry"}
                        </button>

                    </form>

                </div>

                {/* Entries */}
                <section>

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Your Entries
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                {entries.length}{" "}
                                {entries.length === 1
                                    ? "entry"
                                    : "entries"}{" "}
                                recorded
                            </p>
                        </div>

                    </div>

                    {entries.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-dashed border-green-200 p-12 text-center">

                            <div className="text-5xl mb-4">
                                📖
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">
                                Your journal is empty
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create your first entry to start tracking
                                your plant's progress.
                            </p>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {entries.map((entry) => (
                                <article
                                    key={entry._id}
                                    className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>
                                            <h3 className="text-xl font-bold text-green-700">
                                                {entry.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                🌱{" "}
                                                {entry.plantId?.name ||
                                                    "Unknown plant"}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 text-sm">
                                            <button
                                                onClick={() =>
                                                    handleEdit(entry)
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(entry._id)
                                                }
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                    </div>

                                    <div className="border-t border-gray-100 my-4"></div>

                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {entry.content}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-5">
                                        {new Date(entry.createdAt).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true
                                        })}
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

export default Journal;