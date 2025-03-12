import { useState } from "react";

function LoginPage({ setClimber, setPage }) {
    const [formData, setFormData] = useState({
        name: "",
        mail: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.climberId !== -1) {
                console.log("Connexion réussie, Grimpeur:", data);
                setClimber(data[0]);
                setPage("performance");
            } else {
                setError("Nom ou email incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setError("Erreur serveur. Réessayez plus tard.");
        }
    };

    return (
        <div>
            <h1>Page de Connexion</h1>
            <form id="loginForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Nom :</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                <label htmlFor="mail">Email :</label>
                <input 
                    type="email" 
                    id="mail" 
                    name="mail" 
                    value={formData.mail} 
                    onChange={handleChange} 
                    required 
                />

                <button type="submit">Se connecter</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
