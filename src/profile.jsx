import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

function Profile() {
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        alert("Erreur chargement profil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setAvatarFile(file);

  // Show preview instantly
  if (file) {
    setFormData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  }
};


  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }
      if (avatarFile) data.append("avatar", avatarFile);

      await axios.put("http://localhost:5000/api/profile/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profil mis à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur mise à jour profil");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <Navbar />

      {/*  Formulaire centré avec marge en haut */}
      <form
        onSubmit={handleSave}
        style={{
          maxWidth: 500,
          margin: "40px auto", // centre + ajoute marge en haut
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Mon Profil</h2>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={formData.avatar || "/src/img/user.png"}
            alt="avatar"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div style={{ marginTop: 10 }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        {/* Champs texte */}
        {["nom", "prenom", "email", "classe", "sexe"].map((field) => (
          <div key={field} style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: "bold",
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              style={{
                width: "95%", //  réduit un peu la largeur pour éviter que ça colle aux bords
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        {/* Nouveau mot de passe */}
        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}
          >
            Nouveau mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            style={{
              width: "95%", //  même réduction de largeur
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#c90c0f",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

export default Profile;
