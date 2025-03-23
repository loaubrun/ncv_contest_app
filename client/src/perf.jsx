import { useEffect, useState } from "react";
import Blocs from "./perfBloc";
import Voies from "./perfVoie";

function PerformancePage({ climber, setPage }) {
    const [categorie, setCategorie] = useState("bloc");
    return (
        <div>
            <div className="entete">
                <button onClick={() => setCategorie("voie")}> Voie </button>
                <button onClick={() => setCategorie("bloc")}> Bloc </button>
                <button onClick={() => setPage("classements")}> Acceder aux classements </button>
                <button onClick={() => setPage("login")}> Se déconnecter </button>
            </div>
            {categorie == "bloc" && (<Blocs climber={climber} />)}
            {categorie == "voie" && (<Voies climber={climber} />)}
            
        </div>
    );
}

export default PerformancePage;