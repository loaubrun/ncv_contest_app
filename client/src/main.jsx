import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import PerformancePage from "./perfBloc";
import ClassementPage from "./classements";
import LoginPage from "./login";

function Main() {
  const [page, setPage] = useState("login");
  const [climber, setClimber] = useState({});
  console.log("da", climber);
  return (
    <div>
      {page === "login" && <LoginPage setClimber={setClimber} setPage={setPage} />}
      {page === "performance" && <PerformancePage climber={climber} setPage={setPage}/>}
      {page === "classements" && <ClassementPage climber={climber} setPage={setPage}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
