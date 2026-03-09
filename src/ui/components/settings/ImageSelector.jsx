import React, { useState } from 'react';
import './imageselector.css';
import { PlusIcon, TrashIcon } from '../icons/Icons';

const ImageSelector = ({ images = [], onAdd, onSelect, onDelete }) => {
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const toggleDeleteMode = () => {
        if (isDeleteMode && selectedImages.size > 0) {
            setShowConfirmModal(true);
        } else {
            setIsDeleteMode(!isDeleteMode);
            setSelectedImages(new Set());
        }
    };

    const handleImageClick = (img, index) => {
        if (isDeleteMode) {
            // Logic for delete mode: select/deselect
            const imgId = img.id || index; // Fallback to index if no ID (though ID is preferred)
            const newSelected = new Set(selectedImages);
            if (newSelected.has(imgId)) {
                newSelected.delete(imgId);
            } else {
                newSelected.add(imgId);
            }
            setSelectedImages(newSelected);
        } else {
            // Normal mode: select as current image
            if (onSelect) {
                onSelect((img && img.id) ? {id: img.id, current_image: (img.current_image === 1 ? 0 : 1)} : {id: index, current_image: 1});
            }
        }
    };

    const confirmDelete = () => {
        if (onDelete) {
            onDelete(Array.from(selectedImages));
        }
        setShowConfirmModal(false);
        setIsDeleteMode(false);
        setSelectedImages(new Set());
    };

    return (
        <div className="image-selector-container">
            {images.map((img, index) => {
                const imgId = img.id || index;
                const isSelectedForDelete = selectedImages.has(imgId);
                return (
                    <div 
                        key={imgId} 
                        className={`image-item ${img.current_image === 1 ? 'selected' : ''} ${isSelectedForDelete ? 'delete-selected' : ''}`}
                        onClick={() => handleImageClick(img, index)}
                    >
                        <img src={img.image} alt={`Selector ${index}`} />
                        {isDeleteMode && (
                            <div className="delete-overlay">
                                {isSelectedForDelete && <div className="delete-check">✓</div>}
                            </div>
                        )}
                    </div>
                );
            })}
            
            <div className="image-item add-button" onClick={() => {
                                                setIsDeleteMode(false);
                                                onAdd();
            }}>
                <PlusIcon size={32} />
            </div>

            <div 
                className={`image-item delete-button ${isDeleteMode ? 'active' : ''}`} 
                onClick={toggleDeleteMode}
            >
                <TrashIcon size={32} color={isDeleteMode ? 'red' : 'currentColor'} />
            </div>

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete {selectedImages.size} image(s)?</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageSelector;