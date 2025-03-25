import { useState, useEffect } from "react";

function ClimberModifPage({setClimber, setAdminPage}) {
    const [climbers, setClimbers] = useState([]);
    // Récupérer tous les grimpeurs existants au chargement de la page
    useEffect(() => {
        fetch("http://localhost:3000/getClimbers")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des grimpeurs");
                }
                return response.json();
            })
            .then(data => setClimbers(data))
            .catch(error => console.log(error.message));
    }, []);

    return (
        <div>
            <AddNewClimber setClimbers={setClimbers} />
            <ClimberList climbers={climbers} setClimbers={setClimbers} setClimber={setClimber} setAdminPage={setAdminPage} />
        </div>
    );
}

function AddNewClimber({ setClimbers }) {
    const [formData, setFormData] = useState({
        name: "",
        mail: "",
        sexe: "M"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/addClimber", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setClimbers((prevClimbers) => [
                    ...prevClimbers,
                    { climberId: data.id, ...formData }
                ]);

                // Réinitialiser le formulaire
                setFormData({ name: "", mail: "", sexe: "M" });
            } else {
                console.error("Erreur serveur :", data.error);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    };

    return (
        <div>
            <h1>Ajouter un Grimpeur</h1>
            <form style={{ border: "1px solid gray", padding: "10px", margin: "10px" }} onSubmit={handleSubmit}>
                <label>Nom :</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <br />

                <label>Email :</label>
                <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                <br />

                <label>Sexe :</label>
                <select name="sexe" value={formData.sexe} onChange={handleChange}>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                </select>
                <br />

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

function ClimberList({ climbers, setClimbers ,setClimber, setAdminPage}) {
    return (
        <div>
            <h2>Liste des Grimpeurs</h2>
            {climbers.length > 0 ? (
                climbers.map((climber) => <ModifClimber key={climber.climberId} setClimbers={setClimbers} climber={climber} setClimber={setClimber} setAdminPage={setAdminPage}/>)
            ) : (
                <p>Aucun grimpeur pour l'instant.</p>
            )}
        </div>
    );
}

function ModifClimber({ setClimbers, climber, setClimber, setAdminPage }) {
    const [formData, setFormData] = useState({
        name: climber.name,
        mail: climber.mail || "",
        sexe: climber.sexe
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/updateClimber", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ climberId: climber.climberId, ...formData })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour");
            }

            setClimbers((prevClimbers) =>
                prevClimbers.map((c) => (c.climberId === climber.climberId ? { ...c, ...formData } : c))
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/deleteClimber?climberId=${climber.climberId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setClimbers((prevClimbers) => prevClimbers.filter((c) => c.climberId !== climber.climberId));
            } else {
                console.error("Erreur lors de la suppression du grimpeur.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête de suppression :", error);
        }
    };

    return (
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
            <h3>Modifier {climber.name}</h3>
            <form onSubmit={handleUpdate}>
                <label>Nom :</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <br />

                <label>Email :</label>
                <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                <br />

                <label>Sexe :</label>
                <select name="sexe" value={formData.sexe} onChange={handleChange}>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                </select>
                <br />

                <button type="submit">Modifier</button>
                <button type="button" onClick={handleDelete}>Supprimer</button>
                <button 
                    type="button" 
                    onClick={() => {
                        setClimber(climber);
                        setAdminPage("perfMofif"); // Remplace "performances" par la valeur que tu veux
                    }}
                    >
                        Voir les performances
                </button>
            </form>
        </div>
    );
}

export default ClimberModifPage;
