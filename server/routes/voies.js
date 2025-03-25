const express = require("express");
const db = require("../config/db");
const upload = require("../config/multer");

const router = express.Router();

// Récupérer tous les voies
router.get("/getVoies", (req, res) => {
    db.query("SELECT * FROM Voies", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Récupérer tous les voies et les degaines clipées 
router.post("/getVoies", (req, res) => {
    const { climberId } = req.body;

    db.query("SELECT voie.voieId, voie.name, voie.photoName, color, juged, voie.secteur, nbDegaine, COALESCE(perf_voie.maxDegaine, 0) AS perf FROM voie LEFT JOIN perf_voie ON voie.voieId = perf_voie.voieId AND perf_voie.climberId = ? GROUP BY voie.voieId", 
        [climberId],
        (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});


// Ajouter une nouvelle voie
router.post("/addVoie", upload.single("image"), (req, res) => {
    const { name, color, difficulty, juged, secteur, nbDegaine } = req.body;
    const photoName = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !color || !difficulty || !photoName || !juged || !secteur || !nbDegaine) {
        return res.status(400).json({ error: "Données incomplètes" });
    }

    db.query("INSERT INTO voie (name, color, photoName, difficulty, juged, secteur, nbDegaine) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, color, photoName, difficulty, juged, secteur, nbDegaine],  
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json({ message: "Voie ajouté avec succès", id: result.insertId, photoName });
        }
    );
});

// Mettre à jour une voie existante
router.post("/updateVoie", upload.single("image"), (req, res) => {
    const { id, name, color, difficulty, juged, secteur, nbDegaine } = req.body;
    const photoName = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = photoName 
        ? "UPDATE voie SET name = ?, color = ?, difficulty = ?, juged = ?, secteur = ?, nbDegaine = ?, photoName = ? WHERE voieId = ?"
        : "UPDATE voie SET name = ?, color = ?, difficulty = ?, juged = ?, secteur = ?, nbDegaine = ? WHERE voieId = ?";

    const params = photoName 
        ? [name, color, difficulty, juged, secteur, nbDegaine, photoName, id] 
        : [name, color, difficulty, juged, secteur, nbDegaine, id];

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(result.affectedRows > 0 ? { message: "Voie mis à jour" } : { error: "Voie non trouvé" });
    });
});


// Supprimer une voie
router.delete("/deleteVoie", (req, res) => {
    const voieId = req.query.voieId;

    if (!voieId) {
        return res.status(400).json({ error: "L'id de la voie est requis !" });
    }

    const sql = "DELETE FROM voie WHERE voieId = ?";
    db.query(sql, [voieId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression :", err);
            return res.status(500).json({ error: "Erreur interne du serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Voie non trouvé" });
        }

        res.json({ success: true, message: "Voie supprimé avec succès !" });
    });
});


module.exports = router;
