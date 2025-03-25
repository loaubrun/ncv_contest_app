import { useState, useEffect } from "react";
import PerformancePage from "./perfBloc";

function PerfModifPage({ climber }) {
    return (
        <div>
            <PerformancePage climber={climber} />
        </div>
    );
}


export default PerfModifPage;
