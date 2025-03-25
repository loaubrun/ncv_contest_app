import { useState } from "react";
import BlocModifPage from "./blocModif";
import ClimberModifPage from "./climberModif";
import PerfModifPage from "./perfModif";
import RestartDataPage from "./restartData";

function AdminPage({ setPage }) {
    const [page, setAdminPage] = useState("blocModif");
    const [climber, setClimber] = useState({});

    return (
        <div>
        <button onClick={() => setAdminPage("blocModif")}> Modifier les blocs </button>
        <button onClick={() => setAdminPage("climberModif")}> Modifier les grimpeurs </button>
        <button onClick={() => setAdminPage("restartData")}> Supprimer toutes les données </button>
        {page === "blocModif" && <BlocModifPage/>}
        {page === "climberModif" && <ClimberModifPage setAdminPage={setAdminPage} setClimber={setClimber}/>}
        {page === "perfMofif" && <PerfModifPage climber={climber}/>}
        {page === "restartData" && <RestartDataPage climber={climber}/>}
        </div>
    );
}


export default AdminPage;
