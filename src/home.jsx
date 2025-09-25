import React from "react";
import { FaComments, FaGraduationCap, FaClipboardList } from "react-icons/fa";
 import { Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
function Home() {
  const location = useLocation();
const currentPath = location.pathname;
  const modules = [
    {
      title: "Chatbot IA",
      description:
        "Un assistant virtuel qui répond à vos questions sur la mobilité internationale.",
      icon: <FaComments size={40} color="#c90c0f" />,
      link: "/chatbot",
    },
    {
      title: "Démarches",
      description:
        "Toutes les étapes à suivre pour postuler, obtenir un visa et bien se préparer.",
      icon: <FaClipboardList size={40} color="#c90c0f" />,
      link: "/demarche",
    },
    {
      title: "Forum étudiant",
      description:
        "Un espace d’échange entre étudiants pour poser des questions et partager des expériences.",
      icon: <FaGraduationCap size={40} color="#c90c0f" />,
      link: "/forum",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", fontFamily: "sans-serif" }}>
    <div>
      <Navbar />
     
    </div>
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(to right, #c90c0f, #a00000)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "36px", fontStyle: "italic", marginBottom: "10px" }}>
          Mobilité Internationale Esprit
        </h1>
        <p style={{ fontSize: "18px", maxWidth: "800px", margin: "0 auto" }}>
          Une plateforme dédiée aux étudiants souhaitant partir à l'étranger, regroupant
          informations, assistance intelligente et communauté active.
        </p>
      </header>

      {/* À propos */}
      <section
        style={{
          maxWidth: "1000px",
          margin: "60px auto 40px",
          display: "flex",
          gap: "40px",
          padding: "0 20px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1" }}>
          <img
            src="/src/img/jump.jpg"
            alt="Etudiants"
            style={{ width: "100%", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          />
        </div>
        <div style={{ flex: "1" }}>
          <h2 style={{ fontSize: "24px", fontStyle: "italic", marginBottom: "15px" }}>
            Une plateforme pensée pour vous
          </h2>
          <p style={{ fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
            Cette plateforme simplifie toutes les étapes de votre projet de mobilité :
            informations officielles, outils pratiques, forum collaboratif, et un
            assistant intelligent pour vous guider à tout moment.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", fontStyle: "italic", marginBottom: "40px" }}>
          Nos modules clés
        </h2>

        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {modules.map((mod, idx) => (
            <a
              href={mod.link}
              key={idx}
              style={{
                backgroundColor: "#fff",
                width: "300px",
                borderRadius: "12px",
                padding: "30px 20px",
                textDecoration: "none",
                color: "#000",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ textAlign: "center", marginBottom: "15px" }}>{mod.icon}</div>
              <h3 style={{ textAlign: "center", fontStyle: "italic", marginBottom: "10px" }}>
                {mod.title}
              </h3>
              <p style={{ fontSize: "14px", textAlign: "center", color: "#555" }}>
                {mod.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          textAlign: "center",
          fontSize: "14px",
          color: "#777",
          borderTop: "1px solid #ccc",
          marginTop: "60px",
        }}
      >
        © {new Date().getFullYear()} Esprit Mobilité Internationale. Tous droits réservés.
      </footer>
    </div>
  );
}

export default Home;

