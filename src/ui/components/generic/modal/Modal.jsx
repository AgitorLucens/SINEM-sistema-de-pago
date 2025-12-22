import { Cross1Icon } from "@radix-ui/react-icons";
import './modal.css';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Fondo oscuro y fijo que cubre toda la pantalla
        <div 
            className="modal-overlay"
        >
            {/* Contenedor del contenido del modal */}
            <div 
                className="modal-container"
            >
                {/* Título y botón de cerrar */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="ex-boton"
                    >
                        {/*&times;*/}
                        <Cross1Icon width="25px" height="25px"/>
                    </button>
                </div>
                <div className="modal-body">
                    {/* Contenido dinámico del modal */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;