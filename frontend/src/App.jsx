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
import AskAI from "./pages/AskAI";
import EditPlant from "./pages/EditPlant";
import ReminderNotifications from "./components/ReminderNotifications";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";


function App() {
    return (
        <BrowserRouter>
            <ReminderNotifications />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
    
                <Route path="/plants/add" element={<AddPlant />} />
                <Route path="/plants/:id" element={<PlantDetails />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/disease" element={<DiseaseAnalysis />} />
                <Route path="/ask-ai" element={<AskAI />} />
                <Route path="/plants/:id/edit" element={<EditPlant />} />

                <Route path="*" element={<Navigate to="/" />} />

                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;