import { useEffect, useState } from "react";

function PerformancePage({ climber, setPage }) {
    return (
        <div>
            <h1>Page de Performances</h1>
            <Blocs climber={climber} />
            <button onClick={() => setPage("login")}> Se déconnecter </button>
            <button onClick={() => setPage("classements")}> Acceder aux classements </button>
        </div>
    );
}

function Blocs({ climber }) {
    const [blocs, setBlocs] = useState([]);
    const [secteur, setSecteur] = useState("all");

    useEffect(() => {
        getBlocs();
    }, []); 

    const getBlocs = async () => {
        try {
            const response = await fetch("http://localhost:3000/getBlocs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ climberId : climber.climberId })
            });
    
            const data = await response.json();
            setBlocs(data);
        } catch (error) {   
            console.error("Erreur:", error);
        }
    };

    

    return (
        <div>
            <select id="secteur" onChange={(e) => setSecteur(e.target.value)}>
                <option value="all">Tous</option>
                <option value="1">Secteur 1</option>
                <option value="2">Secteur 2</option>
                <option value="3">Secteur 3</option>
            </select>

            <h2>Liste des Blocs</h2>
            <div className="bloc-list">
                {blocs
                    .filter(bloc => secteur === "all" || bloc.zone.toString() === secteur)
                    .map((bloc) => (
                        <Bloc key={bloc.blocId} bloc={bloc} climberId={climber.climberId} />
                    ))}
            </div>
        </div>
    );
}

function Bloc({ bloc, climberId }) {
    const [checked, setChecked] = useState(bloc.checked); 

    const togglePerf = async () => {
        const url = checked ? "http://localhost:3000/deletePerf" : "http://localhost:3000/addPerf";
        const method = checked ? "DELETE" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocId: bloc.blocId, climberId })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la requête");
            }

            setChecked(!checked);
            bloc.checked = checked;
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    return (
        <div className="nnnb">
            <p>Bloc ID: {bloc.blocId}</p>
            <p>Nom: {bloc.blocName}</p>
            <p>Couleur: {bloc.color}</p>
            <label>
                Performance réalisée :
                <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={togglePerf} 
                />
            </label>
        </div>
    );
}

export default PerformancePage;
