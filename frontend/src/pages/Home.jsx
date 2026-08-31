import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-green-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <button
                        onClick={() => navigate("/")}
                        className="text-xl font-bold text-green-700"
                    >
                        🌱 Plant Care Assistant
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-green-700 font-semibold px-4 py-2 hover:bg-green-50 rounded-lg"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Sign Up
                        </button>
                    </div>

                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-6xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Left */}
                    <div>

                        <p className="text-green-600 font-semibold mb-3">
                            🌿 Smart plant care made simple
                        </p>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                            Take better care of your plants.
                        </h1>

                        <p className="text-gray-600 text-lg mt-5 leading-relaxed">
                            Keep track of your plants, record their growth,
                            manage care reminders, and analyze plant health
                            all in one place.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">

                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                            >
                                Get Started 🌱
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="border border-green-600 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
                            >
                                Login
                            </button>

                        </div>

                    </div>

                    {/* Right */}
                    <div className="flex justify-center">

                        <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-green-100">

                            <div className="text-8xl mb-5">
                                🪴
                            </div>

                            <h2 className="text-2xl font-bold text-green-700">
                                Your Plants. Your Care.
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Grow healthier plants with organized,
                                personalized care.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Features */}
                <section className="mt-20">

                    <h2 className="text-3xl font-bold text-gray-800 text-center">
                        Everything you need for plant care
                    </h2>

                    <p className="text-gray-500 text-center mt-2">
                        Simple tools to help you keep your plants healthy.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                            <div className="text-3xl mb-4">🌱</div>
                            <h3 className="font-bold text-gray-800">
                                Plant Management
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Keep all your plants and their care information organized.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                            <div className="text-3xl mb-4">📔</div>
                            <h3 className="font-bold text-gray-800">
                                Plant Journal
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Record observations and track your plants' growth.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                            <div className="text-3xl mb-4">⏰</div>
                            <h3 className="font-bold text-gray-800">
                                Care Reminders
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Stay organized with watering and care reminders.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                            <div className="text-3xl mb-4">🔍</div>
                            <h3 className="font-bold text-gray-800">
                                Disease Analysis
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Analyze plant health and get useful care recommendations.
                            </p>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Home;