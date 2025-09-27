import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // ton utilisateur MySQL
  password: "",        // ton mot de passe MySQL
  database: "auto_repondeur"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Connecté à MySQL");
});

export default db;