import React, { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    classe: "",
    email: "",
    password: "",
    sexe: "Homme",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide.";
    }

    // Password validation: at least 8 chars, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Inscription réussie. Vous pouvez maintenant vous connecter.");
        setFormData({
          nom: "",
          prenom: "",
          classe: "",
          email: "",
          password: "",
          sexe: "Homme",
        });
      } else {
        setMessage(data.message || "Une erreur est survenue lors de l'inscription.");
      }
    } catch (error) {
      setMessage("Erreur serveur. Veuillez réessayer plus tard.");
    }

    setLoading(false);
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/src/img/esprit.png"
            alt="Logo"
            style={{ width: "100px", height: "40px" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "30px",
            fontSize: "16px",
            fontStyle: "italic",
            fontWeight: "bold",
            marginLeft: "980px",
          }}
        >
          {["Accueil", "Chatbot", "Forum", "Démarche", "Login"].map((label) => (
            <a
              key={label}
              href={`/${label.toLowerCase()}`}
              style={{
                color: "#000",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "4px",
                borderBottom:
                  label === "Inscription"
                    ? "2px solid black"
                    : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (label !== "Inscription") {
                  e.target.style.borderBottom = "2px solid black";
                }
              }}
              onMouseLeave={(e) => {
                if (label !== "Inscription") {
                  e.target.style.borderBottom = "2px solid transparent";
                }
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Register Form */}
      <div
        style={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 0",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ fontStyle: "italic", color: "#000", textAlign: "center" }}>
            Inscription
          </h2>

          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="classe"
            placeholder="Classe"
            value={formData.classe}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "13px" }}>{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "13px" }}>{errors.password}</p>
          )}

          <select
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            required
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>

          <button
            type="submit"
            disabled={loading}
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
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>

          {message && (
            <p style={{ textAlign: "center", color: "black" }}>{message}</p>
          )}

          <p style={{ textAlign: "center", fontSize: "14px" }}>
            Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              style={{
                color: "#c90c0f",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default Register;
