import { useState, memo } from "react";
import SearchSelectRadix from "../searchselect/SearchSelectRadix.jsx";

const EditableCellSearchDropdown = memo(({
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

    const normalizedValue =
      currentOption?.[valueKey] !== undefined
        ? String(currentOption[valueKey])
        : "";

    return (
      <div style={{ width }}>
        <SearchSelectRadix
          value={normalizedValue}
          options={options}
          valueKey={valueKey}
          labelKey={labelKey}
          open={true}
          onOpenChange={(open) => {
            if (!open) setIsEditing(false);
          }}
          onChange={(newValue) => {
            setIsEditing(false);
            if (newValue !== value) {
              onSave(newValue);
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

export default EditableCellSearchDropdown;
