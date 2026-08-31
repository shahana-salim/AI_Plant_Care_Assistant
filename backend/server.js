const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/plantRoutes");
const journalRoutes = require("./routes/journalRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "AI Plant Care Assistant API is running" });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});