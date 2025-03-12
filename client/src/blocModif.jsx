import { useState, useEffect } from "react";

function BlocModifPage({ setAdminPage }) {
   return (
    <div>

        <AddNewBloc/>
        <BlocList/>
    </div>
   )
}

function AddNewBloc() {
    const [formData, setFormData] = useState({
        blocName: "",
        color: "",
        juged: false,
        zone: "1",
        image: null
    });
    const [uploadStatus, setUploadStatus] = useState("");

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
        };

        const dataToSend = new FormData();
        dataToSend.append("blocName", formData.blocName);
        dataToSend.append("color", formData.color);
        dataToSend.append("image", formData.image);
        dataToSend.append("juged", formData.juged ? 1 : 0);
        dataToSend.append("zone", formData.zone);

        try {
            const response = await fetch("http://localhost:3000/addBloc", {
                method: "POST",
                body: dataToSend
            });
            const data = await response.json();
            setUploadStatus(data.message);
            setFormData({blocName: "", color: "", juged: false, zone: "1", image: null});
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            setUploadStatus("Erreur serveur. Réessayez plus tard.");
        }
    };

    return (
        <div>
            <h1>Ajouter un Bloc</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Nom du Bloc :</label>
                <input type="text" name="blocName" value={formData.blocName} onChange={handleChange} required/>
                <br />

                <label>Couleur :</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required/>
                <br />

                <label>Bloc jugé :</label>
                <input type="checkbox" name="juged" checked={formData.juged} onChange={handleChange} />
                <br />

                <label>Numéro secteur :</label>
                <select name="zone" value={formData.zone} onChange={handleChange}>
                    <option value="1">Secteur 1</option>
                    <option value="2">Secteur 2</option>
                    <option value="3">Secteur 3</option>
                    <option value="4">Secteur 4</option>
                </select>
                <br />

                <label>Image du Bloc :</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} required/>
                <br />

                <button type="submit">Ajouter</button>
            </form>

            {uploadStatus && <p style={{ color: "red" }}>{uploadStatus}</p>}
        </div>
    );
}

function BlocList() {
    const [blocs, setBlocs] = useState([]);

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
            <h2>Liste des Blocs</h2>
            {blocs.length > 0 ? (
                blocs.map((bloc) => <ModifBloc key={bloc.blocId} bloc={bloc} />)
            ) : (
                <p>Aucun bloc pour l'instant.</p>
            )}
        </div>
    );
}

function ModifBloc({ bloc }) {
    const [formData, setFormData] = useState({
        blocName: bloc.blocName,
        color: bloc.color,
        juged: bloc.juged,
        zone: bloc.zone,
        image: null
    });

    const [uploadStatus, setUploadStatus] = useState("");

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
        dataToSend.append("blocName", formData.blocName);
        dataToSend.append("color", formData.color);
        dataToSend.append("juged", formData.juged ? 1 : 0);
        dataToSend.append("zone", formData.zone);
        if (formData.image) {
            dataToSend.append("image", formData.image);
        }

        try {
            const response = await fetch("http://localhost:3000/updateBloc", {
                method: "POST",
                body: dataToSend
            });
            const data = await response.json();
            setUploadStatus(data.message);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setUploadStatus("Erreur serveur. Réessayez plus tard.");
        }
    };

    return (
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
            <h3>Modifier {bloc.blocName}</h3>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
                <label>Nom du Bloc :</label>
                <input type="text" name="blocName" value={formData.blocName} onChange={handleChange} required />
                <br />

                <label>Couleur :</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required />
                <br />

                <label>Bloc jugé :</label>
                <input type="checkbox" name="juged" checked={formData.juged} onChange={handleChange} />
                <br />

                <label>Numéro secteur :</label>
                <select name="zone" value={formData.zone} onChange={handleChange}>
                    <option value="1">Secteur 1</option>
                    <option value="2">Secteur 2</option>
                    <option value="3">Secteur 3</option>
                    <option value="4">Secteur 4</option>
                </select>
                <br />

                <label>Image du Bloc (optionnel) :</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
                <br />

                <button type="submit">Modifier</button>
            </form>

            {uploadStatus && <p style={{ color: "green" }}>{uploadStatus}</p>}
        </div>
    );
}

export default BlocModifPage;
