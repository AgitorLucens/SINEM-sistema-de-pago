
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
        //console.log("Selected image:", img);
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
            <h1>Settings Page</h1>
            
            <section className="settings-section">
                <h2>Image Library</h2>
                <p>Select an image or add a new one.</p>
                <ImageSelector 
                    images={images} 
                    onAdd={handleAddImage} 
                    onSelect={handleSelectImage} 
                    onDelete={handleDeleteImages}
                />
            </section>
        </div>
    );
};

export default Settings;