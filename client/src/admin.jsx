import { useState } from "react";
import BlocModifPage from "./blocModif";

function AdminPage({ setPage }) {
    const [page, setAdminPage] = useState("blocModif");
    const [climber, setClimber] = useState({});

    return (
        <div>
        {page === "blocModif" && <BlocModifPage setPage={setAdminPage} />}
        {page === "climberModif" && <PerformancePage setClimber={climber} setPage={setAdminPage}/>}
        {page === "perfMofif" && <ClassementPage climber={climber} setPage={setAdminPage}/>}
        </div>
    );
}


export default AdminPage;
