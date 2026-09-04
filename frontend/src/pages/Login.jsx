import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/auth/signin",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-8">

                    <div className="text-5xl mb-3">
                        🌱
                    </div>

                    <h1 className="text-3xl font-bold text-green-700">
                        Plant Care Assistant
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Your plants deserve the best care.
                    </p>

                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-green-100">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome Back
                    </h2>

                    <p className="text-gray-500 mt-1 mb-6">
                        Login to continue caring for your plants.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <div className="border-t border-gray-100 my-6"></div>

                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-green-600 font-semibold hover:underline"
                        >
                            Create one
                        </button>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;