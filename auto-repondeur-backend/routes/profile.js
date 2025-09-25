import upload from "../middleware/uploadAvatar.js";
import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/auth.js";

import bcrypt from "bcryptjs";

const router = express.Router();

// GET profil
router.get("/me", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT id, nom, prenom, email, classe, sexe, avatar FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const user = results[0];
    if (user.avatar) {
      user.avatar = `http://localhost:5000/${user.avatar}`;
    }
    res.json(user);
  });
});

// UPDATE profil (y compris avatar)
router.put("/me", authenticateToken, upload.single("avatar"), (req, res) => {
  const userId = req.user.id;
  const { nom, prenom, email, classe, sexe, password } = req.body;
  let avatarPath = null;

  if (req.file) {
    avatarPath = req.file.path.replace(/\\/g, "/");
  }

  // On prépare les champs dynamiques
  const fields = [];
  const values = [];

  if (nom) { fields.push("nom = ?"); values.push(nom); }
  if (prenom) { fields.push("prenom = ?"); values.push(prenom); }
  if (email) { fields.push("email = ?"); values.push(email); }
  if (classe) { fields.push("classe = ?"); values.push(classe); }
  if (sexe) { fields.push("sexe = ?"); values.push(sexe); }
  if (avatarPath) { fields.push("avatar = ?"); values.push(avatarPath); }
  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    fields.push("password = ?");
    values.push(hashed);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(userId);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json({ message: "Profil mis à jour" });
  });
});

export default router;
