import { useState, memo } from "react";
import DatePicker from "../datepicker/DatePicker";

const EditableCellDate = memo(({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setIsEditing(true);
  };

  return (
    <>
      {isEditing ? (
        <DatePicker
          value={value ? new Date(value) : null}
          onChange={(date) => {
            const iso = date.toISOString();
            if (iso !== value) onSave(iso);
            setIsEditing(false);
          }}
          onOpenChange={(open) => {
            if (!open) setIsEditing(false);
          }}
        />
      ) : (
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
          aria-label={value ? `Editar fecha: ${new Date(value).toLocaleDateString("es-CR")}` : "Editar celda vacía"}
          style={{ cursor: "pointer" }}
        >
          {value
            ? new Date(value).toLocaleDateString("es-CR")
            : "—"}
        </div>
      )}
    </>
  );
});

export default EditableCellDate;
