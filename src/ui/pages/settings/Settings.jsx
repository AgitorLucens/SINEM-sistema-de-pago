
import React, { useState, useEffect } from 'react';
import ImageSelector from "../../components/settings/ImageSelector.jsx";
import sinemLogo from '../../assets/SINEM.png';
import { addImage, getImages, setImage, getCurrentImage } from '../../constant/DBFunctions.jsx';
import './settings.css';

const Settings = () => {
    const [images, setImages] = useState([{image: sinemLogo}]);

    const loadImages = async () => {
        const result = await getImages();
        setImages([{image: sinemLogo}, ...result ]);
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleAddImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                     const base64Image = event.target.result;
                     await addImage({ image: base64Image });
                     loadImages();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleSelectImage = (img) => {
        setImage(img);
        loadImages();
        window.dispatchEvent(new Event("logo-updated"));
    };

    const handleDeleteImages = async (imageIds) => {
        for (const id of imageIds) {
            await window.api.deleteImageById(id);
        }
        loadImages();
        window.dispatchEvent(new Event("logo-updated"));
    };

    return (
        <div className="settings-page">
            <div >
                <div className="section-title">
                    <h1 className="settings-title">Configuración</h1>
                </div>
                <div className="export-header">
                    <p className="settings-subtitle">Personaliza la apariencia y configuración del sistema</p>
                </div>
            </div>
            <div className="settings-content">
                <section className="settings-section">
                    <div className="section-header">
                        <h2 className="section-title">Biblioteca de Imágenes</h2>
                        <p className="section-description">
                            Selecciona una imagen para usar como logo del sistema o agrega nuevas imágenes a tu biblioteca.
                        </p>
                    </div>
                    <div className="section-body">
                        <ImageSelector 
                            images={images} 
                            onAdd={handleAddImage} 
                            onSelect={handleSelectImage} 
                            onDelete={handleDeleteImages}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
