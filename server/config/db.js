const mysql = require("mysql2");

// Création de la connexion à la base de données
const connection = mysql.createConnection({
    host: "localhost", // Adresse du serveur MySQL (127.0.0.1 si en local)
    user: "root",      // Nom d'utilisateur MySQL
    password: "",      // Mot de passe MySQL (laisser vide si pas de mot de passe)
    database: "local_ncv" // Nom de ta base de données
})
// Connexion à MySQL
connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à MySQL :", err);
        return;
    }
    console.log("Connecté à la base de données MySQL !");
});

module.exports = connection; // Exporter la connexion pour l'utiliser ailleurs
