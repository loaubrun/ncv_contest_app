import { useEffect, useState } from "react";

function Voies({ climber }) {
    const [voies, setVoies] = useState([]);
    const [secteur, setSecteur] = useState("all");

    useEffect(() => {
        getVoies();
    }, []); 

    const getVoies = async () => {
        try {
            const response = await fetch("http://localhost:3000/getVoies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ climberId : climber.climberId })
            });
    
            const data = await response.json();
            setVoies(data);
        } catch (error) {   
            console.error("Erreur:", error);
        }
    };

    

    return (
        <div>          
            <div className="blocContainer">
                {voies
                    .filter(voie => secteur === "all" || voie.zone.toString() === secteur)
                    .map((voie) => (
                        <Voie key={voie.voieId} voie={voie} climberId={climber.climberId} setVoies={setVoies} voies={voies}/>
                    ))}
            </div>
        </div>
    );
}

function Voie({ voie, climberId, setVoies, voies }) {

    return (
        <div>
            <p>{voie.name}</p>
        </div>
    );
}

export default Voies;