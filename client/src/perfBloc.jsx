import { useEffect, useState } from "react";

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


    const zones = [
        { name: "Dalle", points: [[0, 100], [0, 80], [17, 80], [17, 100]] },
        { name: "Petit Dévert", points: [[12, 75], [12, 62], [20, 65], [20, 80]] },
        { name: "Grand Dévert", points: [[15, 60], [15, 45], [27, 40], [25, 63]] },
        { name: "Dévert Droit", points: [[10, 43], [10, 13], [20, 15], [23, 40]] },
        { name: "Diamant", points: [[0, 0], [25, 0], [25, 15], [0, 15]] },
        { name: "BCMD face droite", points: [[70, 90], [100, 90], [100, 100], [70, 100]] },
        { name: "BCMD face centrale", points: [[65, 90], [65, 68], [77, 68], [80, 90]] },
        { name: "BCMD face gauche", points: [[67, 66], [78, 58], [100, 57], [100, 67]] },
        { name: "BCMG face droite", points: [[72, 42], [72, 30], [96, 31], [100, 40]] },
        { name: "BCMG face centrale", points: [[70, 40], [63, 35], [63, 12], [70, 6]] },
        { name: "BCMG face gauche", points: [[70, 6], [70, 0], [100, 0], [100, 6]] },
       
    ];

    function pointInPolygon(x, y, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i][0], yi = polygon[i][1];
            let xj = polygon[j][0], yj = polygon[j][1];
            let intersect = ((yi > y) !== (yj > y)) &&
                            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function findSecteur(event) {
        let rect = event.target.getBoundingClientRect();
        let x = ((event.clientX - rect.left) / rect.width) * 100;
        let y = ((event.clientY - rect.top) / rect.height) * 100;
        let zoneName = "all";
        for (let zone of zones) {
            if (pointInPolygon(x, y, zone.points)) {
                zoneName = zone.name;
                break;
            }
        }
        setSecteur(zoneName);
    };

    

    return (
        <div>
            <div className="mapContainer">
                <img
                    onClick={findSecteur}
                    className="map"
                    src="images/mapBloc.png"
                />
            </div>
            {secteur !== "all" && (
                <div className="secteurContainer">
                    <p>{secteur}</p>
                    <img
                        onClick={() => setSecteur("all")}
                        src="images/croix.png"
                        style={{ height: "1em", width: "auto", verticalAlign: "middle" }}
                    />
                </div>
            )}

            
            <div className="blocContainer">
                {blocs
                    .filter(bloc => secteur === "all" || bloc.zone.toString() === secteur)
                    .map((bloc) => (
                        <Bloc key={bloc.blocId} bloc={bloc} climberId={climber.climberId} setBlocs={setBlocs} blocs={blocs}/>
                    ))}
            </div>
        </div>
    );
}

function Bloc({ bloc, climberId, setBlocs, blocs }) {
    

    const togglePerf = async () => {
        const url = bloc.checked ? "http://localhost:3000/deletePerf" : "http://localhost:3000/addPerf";
        const method = bloc.checked ? "DELETE" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocId: bloc.blocId, climberId })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la requête");
            }

            setBlocs(blocs.map(b => 
                b.blocId === bloc.blocId ? { ...b, checked: !b.checked } : b
            ));
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    return (
        <div className = "bloc" >
            <div>
                <img 
                    className="imageBloc"
                    src="https://www.coupe-du-monde-escalade.com/wp-content/uploads/2023/10/20230709_9252_JANVIRT_240ppi-scaled.jpg"
                /> 
            </div> 
            <div>
                <img
                    className="imageMap"
                    src="images/mapBloc.png"
                />
            </div>
            <div>{bloc.name}</div>
            <input 
                type="checkbox" 
                checked={bloc.checked} 
                onChange={togglePerf} 
                disabled={bloc.juged === 1}
            />
        </div>
    );
}

export default Blocs;