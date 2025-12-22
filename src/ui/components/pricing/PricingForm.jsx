import { useState } from "react";
import { ColonIcon } from "../icons/Icons";

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
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Nuevo Monto (S/.)
        </label>
        <div style={{ position: 'relative' }}>
          <ColonIcon size={16} transform='translateY(-50%)'/>
          <input 
            type="number" 
            value={value} 
            onChange={(e) => setValue(Number(e.target.value))}
            className="input-pricing"
          />
        </div>

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
            onClick={() => onSave(price.id, value)}
            style={{
              background: "#4f46e5",
              color: "white",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;