import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");

    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        setName(storedUser.name || "");
        setEmail(storedUser.email || "");
    }, [token, navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        setProfileMessage("");
        setProfileError("");

        if (!name.trim() || !email.trim()) {
            setProfileError("Name and email are required.");
            return;
        }

        setProfileLoading(true);

        try {
            const response = await axios.put(
                "http://localhost:5000/api/auth/profile",
                {
                    name: name.trim(),
                    email: email.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedUser = response.data.user;

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                })
            );

            setName(updatedUser.name);
            setEmail(updatedUser.email);

            setProfileMessage("Profile updated successfully.");
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                    "Failed to update profile."
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill in all password fields.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters long."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await axios.put(
                "http://localhost:5000/api/auth/change-password",
                {
                    currentPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPasswordMessage(
                response.data.message ||
                    "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                    "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                    My Profile
                </h1>

                <p className="text-gray-600 mb-8">
                    Manage your account information and password.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Profile Information
                        </h2>

                        <form
                            onSubmit={handleProfileUpdate}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {profileError && (
                                <p className="text-red-600 text-sm">
                                    {profileError}
                                </p>
                            )}

                            {profileMessage && (
                                <p className="text-green-600 text-sm">
                                    {profileMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={profileLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {profileLoading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Change Password
                        </h2>

                        <form
                            onSubmit={handlePasswordChange}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {passwordError && (
                                <p className="text-red-600 text-sm">
                                    {passwordError}
                                </p>
                            )}

                            {passwordMessage && (
                                <p className="text-green-600 text-sm">
                                    {passwordMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {passwordLoading
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;