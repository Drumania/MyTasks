import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/firebase/firebase";
import { useAuth } from "@/context/AuthContext";

export default function UserSettingsModal({ visible, onHide }) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhotoFile(file);
  };

  const handleSave = async () => {
    setLoading(true);
    let photoURL = user.photoURL;

    try {
      if (photoFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });

      alert("Perfil actualizado");
      onHide();
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      alert("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header="Configuración de Usuario"
      visible={visible}
      onHide={onHide}
      style={{ width: "400px" }}
      modal
    >
      <div className="mb-3">
        <label>Nombre</label>
        <InputText
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-100"
        />
      </div>

      <div className="mb-3">
        <label>Foto de perfil</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
      </div>

      <Button
        label="Guardar"
        icon="pi pi-check"
        className="w-100"
        onClick={handleSave}
        loading={loading}
      />
    </Dialog>
  );
}
