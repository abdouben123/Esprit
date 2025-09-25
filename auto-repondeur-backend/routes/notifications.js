// routes/notifications.js
import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

// --- Récupérer les notifs d’un user ---
router.get("/", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur notifications" });
    res.json(results);
  });
});

// --- Marquer comme lues ---
router.put("/mark-read", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const sql = "UPDATE notifications SET is_read = TRUE WHERE user_id = ?";
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ message: "Erreur serveur maj notifs" });
    res.json({ success: true });
  });
});

// --- Fonction utilitaire pour push une notif ---
export function pushNotification(userId, notif) {
  const { message, type, postId } = notif;
  const sql = "INSERT INTO notifications (user_id, message, type, post_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, message, type, postId], (err) => {
    if (err) console.error("Erreur insert notif:", err);
  });
}

export default router;
