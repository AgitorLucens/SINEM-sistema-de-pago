import { useState } from "react";
import SearchSelectRadix from "../searchselect/SearchSelectRadix.jsx";

const EditableCellSearchDropdown = ({
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
      style={{ cursor: "pointer" }}
      title="Doble click para editar"
    >
      {value || "—"}
    </div>
  );
};

export default EditableCellSearchDropdown;
