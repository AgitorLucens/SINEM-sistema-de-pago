import { useState } from "react";

const EditableCell = ({
  value,
  options,          // array opcional → si existe, usa select
  onSave,
  width = "100%",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const startEditing = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onSave(tempValue);
    }
  };

  if (isEditing) {
    return options ? (
      <select
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={finishEditing}
        style={{
          width,
          padding: "0.25rem",
          borderRadius: "0.375rem",
          border: "1px solid #d1d5db",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        autoFocus
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={finishEditing}
        style={{
          width,
          padding: "0.25rem",
          borderRadius: "0.375rem",
          border: "1px solid #d1d5db",
        }}
      />
    );
  }

  return (
    <div
      onDoubleClick={startEditing}
      style={{ cursor: "pointer" }}
      title="Doble click para editar"
    >
      {value}
    </div>
  );
};

export default EditableCell;
