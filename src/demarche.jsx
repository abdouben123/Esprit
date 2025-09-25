import React from "react";
import {
  FaUserEdit,
  FaCalendarAlt,
  FaFileAlt,
  FaFileUpload,
  FaClipboardCheck,
} from "react-icons/fa";
 import { Link, useLocation } from "react-router-dom";
 import Navbar from "./components/Navbar";
function Demarche() {
    const location = useLocation();
const currentPath = location.pathname;
  const steps = [
    {
      icon: <FaUserEdit size={30} color="#c90c0f" />,
      title: "Créer un compte Campus France",
      description:
        "Connectez-vous sur le portail Campus France pour créer votre dossier Études en France.",
      link: "https://pastel.diplomatie.gouv.fr/etudesenfrance",
    },
    {
      icon: <FaCalendarAlt size={30} color="#c90c0f" />,
      title: "Prendre rendez-vous avec Campus France",
      description:
        "Une fois votre dossier complet, demandez un rendez-vous pour validation.",
    },
    {
      icon: <FaFileAlt size={30} color="#c90c0f" />,
      title: "Remplir le formulaire France-Visas",
      description:
        "Complétez le formulaire en ligne sur le site officiel pour initier votre demande de visa.",
      link: "https://france-visas.gouv.fr",
    },
    {
      icon: <FaClipboardCheck size={30} color="#c90c0f" />,
      title: "Recevoir la convocation TLS",
      description:
        "Après validation Campus France, vous recevrez une convocation pour TLS Contact.",
    },
    {
      icon: <FaFileUpload size={30} color="#c90c0f" />,
      title: "Déposer votre dossier chez TLS",
      description:
        "Rendez-vous à l’agence TLS Contact avec tous les documents demandés.",
    },
  ];

  const documents = [
    "Lettre d’admission de l’université",
    "Passeport (valide + copies)",
    "Formulaire Campus France imprimé",
    "Formulaire France-Visas rempli et signé",
    "Photos d’identité récentes",
    "Justificatif de ressources financières",
    "Attestation d’hébergement ou réservation logement",
    "Attestation d’assurance santé",
    "Frais de dossier (en espèces ou chèque)",
  ];

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div>
      <Navbar />
     
    </div>
      {/* HEADER */}
      <header
        style={{
          background: "linear-gradient(to right, #c90c0f, #a00000)",
          color: "#fff",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "32px", fontStyle: "italic", marginBottom: "10px" }}>
          Démarches après la lettre d’admission
        </h1>
        <p style={{ fontSize: "16px", maxWidth: "800px", margin: "0 auto" }}>
          Vous avez reçu votre lettre d’admission ? Voici les étapes clés à suivre pour finaliser votre départ vers la France.
        </p>
      </header>

      {/* ÉTAPES */}
      <section style={{ maxWidth: "1100px", margin: "50px auto", padding: "0 20px" }}>
        <h2 style={{ fontStyle: "italic", marginBottom: "30px", textAlign: "center" }}>
          Étapes à suivre
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
                display: "flex",
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div>{step.icon}</div>
              <div>
                <h3 style={{ margin: "0 0 8px", fontStyle: "italic" }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: "15px", color: "#444" }}>
                  {step.description}
                  {step.link && (
                    <span>
                      {" "}
                      👉{" "}
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#c90c0f", fontWeight: "bold" }}
                      >
                        Ouvrir le site
                      </a>
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCUMENTS */}
      <section style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ fontStyle: "italic", textAlign: "center", marginBottom: "20px" }}>
          Documents nécessaires
        </h2>
        <ul style={{ lineHeight: "1.8em", fontSize: "15px", color: "#333" }}>
          {documents.map((doc, idx) => (
            <li key={idx}>• {doc}</li>
          ))}
        </ul>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          textAlign: "center",
          fontSize: "14px",
          color: "#777",
          borderTop: "1px solid #ccc",
          marginTop: "40px",
        }}
      >
        © {new Date().getFullYear()} Esprit Mobilité Internationale — Démarches Campus France.
      </footer>
    </div>
  );
}

export default Demarche;
