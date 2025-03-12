import { useState } from "react";

function AdminPage({ setPage }) {
    const [adminPage, setAdminPage] = useState("blocModif");
    const [climber, setClimber] = useState({});
    console.log("da", climber);
    return (
        <div>
        {page === "blocModif" && <LoginPage setPage={setAdminPage} />}
        {page === "climberModif" && <PerformancePage setClimber={climber} setPage={setAdminPage}/>}
        {page === "perfMofif" && <ClassementPage climber={climber} setPage={setAdminPage}/>}
        </div>
    );
}



export default AdminPage;
