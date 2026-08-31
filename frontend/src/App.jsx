import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import PlantDetails from "./pages/PlantDetails";
import Journal from "./pages/Journal";
import Reminders from "./pages/Reminders";
import DiseaseAnalysis from "./pages/DiseaseAnalysis";
import Home from "./pages/Home";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
    
                <Route path="/plants/add" element={<AddPlant />} />
                <Route path="/plants/:id" element={<PlantDetails />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/disease" element={<DiseaseAnalysis />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;