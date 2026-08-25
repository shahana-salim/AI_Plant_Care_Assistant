import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import PlantDetails from "./pages/PlantDetails";
import Journal from "./pages/Journal";

function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold text-green-700">
                AI Plant Care Assistant 🌱
            </h1>
        </div>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/plants/add" element={<AddPlant />} />
                <Route path="/plants/:id" element={<PlantDetails />} />
                <Route path="/journal" element={<Journal />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;