import { useState } from "react";
import DatePicker from "../datepicker/DatePicker";

const EditableCellDate = ({ value, onSave }) => {
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
          style={{ cursor: "pointer" }}
        >
          {value
            ? new Date(value).toLocaleDateString("es-CR")
            : "—"}
        </div>
      )}
    </>
  );
};

export default EditableCellDate;
