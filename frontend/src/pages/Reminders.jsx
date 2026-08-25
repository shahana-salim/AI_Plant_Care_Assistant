import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Reminders() {
    const [reminders, setReminders] = useState([]);
    const [plants, setPlants] = useState([]);

    const [plantId, setPlantId] = useState("");
    const [type, setType] = useState("watering");
    const [date, setDate] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            const [reminderResponse, plantResponse] = await Promise.all([
                axios.get("http://localhost:5000/api/reminders", {
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

            setReminders(reminderResponse.data.reminders);
            setPlants(plantResponse.data.plants);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load reminders."
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
                    `http://localhost:5000/api/reminders/${editingId}`,
                    {
                        type,
                        date,
                        status
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/reminders",
                    {
                        plantId,
                        type,
                        date
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }

            resetForm();
            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save reminder."
            );
        }
    };

    const resetForm = () => {
        setPlantId("");
        setType("watering");
        setDate("");
        setStatus("pending");
        setEditingId(null);
    };

    const handleEdit = (reminder) => {
        setEditingId(reminder._id);
        setType(reminder.type);
        setDate(
            reminder.date
                ? new Date(reminder.date).toISOString().slice(0, 16)
                : ""
        );
        setStatus(reminder.status || "pending");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this reminder?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/reminders/${id}`,
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
                "Failed to delete reminder."
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
                    Plant Reminders ⏰
                </h1>

                <p className="text-gray-600 mb-8">
                    Keep track of watering and other plant care tasks.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Add / Edit Reminder */}
                <div className="bg-white rounded-2xl shadow p-6 mb-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {editingId
                            ? "Edit Reminder"
                            : "Add Reminder"}
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

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <option value="watering">
                                💧 Watering
                            </option>
                            <option value="fertilizing">
                                🌿 Fertilizing
                            </option>
                            <option value="repotting">
                                🪴 Repotting
                            </option>
                            <option value="other">
                                📌 Other
                            </option>
                        </select>

                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />

                        {editingId && (
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            >
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="completed">
                                    Completed
                                </option>
                            </select>
                        )}

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                            >
                                {editingId
                                    ? "Update Reminder"
                                    : "Add Reminder"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>
                </div>

                {/* Reminder List */}
                <div className="space-y-4">

                    {reminders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 text-center">
                            <p className="text-gray-500">
                                No reminders yet.
                            </p>
                        </div>
                    ) : (
                        reminders.map((reminder) => (
                            <div
                                key={reminder._id}
                                className="bg-white rounded-2xl shadow p-6"
                            >
                                <div className="flex justify-between items-start gap-4">

                                    <div>
                                        <h3 className="text-xl font-semibold text-green-700 capitalize">
                                            {reminder.type}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            Plant:{" "}
                                            {reminder.plantId?.name ||
                                                "Unknown plant"}
                                        </p>

                                        <p className="text-gray-500 mt-1">
                                            📅{" "}
                                            {new Date(
                                                reminder.date
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            reminder.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {reminder.status || "pending"}
                                    </span>

                                </div>

                                <div className="flex gap-4 mt-4">

                                    <button
                                        onClick={() =>
                                            handleEdit(reminder)
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(reminder._id)
                                        }
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
}

export default Reminders;