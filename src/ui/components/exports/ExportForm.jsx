import { useState } from "react";
import SelectRadix from "../generic/select/SelectRadix";
import {onRadixChange,handleFieldChange} from "../generic/function/Function.jsx"

const ExportForm = ({ selectData, data, type, onClose, onSave , handleChange}) => {
  const [value, setValue] = useState(null);
  const selectOptions = (() => {
  if (type === "Pagos" || type === "Gastos") {
    return (data ?? []).map(item => ({
      value: item.year,
      label: item.year,
    }));
  }

  if (type === "Estudiantes") {
    return (data ?? []).map(item => ({
      value: item.active,
      label: item.active === 1 ? "Activos" : "Inactivos",
    }));
  }

  return [];
  })();

  return (
    <div
      style={{
        inset: 0,
        display: "flex",

      }}
    >
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          width: "320px",
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          {type} a exportar
        </h2>

        <SelectRadix
          label=""
          name="select"
          placeholder="Seleccione una opcion"
          value={selectData}
          valueKey="value"
          labelKey="label"
          onChange={(val)=>setValue(val)}
          options={selectOptions}
        /> 
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={()=>handleChange(value)}
            style={{
              background: "#4f46e5",
              color: "white",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
            }}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportForm;