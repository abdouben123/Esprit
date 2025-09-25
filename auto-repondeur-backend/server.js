import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import forumRoutes from "./routes/forum.js";
import profileRoutes from "./routes/profile.js";
import notificationsRoutes from "./routes/notifications.js";
import notificationRoutes, { pushNotification } from "./routes/notifications.js";
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ton frontend React (Vite par ex)
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);

// Export utilitaire pour forum.js
export function sendNotification(userId, notif) {
  pushNotification(userId, notif);
}
// --- Gestion des utilisateurs connectés ---
let onlineUsers = {};



// --- Démarrer serveur ---
server.listen(5000, () =>
  console.log("🚀 Serveur démarré sur http://localhost:5000")
);
