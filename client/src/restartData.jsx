import { useState, useEffect } from "react";

function RestartDataPage() {
    const [message, setMessage] = useState("");

    const handleClick = async () => {
        try {
            const response = await fetch("http://localhost:3000/restartData", {
                method: "DELETE"
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Supprimer toutes les données</h2>
            <p>Attention, cette action est irréversible</p>
            <button onClick={handleClick}>Supprimer toutes les données</button>
            <p>{message}</p>
        </div>
    );
}

export default RestartDataPage;
