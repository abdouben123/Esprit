import React, { useState } from "react";
 import { Link, useLocation } from "react-router-dom";
 import Navbar from "./components/Navbar";
function App() {
  const location = useLocation();
const currentPath = location.pathname;
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await res.json();
      const botMessage = {
        type: "bot",
        text: data.response || data.error || "Pas de réponse.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Erreur lors de la connexion au backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "black", height: "100vh", display: "flex", flexDirection: "column",width: "100vw" }}>
       <div>
      <Navbar />
     
    </div>




      {/* Chat Container */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            width: "80%",
            
            height: "700px", 
            backgroundColor: "#fff",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Chat Messages */}
          <div
            style={{
              flexGrow: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              maxHeight: "500px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.type === "user" ? "#d4d4d4" : "#fff",
                  color: msg.type === "user" ? "black" : "#000",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  maxWidth: "80%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  fontStyle: "italic",
                  maxWidth: "80%",
                }}
              >
                Chargement...
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              borderTop: "1px solid #eee",
              padding: "15px",
              gap: "10px",
              backgroundColor: "white",
            }}
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Écris ta question ici..."
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                backgroundColor: "#c90c0f",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;