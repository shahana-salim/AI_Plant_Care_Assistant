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
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const enableNotifications = async () => {
        if (!("Notification" in window)) {
            setError("Your browser does not support notifications.");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            setError("");
            new Notification("Plant Care Assistant", {
                body: "Notifications are enabled successfully! 🌱"
            });
        } else if (permission === "denied") {
            setError(
                "Notifications are blocked. Please allow notifications in your browser settings."
            );
        }
    };
    useEffect(() => {
        if (!("Notification" in window)) {
            return;
        }

        const checkReminders = () => {
            if (Notification.permission !== "granted") {
                return;
            }

            const now = new Date();

            const notifiedReminders = JSON.parse(
                localStorage.getItem("notifiedReminders") || "[]"
            );

            reminders.forEach((reminder) => {
                if (
                    reminder.status !== "pending" ||
                    !reminder.date ||
                    notifiedReminders.includes(reminder._id)
                ) {
                    return;
                }

                const reminderTime = new Date(reminder.date);

                if (reminderTime <= now) {
                    const plantName =
                        reminder.plantId?.name || "your plant";

                    let taskName;

                    if (reminder.type === "other") {
                        taskName =
                            reminder.description || "plant care task";
                    } else if (reminder.type === "watering") {
                        taskName = "water";
                    } else if (reminder.type === "fertilizing") {
                        taskName = "fertilize";
                    } else if (reminder.type === "repotting") {
                        taskName = "repot";
                    } else {
                        taskName = "complete your plant care task";
                    }

                    new Notification("🌱 Plant Care Reminder", {
                        body: `Time to ${taskName} your ${plantName}.`,
                        icon: "/favicon.ico"
                    });

                    notifiedReminders.push(reminder._id);

                    localStorage.setItem(
                        "notifiedReminders",
                        JSON.stringify(notifiedReminders)
                    );
                }
            });
        };

        checkReminders();

        const interval = setInterval(
            checkReminders,
            15000
        );

        return () => clearInterval(interval);
    }, [reminders]);

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

            setReminders(reminderResponse.data.reminders || []);
            setPlants(plantResponse.data.plants || []);
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

    const resetForm = () => {
        setPlantId("");
        setType("watering");
        setDescription("");
        setDate("");
        setStatus("pending");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (type === "other" && !description.trim()) {
            setError("Please describe the task");
            return;
        }

        if (new Date(date) <= new Date()) {
            setError("Reminder date and time must be in the future");
            return;
        }

        setLoading(true);

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/reminders/${editingId}`,
                    {
                        type,
                        description,
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
                        description,
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
            await fetchData();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save reminder."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (reminder) => {
        setEditingId(reminder._id);
        setType(reminder.type);
        setDescription(reminder.description || "");

        setDate(
            reminder.date
                ? new Date(reminder.date)
                    .toISOString()
                    .slice(0, 16)
                : ""
        );

        setStatus(reminder.status || "pending");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
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

                        <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-3xl">
                            ⏰
                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-800">
                                Plant Reminders
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Stay on top of watering and other plant
                                care tasks.
                            </p>
                            {("Notification" in window) && Notification.permission !== "granted" && (
                                <button
                                    onClick={enableNotifications}
                                    className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                                >
                                    🔔 Enable Notifications
                                </button>
                            )}

                        </div>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Create / Edit Reminder */}
                <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-8 mb-10">

                    <div className="mb-6">

                        <h2 className="text-xl font-bold text-gray-800">
                            {editingId
                                ? "Edit Reminder"
                                : "Create Reminder"}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Schedule important care tasks for your plants.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Plant */}
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

                        {/* Care Task */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Care Task
                            </label>

                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
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

                        </div>

                        {/* Other Task Description */}
                        {type === "other" && (
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Task Description
                                </label>

                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="e.g. Rotate the plant toward sunlight"
                                    maxLength={200}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                <p className="text-xs text-gray-400 mt-2">
                                    Describe the care task you want to remember.
                                </p>

                            </div>
                        )}

                        {/* Date & Time */}
                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date & Time
                            </label>

                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />

                        </div>

                        {/* Status */}
                        {editingId && (
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                </select>

                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Reminder"
                                        : "Add Reminder"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>

                {/* Reminder List */}
                <section>

                    <div className="flex items-center justify-between mb-5">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                Your Reminders
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {reminders.length}{" "}
                                {reminders.length === 1
                                    ? "reminder"
                                    : "reminders"}{" "}
                                scheduled
                            </p>

                        </div>

                    </div>

                    {reminders.length === 0 ? (

                        <div className="bg-white rounded-3xl shadow-sm border border-dashed border-green-200 p-12 text-center">

                            <div className="text-5xl mb-4">
                                ⏰
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">
                                No reminders yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create a reminder to stay on top of
                                your plant care.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {reminders.map((reminder) => {

                                const isCompleted =
                                    reminder.status === "completed";

                                return (

                                    <article
                                        key={reminder._id}
                                        className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="flex items-start gap-4">

                                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">

                                                    {reminder.type ===
                                                        "watering"
                                                        ? "💧"
                                                        : reminder.type ===
                                                            "fertilizing"
                                                            ? "🌿"
                                                            : reminder.type ===
                                                                "repotting"
                                                                ? "🪴"
                                                                : "📌"}

                                                </div>

                                                <div>

                                                    <h3 className="text-lg font-bold text-gray-800">
                                                        {reminder.type === "other"
                                                            ? reminder.description || "Other task"
                                                            : reminder.type}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        🌱{" "}
                                                        {reminder.plantId?.name ||
                                                            "Unknown plant"}
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {isCompleted
                                                    ? "Completed"
                                                    : "Pending"}
                                            </span>

                                        </div>

                                        <div className="border-t border-gray-100 my-5"></div>

                                        <p className="text-gray-600 text-sm">
                                            📅{" "}
                                            {new Date(
                                                reminder.date
                                            ).toLocaleString()}
                                        </p>

                                        <div className="flex gap-4 mt-5 text-sm">

                                            <button
                                                onClick={() =>
                                                    handleEdit(reminder)
                                                }
                                                className="text-blue-600 font-medium hover:underline"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        reminder._id
                                                    )
                                                }
                                                className="text-red-600 font-medium hover:underline"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Reminders;