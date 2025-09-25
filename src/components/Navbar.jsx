import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);

          // ✅ Enregistrer user pour socket
          socket.emit("register", res.data.id);

          // ✅ Charger ses notifs
          axios
            .get("http://localhost:5000/api/notifications", {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setNotifications(res.data));
        })
        .catch(() => setUser(null));
    }

    // ✅ Écouter les notifs en temps réel
    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);

    if (!showDropdown) {
      // Marquer comme lues
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notifications/mark-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
 <nav style={{ backgroundColor: "#fff", color: "#000", padding: "15px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", }} > 
 {/* Logo */}
  <div style={{ display: "flex", alignItems: "center" }}> 
    
    
    <img src="/src/img/esprit.png" alt="Logo" style={{ width: "100px", height: "40px" }} /> 
    </div> {/* Liens + User */} 
    <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: "16px", fontStyle: "italic", marginLeft: "839px", fontWeight: "bold", }} >

      <div style={{ display: "flex", alignItems: "center", gap: "15px", fontWeight: "bold" }}>
        <Link to="/" style={linkStyle(currentPath === "/")}>Accueil</Link>
        <Link to="/chatbot" style={linkStyle(currentPath === "/chatbot")}>Chatbot</Link>
        <Link to="/forum" style={linkStyle(currentPath === "/forum")}>Forum</Link>
        <Link to="/demarche" style={linkStyle(currentPath === "/demarche")}>Démarche</Link>

        {user && (
          <div style={{ position: "relative" }}>
            <FaBell size={20} style={{ cursor: "pointer" }} onClick={handleOpenDropdown} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -5, right: -5,
                background: "red", color: "white", borderRadius: "50%",
                padding: "2px 6px", fontSize: "12px"
              }}>
                {unreadCount}
              </span>
            )}
            {showDropdown && (
              <div style={{
                position: "absolute", top: "30px", right: 0,
                background: "#fff", border: "1px solid #ccc", borderRadius: "6px",
                width: "250px", maxHeight: "300px", overflowY: "auto", zIndex: 1000
              }}>
                {notifications.length === 0 ? (
                  <p style={{ padding: 10 }}>Aucune notification</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{
                      padding: 10,
                      borderBottom: "1px solid #eee",
                      background: n.is_read ? "#fff" : "#f0f8ff"
                    }}>
                      <p style={{ margin: 0, fontSize: "14px" }}>{n.message}</p>
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {user && user.avatar ? (
          <Link to="/profile">
            <img src={user.avatar} alt="avatar" style={{
              width: "38px", height: "38px", borderRadius: "50%",
              objectFit: "cover", border: "2px solid #000",
            }} />
          </Link>
        ) : (
          <Link to="/profile" style={{ color: "#000" }}>Profile</Link>
        )}

        {user ? (
          <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "#c90c0f", cursor: "pointer" }}>
            Déconnexion
          </button>
        ) : (
          <Link to="/login" style={{ color: "#c90c0f", fontWeight: "bold" }}>Se connecter</Link>
        )}
      </div>
      </div>
    </nav>
  );
}

const linkStyle = (active) => ({
  color: "#000",
  textDecoration: "none",
  borderBottom: active ? "2px solid black" : "2px solid transparent",
});

export default Navbar;
