const express = require("express");
const db = require("./db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


// 📌 Récupérer tous les grimpeurs
app.get("/climbers", (req, res) => {
    db.query("SELECT * FROM Climber", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// 📌 Ajouter un grimpeur
app.post("/climbers", (req, res) => {
    const { name, mail } = req.body;
    db.query("INSERT INTO Climber (name, mail) VALUES (?, ?)", [name, mail], (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.status(201).json({ id: result.insertId, name, mail });
    });
});

// Se connecter a un utilisateur
app.post("/login", (req, res) => {
    const { name, mail } = req.body;

    if (!name || !mail) {
        return res.status(400).json({ id: -1, error: "Veuillez fournir un nom et un mail." });
    }

    db.query("SELECT climberId FROM Climber WHERE name = ? AND mail = ?", [name, mail], (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ id: -1, error: "Erreur serveur" });
        }
        if (results.length > 0) {
            res.json({ id: results[0].climberId });
        } else {
            res.json({ id: -1 });
        }
    });
});

// Recuperer les perfs bloc d'un grimpeur
app.post("/perf", (req, res) => {
    const { climberId } = req.body;
    db.query("SELECT blocId FROM Perf_Bloc WHERE climberId = ?", climberId, (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Supprimer la perf d'un grimpeur
app.delete("/perf", (req, res) => {
    const { blocId, climberId } = req.body;

    db.query(
        "DELETE FROM Perf_Bloc WHERE blocId = ? AND climberId = ?", 
        [blocId, climberId], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Performance non trouvée" });
            }
            res.json({ message: "Performance supprimée avec succès" });
        }
    );
});

// Ajouter une nouvelle perf d'un grimpeur
app.post("/addPerf", (req, res) => {
    const { blocId, climberId } = req.body;
    db.query(
        "INSERT INTO Perf_Bloc (blocId, climberId, zone, essaisZone, top, essaisTop) VALUES (?, ?, 1, 0, 1, 0)", 
        [blocId, climberId], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.status(201).json({ message: "Performance ajoutée avec succès" });
        }
    );
});

// Récupérer tous les blocs
app.get("/blocs", (req, res) => {
    db.query("SELECT * FROM Bloc", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Importer une image
app.post("/addBloc", upload.single("image"), (req, res) => {
    const { blocName, color, juged} = req.body;
    const photoName = req.file ? `/uploads/${req.file.filename}` : null;

    if (!blocName || !color || !photoName || !juged) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.query("INSERT INTO Bloc (blocName, color, photoName, juged) VALUES (?, ?, ?)", 
        [blocName, color, photoName, juged], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json({ message: "Bloc ajouté avec succès", id: result.insertId, photoName });
        }
    );
});

// Faire les calculs pour le classment bloc
app.get("/classementBloc", (req, res) => {
    db.query(
        "SELECT c.name, SUM(tops * pb.top + zones * pb.zone) as score, SUM(essaisTop) essaisTops, SUM(essaisZone) essaisZones FROM (SELECT blocId, 500.0 / NULLIF(SUM(top), 0) as tops, 500/NULLIF(SUM(zone), 0) zones FROM Perf_Bloc GROUP BY blocId) Points JOIN Perf_Bloc pb ON pb.blocId = Points.blocId JOIN Climber c ON pb.climberId = c.climberId GROUP BY c.name ORDER BY score DESC, essaisTops ASC, essaisZones ASC", 
        (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json(results);
    });
});

// 📌 Lancer le serveur sur le port 3000
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
