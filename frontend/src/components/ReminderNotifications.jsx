import { useEffect } from "react";
import axios from "axios";

function ReminderNotifications() {
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const enableNotifications = async () => {
            if ("Notification" in window && Notification.permission === "default") {
                await Notification.requestPermission();
            }
        };

        enableNotifications();

        const checkReminders = async () => {
            try {
                const response = await axios.get(
                    "/api/reminders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const reminders = response.data.reminders || [];

                const notifiedReminders = JSON.parse(
                    localStorage.getItem("notifiedReminders") || "[]"
                );

                const now = new Date();

                reminders.forEach((reminder) => {
                    if (reminder.status !== "pending") return;

                    const reminderDate = new Date(reminder.date);

                    if (
                        reminderDate <= now &&
                        !notifiedReminders.includes(reminder._id)
                    ) {
                        const plantName =
                            reminder.plantId?.name || "your plant";

                        const taskName =
                            reminder.type === "watering"
                                ? "water"
                                : reminder.type === "fertilizing"
                                    ? "fertilize"
                                    : reminder.type === "repotting"
                                        ? "repot"
                                        : "complete this task";

                        const body =
                            reminder.type === "other"
                                ? `${plantName}: ${reminder.description}`
                                : `Time to ${taskName} your ${plantName}.`;

                        if (
                            "Notification" in window &&
                            Notification.permission === "granted"
                        ) {
                            new Notification("🌱 Plant Care Reminder", {
                                body
                            });
                        }

                        notifiedReminders.push(reminder._id);
                    }
                });

                localStorage.setItem(
                    "notifiedReminders",
                    JSON.stringify(notifiedReminders)
                );
            } catch (error) {
                console.error(
                    "Failed to check reminders:",
                    error.response?.data?.message || error.message
                );
            }
        };

        checkReminders();

        const interval = setInterval(checkReminders, 15000);

        return () => clearInterval(interval);
    }, [token]);

    return null;
}

export default ReminderNotifications;