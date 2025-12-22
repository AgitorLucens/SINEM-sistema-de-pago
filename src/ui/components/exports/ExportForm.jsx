import { useState } from "react";
import SelectRadix from "../generic/select/SelectRadix";
import {onRadixChange,handleFieldChange} from "../generic/function/Function.jsx"
import { CalendarIcon, DownloadIcon } from "@radix-ui/react-icons";

import './exportform.css';
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
      <div className="form-group">
        <div className="label-export-form">
          <CalendarIcon size={16} color="#9ca3af" />
            Rango de Tiempo
        </div>
        <div className="input-grid">

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
        </div>

        <div className="alert-box">
          <p>
            <strong>Nota:</strong> Los datos se procesarán en formato <strong>.xlsx</strong>. Asegúrese de que los filtros sean correctos antes de descargar.
          </p>
        </div>

          <button className="btn-primary-export" onClick={()=>handleChange(value)}>
            <DownloadIcon size={18} />
            Descargar Excel
          </button>
          <button className="btn-ghost-export" onClick={onClose}>
            Cancelar
          </button>
      </div>
  );
};

export default ExportForm;