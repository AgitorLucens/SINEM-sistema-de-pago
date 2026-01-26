import { useEffect, useRef, useState } from "react";
import "./editablecellinput.css";

const sanitizePhone = (val) =>
  val.replace(/[^\d]/g, "").slice(0, 8);

const formatPhone = (val) => {
  if (!val) return "—";
  return val.length > 4
    ? `${val.slice(0, 4)}-${val.slice(4)}`
    : val;
};

const EditableCellPhone = ({
  value,
  onSave,
  width = "100%",
  placeholder = "—",
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

    if (localValue !== value) {
      onSave?.(localValue);
    }
  };

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
        type="text"
        value={localValue}
        onChange={(e) => {
          setLocalValue(sanitizePhone(e.target.value));
        }}
        onBlur={commitChange}
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
      {value ? formatPhone(value) : placeholder}
    </div>
  );
};

export default EditableCellPhone;