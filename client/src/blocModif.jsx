import { useState, useEffect } from "react";

function BlocModifPage() {
    const [blocs, setBlocs] = useState([]);

    // On récupere au début tous les blocs déja créés
    useEffect(() => {
        fetch("http://localhost:3000/getBlocs")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des blocs");
                }
                return response.json();
            })
            .then(data => setBlocs(data))
            .catch(error => console.log(error.message));
    }, []);
    return (
    <div>
        <AddNewBloc setBlocs={setBlocs} />
        <BlocList blocs={ blocs } setBlocs={ setBlocs } />
    </div>
   )
}

function AddNewBloc({ setBlocs }) {
    const [formData, setFormData] = useState({
        name: "",
        color: "",
        juged: false,
        secteur: "Dalle",
        image: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.image) {
            alert("Veuillez sélectionner une image !");
            return false;
        }
    
        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("color", formData.color);
        dataToSend.append("image", formData.image);
        dataToSend.append("juged", formData.juged ? 1 : 0);
        dataToSend.append("secteur", formData.secteur);
    
        try {
            const response = await fetch("http://localhost:3000/addBloc", {
                method: "POST",
                body: dataToSend
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setBlocs((prevBlocs) => [
                    ...prevBlocs,
                    {
                        blocId: data.id,
                        name: formData.name,
                        color: formData.color,
                        photoName: data.photoName, 
                        juged: formData.juged ? 1 : 0,
                        secteur: formData.secteur
                    }
                ]);
    
                // Réinitialiser le formulaire
                setFormData({ name: "", color: "", juged: false, secteur: "1", image: null });
            } else {
                console.error("Erreur serveur :", data.error);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    };
    

    return (
        <div>
            <h1>Ajouter un Bloc</h1>
            <form style={{ border: "1px solid gray", padding: "10px", margin: "10px" }} onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Nom du Bloc :</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                <br />

                <label>Couleur :</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required/>
                <br />

                <label>Bloc jugé :</label>
                <input type="checkbox" name="juged" checked={formData.juged} onChange={handleChange} />
                <br />

                <label>Numéro secteur :</label>
                <select name="secteur" value={formData.secteur} onChange={handleChange}>
                    <option value="Dalle">Dalle</option>
                    <option value="Petit Dévert">Petit Dévert</option>
                    <option value="Grand Dévert">Grand Dévert</option>
                    <option value="Dévert Droit">Dévert Droit</option>
                    <option value="Diamant">Diamant</option>
                    <option value="BCMD face droite">BCMD face droite</option>
                    <option value="BCMD face centrale">BCMD face centrale</option>
                    <option value="BCMD face gauche">BCMD face gauche</option>
                    <option value="BCMG face droite">BCMG face droite</option>
                    <option value="BCMG face centrale">BCMG face centrale</option>
                    <option value="BCMG face gauche">BCMG face gauche</option>
                </select>
                <br />

                <label>Image du Bloc :</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} required/>
                <br />

                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

function BlocList({blocs, setBlocs}) {
    return (
        <div>
            <h2>Liste des Blocs</h2>
            {blocs.length > 0 ? (
                blocs.map((bloc) => <ModifBloc key={bloc.blocId} setBlocs = {setBlocs} bloc={bloc} />)
            ) : (
                <p>Aucun bloc pour l'instant.</p>
            )}
        </div>
    );
}

function ModifBloc({ setBlocs, bloc }) {
    const [formData, setFormData] = useState({
        name: bloc.name,
        color: bloc.color,
        juged: bloc.juged,
        secteur: bloc.secteur,
        image: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const dataToSend = new FormData();
        dataToSend.append("id", bloc.blocId);
        dataToSend.append("name", formData.name);
        dataToSend.append("color", formData.color);
        dataToSend.append("juged", formData.juged ? 1 : 0);
        dataToSend.append("secteur", formData.secteur);
        if (formData.image) {
            dataToSend.append("image", formData.image);
        }

        try {
            const response = await fetch("http://localhost:3000/updateBloc", {
                method: "POST",
                body: dataToSend
            });
            const data = await response.json();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/deleteBloc?blocId=${bloc.blocId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setBlocs((prevBlocs) => prevBlocs.filter((b) => b.blocId !== bloc.blocId));
            } else {
                console.error("Erreur lors de la suppression du bloc.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête de suppression :", error);
        }
    };

    return (
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
            <h3>Modifier {bloc.name}</h3>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
                <label>Nom du Bloc :</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <br />

                <label>Couleur :</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required />
                <br />

                <label>Bloc jugé :</label>
                <input type="checkbox" name="juged" checked={formData.juged} onChange={handleChange} />
                <br />

                <label>Numéro secteur :</label>
                <select name="secteur" value={formData.secteur} onChange={handleChange}>
                    <option value="Dalle">Dalle</option>
                    <option value="Petit Dévert">Petit Dévert</option>
                    <option value="Grand Dévert">Grand Dévert</option>
                    <option value="Dévert Droit">Dévert Droit</option>
                    <option value="Diamant">Diamant</option>
                    <option value="BCMD face droite">BCMD face droite</option>
                    <option value="BCMD face centrale">BCMD face centrale</option>
                    <option value="BCMD face gauche">BCMD face gauche</option>
                    <option value="BCMG face droite">BCMG face droite</option>
                    <option value="BCMG face centrale">BCMG face centrale</option>
                    <option value="BCMG face gauche">BCMG face gauche</option>
                </select>
                <br />

                <label>Image du Bloc (optionnel) :</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
                <br />

                <button type="submit">Modifier</button>
                <button type="button" onClick={handleDelete}>Supprimer</button>
            </form>
        </div>
    );
}

export default BlocModifPage;
