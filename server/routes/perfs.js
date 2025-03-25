const express = require("express");
const db = require("../config/db");

const router = express.Router();


// Ajouter une nouvelle perf d'un grimpeur
router.post("/addPerfBloc", (req, res) => {
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

// Supprimer la perf d'un grimpeur
router.delete("/deletePerfBloc", (req, res) => {
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

// Ajouter une nouvelle perf voie d'un grimpeur
router.post("/addPerfVoie", (req, res) => {
    const { voieId, climberId, perf } = req.body;
    const perfInt = parseInt(perf, 10);
    db.query(
        "INSERT INTO Perf_Voie (voieId, climberId, maxDegaine) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE maxDegaine = VALUES(maxDegaine)", 
        [voieId, climberId, perfInt], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.status(201).json({ message: "Performance ajoutée avec succès" });
        }
    );
});

// Supprimer la perf voie d'un grimpeur
router.delete("/deletePerfVoie", (req, res) => {
    const { voieId, climberId } = req.body;
    db.query(
        "DELETE FROM Perf_Voie WHERE voieId = ? AND climberId = ?", 
        [voieId, climberId], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Performance non trouvée" });
            }
            res.json({ message: "Performance supprimée avec succès" });
        }
    );
});

module.exports = router;
