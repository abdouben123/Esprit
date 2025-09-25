import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const res = await fetch("http://localhost:5000/api/auth/login",
 {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // tu peux stocker le token si besoin
        localStorage.setItem("token", data.token);
        alert("Connexion réussie !");
        navigate("/"); // redirection accueil
      } else {
        alert(data.message || "Erreur de connexion");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "15px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/src/img/esprit.png"
            alt="Logo"
            style={{ width: "100px", height: "40px" }}
          />
        </div>

        {/* Nav Links */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            fontSize: "16px",
            fontStyle: "italic",
            fontWeight: "bold",
            marginRight: "auto",
            marginLeft: "980px",
          }}
        >
          {[
            { label: "Accueil", path: "/" },
            { label: "Chatbot", path: "/chatbot" },
            { label: "Forum", path: "/forum" },
            { label: "Démarche", path: "/demarche" },
            { label: "Login", path: "/login" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={{
                color: "#000",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom:
                  currentPath === item.path
                    ? "2px solid black"
                    : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (currentPath !== item.path)
                  e.target.style.borderBottom = "2px solid black";
              }}
              onMouseLeave={(e) => {
                if (currentPath !== item.path)
                  e.target.style.borderBottom = "2px solid transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Login Form */}
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2 style={{ fontStyle: "italic", color: "#000", textAlign: "center" }}>
            Connexion
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
            required
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#c90c0f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Se connecter
          </button>

          <p style={{ textAlign: "center", fontSize: "14px", fontStyle: "italic" }}>
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              style={{
                color: "#c90c0f",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
