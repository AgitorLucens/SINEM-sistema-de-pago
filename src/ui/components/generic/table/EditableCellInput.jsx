import {useEffect,useState,useRef} from "react";

import './editablecellinput.css';
const EditableCellInput = ({
                    value,
                    onSave,
                    type = "text",       // text | number
                    pattern = "",
                    placeholder = "—",
                    width = "100%",
                    formatDisplay,          
                }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value ?? "");
    const inputRef = useRef(null);

    const startEditing = () => {
        setLocalValue(value ?? "");
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setLocalValue(value ?? "");
        setIsEditing(false);
    };

    const commitChange = () => {
        setIsEditing(false);

        // no guardar si no cambiO
        if (String(localValue) !== String(value)) {
            onSave?.(localValue);
        }
    };

    // Autofocus
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type={type}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={commitChange}
                pattern={pattern}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commitChange();
                    if (e.key === "Escape") cancelEditing();
                }}
                style={{ width }}
                className="editable-input"
            />
        );
    }

    return (
        <div
            onDoubleClick={startEditing}
            style={{ cursor: "pointer", width }}
            title="Doble click para editar"
        >
            {formatDisplay ? formatDisplay(value) : value || placeholder}
        </div>
    );
}

export default EditableCellInput;