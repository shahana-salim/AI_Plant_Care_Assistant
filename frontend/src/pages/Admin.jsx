import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get("/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUsers(response.data.users || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load users"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading admin dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Admin Dashboard
                </h1>

                <p className="text-gray-600 mb-6">
                    Manage and view registered users.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-5">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-5 mb-6">
                    <h2 className="text-lg font-semibold">
                        Total Users
                    </h2>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {users.length}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5 border-b">
                        <h2 className="text-xl font-semibold">
                            Registered Users
                        </h2>
                    </div>

                    {users.length === 0 ? (
                        <p className="p-5 text-gray-500">
                            No users found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Role</th>
                                        <th className="text-left p-4">Joined</th>
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

                                            <td className="p-4 capitalize">
                                                {user.role}
                                            </td>

                                            <td className="p-4">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString("en-GB")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Admin;