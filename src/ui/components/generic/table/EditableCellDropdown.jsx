import { useState } from "react";
import SelectRadix from "../select/SelectRadix.jsx";

import './editabletable.css';
const EditableCellDropdown = ({
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
      style={{ cursor: "pointer" }}
      title="Doble click para editar"
    >
      {value || "—"}
    </div>
  );
};

export default EditableCellDropdown;