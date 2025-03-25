const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.post("/login", (req, res) => {
    const { name, mail } = req.body;

    if (!name || !mail) {
        return res.status(400).json({ id: -1, error: "Veuillez fournir un nom et un mail." });
    }

    db.query("SELECT * FROM Climber WHERE name = ? AND mail = ?", [name, mail], (err, results) => {
        if (err) return res.status(500).json({ id: -1, error: "Erreur serveur" });
        res.json(results.length > 0 ? results : { climberId: -1 });
    });
});

module.exports = router;
