import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown, FaCommentDots, FaTrash } from "react-icons/fa";
import Navbar from "./components/Navbar";

const API_BASE = "http://localhost:5000/api";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMyPostsModal, setShowMyPostsModal] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [postsRes, commentsRes] = await Promise.all([
        axios.get(`${API_BASE}/forum/posts`),
        axios.get(`${API_BASE}/forum/comments`),
      ]);

      setPosts(postsRes.data || []);

      const grouped = {};
      (commentsRes.data || []).forEach((c) => {
        if (!grouped[c.post_id]) grouped[c.post_id] = [];
        grouped[c.post_id].push(c);
      });
      setCommentsByPost(grouped);
    } catch (err) {
      console.error("fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    if (!isLoggedIn) return alert("Veuillez vous connecter pour voir vos posts.");
    try {
      const res = await axios.get(`${API_BASE}/forum/posts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(res.data || []);
      setShowMyPostsModal(true);
    } catch (err) {
      console.error(err);
      alert("Erreur récupération de vos posts");
    }
  };

  const handleAddPost = async () => {
    if (!isLoggedIn) return alert("Veuillez vous connecter pour publier.");
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await axios.post(
        `${API_BASE}/forum/posts`,
        { ...newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost({ title: "", content: "" });
      setShowModal(false);
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur création post");
    }
  };

  const handleVote = async (postId, vote_type) => {
    if (!isLoggedIn) return alert("Veuillez vous connecter pour voter.");
    try {
      await axios.post(
        `${API_BASE}/forum/vote`,
        { post_id: postId, vote_type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAll();
      if (showMyPostsModal) await fetchMyPosts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur vote");
    }
  };

  const handleAddComment = async (postId) => {
    const text = (newComment[postId] || "").trim();
    if (!isLoggedIn) return alert("Veuillez vous connecter pour commenter.");
    if (!text) return;

    try {
      await axios.post(
        `${API_BASE}/forum/comments`,
        { post_id: postId, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      await fetchAll();
      if (showMyPostsModal) await fetchMyPosts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur commentaire");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post ?")) return;
    try {
      await axios.delete(`${API_BASE}/forum/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchMyPosts();
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur suppression post");
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const commentsCount = (postId) => (commentsByPost[postId]?.length || 0);

  const renderPost = (post, isMyPost = false) => (
    <article
      key={post.id}
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 56, textAlign: "center" }}>
          <FaArrowUp
            onClick={() => handleVote(post.id, "up")}
            style={{ cursor: "pointer", color: "gray" }}
          />
          <div style={{ fontWeight: "bold", margin: "6px 0" }}>{post.votes}</div>
          <FaArrowDown
            onClick={() => handleVote(post.id, "down")}
            style={{ cursor: "pointer", color: "gray" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: "0 0 6px" }}>{post.title}</h3>
              <div style={{ fontSize: 13, color: "#666" }}>
                {post.author || "Anonyme"} • {new Date(post.created_at).toLocaleString()}
              </div>
            </div>
            {isMyPost && (
              <FaTrash
                onClick={() => handleDeletePost(post.id)}
                style={{ cursor: "pointer", color: "red" }}
              />
            )}
          </div>
          <p style={{ marginTop: 10 }}>{post.content}</p>

          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => toggleComments(post.id)}
          >
            <FaCommentDots />
            <strong>{commentsCount(post.id)} commentaires</strong>
          </div>

          {openComments[post.id] && (
            <div style={{ marginTop: 12 }}>
              {(commentsByPost[post.id] || []).map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#f6f6f6",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: 13, color: "#555" }}>
                    <strong>{c.author || "Anonyme"}</strong> ·{" "}
                    <span style={{ color: "#888" }}>
                      {new Date(c.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ marginTop: 6 }}>{c.content}</div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  placeholder="Votre commentaire..."
                  value={newComment[post.id] || ""}
                  onChange={(e) => setNewComment((p) => ({ ...p, [post.id]: e.target.value }))}
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  style={{
                    backgroundColor: "#c90c0f",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Ajouter
                </button>
              </div>
              {!isLoggedIn && <div style={{ marginTop: 6, color: "#666" }}>Connectez-vous pour commenter.</div>}
            </div>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
        <h2 style={{ fontStyle: "italic", textAlign: "center" }}>Forum étudiant</h2>

        {/* Boutons créer post / mes posts */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, gap: 10 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#c90c0f",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Créer un post
          </button>
          <button
            onClick={fetchMyPosts}
            style={{
              backgroundColor: "#c90c0f",
              color: "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Mes posts
          </button>
        </div>

        {/* MODAL création post */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
                width: "500px",
                maxWidth: "95%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Créer une discussion</h3>
              <input
                placeholder="Titre"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                style={{ width: "95%", padding: 10, marginBottom: 8, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <textarea
                placeholder="Contenu"
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                rows={4}
                style={{ width: "95%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={() => setShowModal(false)} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
                  Annuler
                </button>
                <button onClick={handleAddPost} style={{ backgroundColor: "#c90c0f", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL Mes posts */}
        {showMyPostsModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              overflowY: "auto",
              padding: "40px 0",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
                width: "600px",
                maxWidth: "95%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <h3 style={{ marginTop: 0, textAlign: "center" }}>Mes posts</h3>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button onClick={() => setShowMyPostsModal(false)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
                  Fermer
                </button>
              </div>
              {myPosts.length > 0 ? myPosts.map((post) => renderPost(post, true)) : <p>Aucun post publié.</p>}
            </div>
          </div>
        )}

        {/* Liste posts généraux */}
        {!showMyPostsModal && (loading ? <p>Chargement...</p> : posts.map((post) => renderPost(post)))}
      </div>
    </div>
  );
}

export default Forum;
