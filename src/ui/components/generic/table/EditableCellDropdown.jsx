import { useState, memo } from "react";
import SelectRadix from "../select/SelectRadix.jsx";

import './editabletable.css';
const EditableCellDropdown = memo(({
  value,
  options,
  valueKey = "value",
  labelKey = "label",
  onSave,
  width = "100%",
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => setIsEditing(true);

  if (isEditing && options) {
    const currentOption = options.find(
      opt => opt[labelKey] === value || opt[valueKey] === value
    );

    const currentValueId = currentOption?.[valueKey] ?? "";
    const normalizedValue =
      options.some(opt => opt[valueKey] === currentValueId)
        ? currentValueId
        : "";

    return (
      <div style={{ width }}>
        <SelectRadix
          value={normalizedValue}
          valueKey={valueKey}
          labelKey={labelKey}
          options={options}
          placeholder="Seleccione"
          onChange={(newValue) => {
            setIsEditing(false);
            if (newValue !== value) {
              onSave(newValue);
            }
          }}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startEditing();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={value ? `Editar: ${value}` : "Editar celda vacía"}
      style={{ cursor: "pointer" }}
      title="Doble click o Enter para editar"
    >
      {value || "—"}
    </div>
  );
});

export default EditableCellDropdown;