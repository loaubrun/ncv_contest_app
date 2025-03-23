const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Récupérer tous les grimpeurs
router.get("/getClimbers", (req, res) => {
    db.query("SELECT * FROM Climber", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Ajouter un nouveau grimpeur
router.post("/addClimber", (req, res) => {
    const { name, mail, sexe } = req.body;
    
    if (!name || !mail || !sexe) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.query("INSERT INTO Climber (name, mail, sexe) VALUES (?, ?, ?)", 
        [name, mail, sexe], 
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json({ message: "Grimpeur ajouté avec succès", id: result.insertId });
        }
    );
});

// Mettre à jour un grimpeur existant
router.post("/updateClimber", (req, res) => {
    const { climberId, name, mail, sexe} = req.body;

    db.query("UPDATE Climber SET name = ?, mail = ?, sexe = ? WHERE climberId = ?", 
        [name, mail, sexe, climberId], 
        (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(result.affectedRows > 0 ? { message: "Grimpeur mis à jour" } : { error: "Grimpeur non trouvé" });
    });
});

// Supprimer un grimpeur
router.delete("/deleteClimber", (req, res) => {
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

module.exports = router;
