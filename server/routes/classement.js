const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Récupérer le classement des grimpeurs en fonction de leur sexe
router.post("/classementBloc", (req, res) => {
    const { sexe } = req.body;
    db.query(
        'SELECT c.name, SUM(tops * pb.top + zones * pb.zone) as score, SUM(essaisTop) essaisTops, SUM(essaisZone) essaisZones FROM (SELECT blocId, 500.0 / NULLIF(SUM(top), 0) as tops, 500/NULLIF(SUM(zone), 0) zones FROM Perf_Bloc JOIN Climber ON Climber.climberId = Perf_Bloc.climberId WHERE Climber.sexe = ? GROUP BY blocId) Points JOIN Perf_Bloc pb ON pb.blocId = Points.blocId JOIN Climber c ON pb.climberId = c.climberId WHERE c.sexe = ? GROUP BY c.name ORDER BY score DESC, essaisTops ASC, essaisZones ASC',
        [sexe, sexe],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Erreur serveur" });
            res.json(results);
    });
});

module.exports = router;
