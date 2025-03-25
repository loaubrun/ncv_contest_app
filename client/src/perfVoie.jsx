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
                    .filter(voie => secteur === "all" || voie.secteur.toString() === secteur)
                    .map((voie) => (
                        <Voie key={voie.voieId} voie={voie} climberId={climber.climberId} setVoies={setVoies} voies={voies}/>
                    ))}
            </div>
        </div>
    );
}

function Voie({ voie, climberId, setVoies, voies }) {


    const setPerf = async (perf) => {
        const url = perf === 0 ? "http://localhost:3000/deletePerfVoie" : "http://localhost:3000/addPerfVoie";
        const method = perf === 0 ? "DELETE" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ voieId: voie.voieId, climberId, perf })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la requête");
            }

            setVoies(voies.map(v => 
                v.voieId === voie.voieId ? { ...v, perf } : v
            ));
        } catch (error) {
            console.error("Erreur:", error);
        }
    }
    return (
        <div style={{ border: "2px solid black" }}>
            <p>{voie.name}</p>
            <p>
                <select value={voie.perf} onChange={(event) => {setPerf(event.target.value)}}>
                    {Array.from({ length: voie.nbDegaine + 1 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                / {voie.nbDegaine}
            </p>

            <div>
                Top : 
                <input 
                    type="checkbox" 
                    checked={voie.perf === voie.nbDegaine} 
                    onChange={() => {setPerf(voie.perf === voie.nbDegaine ? 0 : voie.nbDegaine)}} 
                />
            </div>
            
        </div>
    );
}

export default Voies;