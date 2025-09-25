import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Inscription
router.post("/register", async (req, res) => {
  const { nom, prenom, email, password, classe, sexe } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (nom, prenom, email, password, classe, sexe) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [nom, prenom, email, hashedPassword, classe, sexe], (err) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });
      res.status(201).json({ message: "Utilisateur créé avec succès" });
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    if (results.length === 0) return res.status(401).json({ message: "Email invalide" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, user });
  });
});

export default router;
