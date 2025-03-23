const express = require("express");
const db = require("../config/db");

const router = express.Router();


// Ajouter une nouvelle perf d'un grimpeur
router.post("/addPerf", (req, res) => {
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
router.delete("/deletePerf", (req, res) => {
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

module.exports = router;
