import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import { pushNotification } from "./notifications.js"; // ✅ utilise notifications.js MySQL

const router = express.Router();

// Middleware authentification
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Pas de token" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
}

// 📌 Récupérer tous les posts
router.get("/posts", (req, res) => {
  const sql = "SELECT * FROM posts ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(results);
  });
});

// 📌 Créer un post
router.post("/posts", authMiddleware, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  const sql = "INSERT INTO posts (title, content, created_by) VALUES (?, ?, ?)";
  db.query(sql, [title, content, userId], (err) => {
    if (err) return res.status(500).json({ message: "Erreur ajout post" });
    res.status(201).json({ message: "Post créé avec succès" });
  });
});

// 📌 Récupérer tous les commentaires
router.get("/comments", (req, res) => {
  const sql = "SELECT * FROM comments ORDER BY created_at ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });
    res.json(results);
  });
});

// 📌 Ajouter un commentaire (et notifier le créateur du post)
router.post("/comments", authMiddleware, (req, res) => {
  const { post_id, content } = req.body;
  const userId = req.user.id;

  const sql = "INSERT INTO comments (post_id, content, created_by) VALUES (?, ?, ?)";
  db.query(sql, [post_id, content, userId], (err) => {
    if (err) return res.status(500).json({ message: "Erreur ajout commentaire" });

    // 🔔 Récupérer le créateur du post
    const getPost = "SELECT created_by FROM posts WHERE id = ?";
    db.query(getPost, [post_id], (err, rows) => {
      if (!err && rows.length > 0) {
        const postOwner = rows[0].created_by;
        if (postOwner !== userId) {
          pushNotification(postOwner, {
            type: "comment",
            message: `Quelqu'un a commenté votre post`,
            postId: post_id,
          });
        }
      }
    });

    res.status(201).json({ message: "Commentaire ajouté" });
  });
});

// 📌 Voter sur un post (et notifier le créateur du post)
router.post("/vote", authMiddleware, (req, res) => {
  const { post_id, vote_type } = req.body;
  const userId = req.user.id;

  if (!post_id || !["up", "down"].includes(vote_type)) {
    return res.status(400).json({ message: "Paramètres invalides" });
  }

  const checkSql = "SELECT vote_type FROM votes WHERE user_id = ? AND post_id = ?";
  db.query(checkSql, [userId, post_id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur serveur" });

    if (rows.length === 0) {
      // Premier vote
      const insertSql = "INSERT INTO votes (user_id, post_id, vote_type) VALUES (?, ?, ?)";
      db.query(insertSql, [userId, post_id, vote_type], (err) => {
        if (err) return res.status(500).json({ message: "Erreur vote" });

        const delta = vote_type === "up" ? 1 : -1;
        const updateSql = "UPDATE posts SET votes = votes + ? WHERE id = ?";
        db.query(updateSql, [delta, post_id], (err) => {
          if (err) return res.status(500).json({ message: "Erreur vote" });

          // 🔔 Notification
          const getPost = "SELECT created_by FROM posts WHERE id = ?";
          db.query(getPost, [post_id], (err, rows) => {
            if (!err && rows.length > 0) {
              const postOwner = rows[0].created_by;
              if (postOwner !== userId) {
                pushNotification(postOwner, {
                  type: "vote",
                  message: `Votre post a reçu un ${vote_type}vote`,
                  postId: post_id,
                });
              }
            }
          });

          res.json({ message: "Vote enregistré" });
        });
      });
    } else {
      // Changement de vote
      const previous = rows[0].vote_type;
      if (previous === vote_type) {
        return res.status(400).json({ message: "Vous avez déjà voté ainsi" });
      }

      const updateVoteSql = "UPDATE votes SET vote_type = ? WHERE user_id = ? AND post_id = ?";
      db.query(updateVoteSql, [vote_type, userId, post_id], (err) => {
        if (err) return res.status(500).json({ message: "Erreur vote" });

        const delta = vote_type === "up" ? 2 : -2;
        const updatePostSql = "UPDATE posts SET votes = votes + ? WHERE id = ?";
        db.query(updatePostSql, [delta, post_id], (err) => {
          if (err) return res.status(500).json({ message: "Erreur vote" });

          // 🔔 Notification
          const getPost = "SELECT created_by FROM posts WHERE id = ?";
          db.query(getPost, [post_id], (err, rows) => {
            if (!err && rows.length > 0) {
              const postOwner = rows[0].created_by;
              if (postOwner !== userId) {
                pushNotification(postOwner, {
                  type: "vote",
                  message: `Quelqu'un a changé son vote sur votre post`,
                  postId: post_id,
                });
              }
            }
          });

          res.json({ message: "Vote modifié" });
        });
      });
    }
  });
});
// 📌 Récupérer les posts de l'utilisateur connecté
router.get("/posts/my", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT * FROM posts WHERE created_by = ? ORDER BY created_at DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur récupération de vos posts" });
    }
    res.json(results);
  });
});

// 📌 Supprimer un post de l'utilisateur connecté
router.delete("/posts/:id", authMiddleware, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const sql = "DELETE FROM posts WHERE id = ? AND created_by = ?";
  db.query(sql, [postId, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur suppression post" });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Post introuvable ou non autorisé" });
    }
    res.json({ message: "Post supprimé" });
  });
});
export default router;
