const express = require("express");
const db = require("./server/routes/db");
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


// Se connecter a un utilisateur
app.post("/login", (req, res) => {
    const { name, mail } = req.body;

    if (!name || !mail) {
        return res.status(400).json({ id: -1, error: "Veuillez fournir un nom et un mail." });
    }

    db.query("SELECT * FROM Climber WHERE name = ? AND mail = ?", [name, mail], (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ id: -1, error: "Erreur serveur" });
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.json({ climberId: -1 });
        }
    });
});

// Supprimer la perf d'un grimpeur
app.delete("/deletePerf", (req, res) => {
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

// Récupérer tous les blocs et les perfs
app.post("/getBlocs", (req, res) => {
    const { climberId } = req.body;

    db.query("SELECT bloc.blocId, bloc.name, bloc.photoName, color, juged, bloc.zone,  COALESCE(COUNT(perf_bloc.blocId), 0) AS checked FROM bloc LEFT JOIN perf_bloc ON bloc.blocId = perf_bloc.blocId AND perf_bloc.climberId = ? GROUP BY bloc.blocId", 
        [climberId],
        (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Récupérer tous les blocs
app.get("/getBlocs", (req, res) => {
    db.query("SELECT * FROM Bloc", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Mettre à jour un bloc existant
app.post("/updateBloc", upload.single("image"), (req, res) => {
    const { id, name, color, juged, zone } = req.body;
    const photoName = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = photoName 
        ? "UPDATE Bloc SET name = ?, color = ?, juged = ?, zone = ?, photoName = ? WHERE blocId = ?"
        : "UPDATE Bloc SET name = ?, color = ?, juged = ?, zone = ? WHERE blocId = ?";

    const params = photoName 
        ? [name, color, juged, zone, photoName, id] 
        : [name, color, juged, zone, id];

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(result.affectedRows > 0 ? { message: "Bloc mis à jour" } : { error: "Bloc non trouvé" });
    });
});

// Ajouter un nouveau bloc
app.post("/addBloc", upload.single("image"), (req, res) => {
    const { name, color, juged, zone} = req.body;
    const photoName = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !color || !photoName || !juged || !zone) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.query("INSERT INTO Bloc (name, color, photoName, juged, zone) VALUES (?, ?, ?, ?, ?)", 
        [name, color, photoName, juged, zone], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json({ message: "Bloc ajouté avec succès", id: result.insertId, photoName });
        }
    );
});

// Ajouter un nouveau bloc
app.delete("/deleteBloc", (req, res) => {
    const blocId = req.query.blocId;

    if (!blocId) {
        return res.status(400).json({ error: "L'id du bloc est requis !" });
    }

    const sql = "DELETE FROM Bloc WHERE blocId = ?";
    db.query(sql, [blocId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Bloc non trouvé" });
        }

        res.json({ success: true, message: "Bloc supprimé avec succès !" });
    });
});

// Récuperer tous les grimpeurs
app.get("/getClimbers", (req, res) => {
    db.query("SELECT * FROM Climber", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Mettre à jour un grimpeur existant
app.post("/updateClimber", upload.single("image"), (req, res) => {
    const { climberId, name, mail, sexe} = req.body;

    db.query("UPDATE Climber SET name = ?, mail = ?, sexe = ? WHERE climberId = ?", 
        [name, mail, sexe, climberId], 
        (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(result.affectedRows > 0 ? { message: "Bloc mis à jour" } : { error: "Bloc non trouvé" });
    });
});

// Ajouter un nouveau bloc
app.post("/addClimber", upload.single("image"), (req, res) => {
    const { name, mail, sexe } = req.body;
    
    if (!name || !mail || !sexe) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.query("INSERT INTO Climber (name, mail, sexe) VALUES (?, ?, ?)", 
        [name, mail, sexe], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json({ message: "Grimpeur ajouté avec succès", id: result.insertId, });
        }
    );
});

app.delete("/deleteClimber", (req, res) => {
    const climberId = req.query.climberId;

    if (!climberId) {
        return res.status(400).json({ error: "L'id du grimpeur est requis !" });
    }

    const sql = "DELETE FROM Climber WHERE climberId = ?";
    db.query(sql, [climberId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Grimpeur non trouvé" });
        }

        res.json({ success: true, message: "Grimpeur supprimé avec succès !" });
    });
});





// Faire les calculs pour le classment bloc
app.post("/classementBloc", (req, res) => {
    const { sexe } = req.body
    db.query(
        'SELECT c.name, SUM(tops * pb.top + zones * pb.zone) as score, SUM(essaisTop) essaisTops, SUM(essaisZone) essaisZones FROM (SELECT blocId, 500.0 / NULLIF(SUM(top), 0) as tops, 500/NULLIF(SUM(zone), 0) zones FROM Perf_Bloc JOIN Climber ON Climber.climberId = Perf_Bloc.climberId WHERE Climber.sexe = ? GROUP BY blocId) Points JOIN Perf_Bloc pb ON pb.blocId = Points.blocId JOIN Climber c ON pb.climberId = c.climberId WHERE c.sexe = ? GROUP BY c.name ORDER BY score DESC, essaisTops ASC, essaisZones ASC',
        [sexe, sexe],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json(results);
    });
});

app.delete("/restartData", (req, res) => {
    // Désactiver les contraintes pour éviter les erreurs de clé étrangère
    db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
        if (err) {
            console.error("Erreur lors de la désactivation des contraintes :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        // Supprimer les données table par table
        db.query("DELETE FROM Perf_Bloc", (err) => {
            if (err) return handleError(res, err);
        });
        db.query("DELETE FROM Bloc", (err) => {
            if (err) return handleError(res, err);
        });
        db.query("DELETE FROM Climber", (err) => {
            if (err) return handleError(res, err);
        });
        db.query("SET FOREIGN_KEY_CHECKS = 1", (err) => {
            if (err) {
                console.error("Erreur lors de la réactivation des contraintes :", err);
                return res.status(500).json({ error: "Erreur serveur" });
            }
        });
        res.json({ message: "Toutes les données ont été supprimées avec succès" });
    });
});

//d Lancer le serveur sur le port 3000
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
