const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Importer les routes
app.use(require("./routes/auth"));
app.use(require("./routes/blocs"));
app.use(require("./routes/voies"));
app.use(require("./routes/climbers"));
app.use(require("./routes/perfs"));
app.use(require("./routes/classement"));
app.use(require("./routes/restart"));

const path = require("path");

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Pour toute autre route, renvoyer index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});


// Lancer le serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
