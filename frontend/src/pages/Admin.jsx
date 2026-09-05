import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function Admin() {
    const [section, setSection] = useState(null);
    const [users, setUsers] = useState([]);
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.users || []);
            setSection("users");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchPlants = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/admin/plants", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPlants(response.data.plants || []);
            setSection("plants");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load plants"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-700">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage and view application data.
                    </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <button
                        onClick={fetchUsers}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-green-100 text-left transition"
                    >
                        <div className="text-4xl mb-3">
                            👥
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            View Users
                        </h2>

                        <p className="text-gray-500 mt-1">
                            View registered users.
                        </p>
                    </button>

                    <button
                        onClick={fetchPlants}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-lg border border-green-100 text-left transition"
                    >
                        <div className="text-4xl mb-3">
                            🌱
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            View Plants
                        </h2>

                        <p className="text-gray-500 mt-1">
                            View plants added by users.
                        </p>
                    </button>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        Loading...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Users */}
                {!loading && section === "users" && (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">

                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">
                                Registered Users
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Total users: {users.length}
                            </p>
                        </div>

                        {users.length === 0 ? (
                            <p className="p-6 text-gray-500">
                                No users found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left p-4">
                                                Name
                                            </th>
                                            <th className="text-left p-4">
                                                Email
                                            </th>
                                            <th className="text-left p-4">
                                                Joined
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="border-t"
                                            >
                                                <td className="p-4">
                                                    {user.name}
                                                </td>

                                                <td className="p-4">
                                                    {user.email}
                                                </td>

                                                <td className="p-4">
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                )}

                {/* Plants */}
                {!loading && section === "plants" && (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">

                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">
                                Registered Plants
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Total plants: {plants.length}
                            </p>
                        </div>

                        {plants.length === 0 ? (
                            <p className="p-6 text-gray-500">
                                No plants found.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left p-4">
                                                Plant
                                            </th>
                                            <th className="text-left p-4">
                                                Species
                                            </th>
                                            <th className="text-left p-4">
                                                Owner
                                            </th>
                                            <th className="text-left p-4">
                                                Added
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {plants.map((plant) => (
                                            <tr
                                                key={plant._id}
                                                className="border-t"
                                            >
                                                <td className="p-4 font-medium">
                                                    {plant.name}
                                                </td>

                                                <td className="p-4">
                                                    {plant.species || "—"}
                                                </td>

                                                <td className="p-4">
                                                    {plant.userId?.name ||
                                                        "Unknown"}
                                                </td>

                                                <td className="p-4">
                                                    {new Date(
                                                        plant.createdAt
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Admin;