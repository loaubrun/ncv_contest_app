import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import PerformancePage from "./perf";
import ClassementPage from "./classements";
import LoginPage from "./login";
import AdminPage from "./admin";
import "./styles.css"


function Main() {
  const [page, setPage] = useState("login");
  const [climber, setClimber] = useState({});
  return (
    <div>
      {page === "login" && <LoginPage setClimber={setClimber} setPage={setPage} />}
      {page === "performance" && <PerformancePage climber={climber} setPage={setPage}/>}
      {page === "classements" && <ClassementPage climber={climber} setPage={setPage}/>}
      {page === "admin" && <AdminPage setPage={setPage}/>}
      <button onClick={() => setPage("admin")}> Admin </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
