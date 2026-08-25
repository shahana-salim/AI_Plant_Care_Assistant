import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Journal() {
    const [entries, setEntries] = useState([]);
    const [plants, setPlants] = useState([]);

    const [plantId, setPlantId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [journalResponse, plantResponse] = await Promise.all([
                axios.get("http://localhost:5000/api/journal", {
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

            setEntries(journalResponse.data.entries);
            setPlants(plantResponse.data.plants);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/journal/${editingId}`,
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
                    "http://localhost:5000/api/journal",
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

            setPlantId("");
            setTitle("");
            setContent("");
            setEditingId(null);

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save journal entry."
            );
        }
    };

    const handleEdit = (entry) => {
        setEditingId(entry._id);
        setTitle(entry.title);
        setContent(entry.content);
        setPlantId(entry.plantId?._id || entry.plantId);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this journal entry?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/journal/${id}`,
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
        <div className="min-h-screen bg-green-50 px-4 py-8">

            <div className="max-w-6xl mx-auto">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-green-700 font-semibold mb-6 hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Plant Journal 📔
                </h1>

                <p className="text-gray-600 mb-8">
                    Keep track of your plants' growth and care.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Add / Edit Form */}
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {editingId
                            ? "Edit Journal Entry"
                            : "Add Journal Entry"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!editingId && (
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
                        )}

                        <input
                            type="text"
                            placeholder="Journal title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <textarea
                            placeholder="Write about your plant..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="5"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                            >
                                {editingId ? "Update Entry" : "Add Entry"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setPlantId("");
                                        setTitle("");
                                        setContent("");
                                    }}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* Journal Entries */}
                <div className="space-y-4">

                    {entries.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 text-center">
                            <p className="text-gray-500">
                                No journal entries yet.
                            </p>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div
                                key={entry._id}
                                className="bg-white rounded-2xl shadow p-6"
                            >
                                <div className="flex justify-between gap-4">

                                    <div>
                                        <h3 className="text-xl font-semibold text-green-700">
                                            {entry.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Plant:{" "}
                                            {entry.plantId?.name ||
                                                "Unknown plant"}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
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

                                <p className="text-gray-700 mt-4 whitespace-pre-wrap">
                                    {entry.content}
                                </p>

                                <p className="text-xs text-gray-400 mt-4">
                                    {new Date(
                                        entry.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Journal;