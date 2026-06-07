import Modal from './Modal.jsx';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, itemName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div>
                <div className="alert-delete">
                    <p>
                        <strong>¿Estás seguro de que quieres eliminar este {itemName}?</strong> Esta accion no se puede deshacer.
                    </p>
                </div>
                <button className="btn-delete-confirm" onClick={onConfirm}>
                    Eliminar
                </button>
                <button className="btn-ghost-export" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
