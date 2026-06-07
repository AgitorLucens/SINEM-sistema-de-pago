import { useEffect, useRef, useCallback } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import './modal.css';

const Modal = ({ isOpen, onClose, children, title }) => {
    const overlayRef = useRef(null);
    const previousFocusRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement;

        const focusableElements = overlayRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements?.[0];
        if (firstFocusable) {
            firstFocusable.focus();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previousFocusRef.current?.focus();
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={overlayRef}
        >
            <div
                className="modal-container"
            >
                <div className="modal-header">
                    <h2 id="modal-title" className="modal-title">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="ex-boton"
                        aria-label="Cerrar"
                    >
                        <Cross1Icon width="25px" height="25px"/>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
