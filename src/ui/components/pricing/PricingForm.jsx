import { useState } from "react";
import { ColonIcon } from "../icons/Icons";
import { formatCRC } from "../generic/function/Function.jsx";

import './pricingform.css';
const PricingForm = ({ price, onClose, onSave,
                       inputStyles = {
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          marginTop: "0.5rem",
                       }              
                    }) => {
  const [value, setValue] = useState(price?.amount ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const displayValue = isEditing
  ? value
  : value === "" ? "" : formatCRC(value);


  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");

    // permitir borrar completamente
    if (raw === "") {
      setValue("");
      return;
    }

    // solo un punto decimal
    if ((raw.match(/\./g) || []).length > 1) return;

    setValue(raw);
  };

  return (
    <div
      style={{
        inset: 0,
        display: "flex",

      }}
    >
      <div
        className="input-group"
      >
        <div className="modal-header">
            <h2>Registrar Precio</h2>
            <span>{price.name}</span>
        </div>
        {/*
        <div style={{ position: 'relative' }}>
          <ColonIcon size={16} transform='translateY(-50%)'/>
          <input 
            type="number" 
            value={value} 
            onChange={(e) => setValue(Number(e.target.value))}
            className="input-pricing"
          />
        </div>
        */}
        <div className="pricing-input-group">
              <label>Monto a cobrar</label>
              <input
                type="text"
                inputMode="decimal"
                className="pricing-input-field"
                placeholder="₡0,00"
                value={displayValue}
                onChange={handleAmountChange}
                onFocus={() => setIsEditing(true)}
                onBlur={() => {
                  setIsEditing(false);
                  if (value !== "") {
                    setValue(Number(value)); // normalizar
                  }
                }}
              />
            </div>
      
        <div
          className="pricing-modal-action"
        >
          <button 
              onClick={onClose}
              className="btn-pricing pricing-btn-cancel"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(price.id, value)}
            className="btn-pricing pricing-btn-save"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;