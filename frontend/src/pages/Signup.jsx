import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    name,
                    email,
                    password
                }
            );

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
                    Create Account 🌱
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Start taking better care of your plants
                </p>

                {error && (
                    <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-green-600 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Signup;