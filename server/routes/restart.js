const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.delete("/restartData", (req, res) => {
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

module.exports = router;