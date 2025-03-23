const express = require("express");
const db = require("../config/db");
const upload = require("../config/multer");

const router = express.Router();

// Récupérer tous les blocs
router.get("/getBlocs", (req, res) => {
    db.query("SELECT * FROM Bloc", (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});

// Récupérer tous les blocs et les perfs
router.post("/getBlocs", (req, res) => {
    const { climberId } = req.body;

    db.query("SELECT bloc.blocId, bloc.name, bloc.photoName, color, juged, bloc.zone,  COALESCE(COUNT(perf_bloc.blocId), 0) AS checked FROM bloc LEFT JOIN perf_bloc ON bloc.blocId = perf_bloc.blocId AND perf_bloc.climberId = ? GROUP BY bloc.blocId", 
        [climberId],
        (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        res.json(results);
    });
});


// Ajouter un nouveau bloc
router.post("/addBloc", upload.single("image"), (req, res) => {
    const { name, color, juged, zone } = req.body;
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

// Mettre à jour un bloc existant
router.post("/updateBloc", upload.single("image"), (req, res) => {
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

// Supprimer un bloc
router.delete("/deleteBloc", (req, res) => {
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


module.exports = router;
