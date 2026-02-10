import { useState, useEffect } from "react";
import { ArrowLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { getAllDivisionPaymentConcepts, updateDivisionPaymentConcept, addDivision, deleteDivision, updateDivision } from "../../constant/DBFunctions";
import Modal from "../../components/generic/modal/Modal";
import SuccessMessage from '../../components/generic/message/SuccessMessage.jsx';
import ErrorMessage from '../../components/generic/message/ErrorMessage.jsx';
import PricingForm from "./PricingForm";
import EditableCellInput from "../generic/table/EditableCellInput.jsx";

import "./pricingtable.css";
const PricingTable = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add Course State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");

  // Delete State
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAllDivisionPaymentConcepts();
    if (Array.isArray(result)) {
      setData(result);
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingItem({
      id: item.id,
      name: `${item.division_name} - ${item.concept_name}`,
      amount: item.amount
    });
    setIsModalOpen(true);
  };

  const handleSave = async (id, newAmount) => {
    await updateDivisionPaymentConcept({ id, amount: newAmount });
    setIsModalOpen(false);
    fetchData();
  };

  const handleAddCourse = async () => {
    if (!newCourseName.trim()) return;
    await addDivision({ name: newCourseName });
    setIsAddModalOpen(false);
    setNewCourseName("");
    fetchData();
  };

  const handleDelete = async (e, divisionId) => {
    e.stopPropagation();
    if (confirmingId === divisionId) {
      await deleteDivision(divisionId);
      setConfirmingId(null);
      fetchData();
    } else {
      setConfirmingId(divisionId);
      setTimeout(() => setConfirmingId(null), 3000); // Reset after 3 seconds
    }
  };

  const handleTableUpdate = async (id, name) => {
    const res = await updateDivision({ id, name: name });
    if (!res.success) {
      setError(res.error);
      setTimeout(() => { setError("");}, 4000);
      return
    }
    setMessage("Curso actualizado exitosamente");
    setTimeout(() => { setMessage("");}, 4000);
    fetchData();
  }


  const divisions = [...new Set(data.map(d => d.division_name))];
  const concepts = [...new Set(data.map(d => d.concept_name))];

  return (
    <div className="pricing-table-container">
      <div className="pricing-table-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="back-button" onClick={onBack}>
            <ArrowLeftIcon /> Volver
          </button>
          <h2 className="section-title">Precios por Curso y Tipo de Pago</h2>
        </div>
        <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon /> Agregar Curso
        </button>
      </div>
      {message && (
        <SuccessMessage
          message={message}
        />
      )}
      {error && (
        <ErrorMessage
          message={error}
        />
      )}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Cargando precios...</div>
      ) : (
        <div className="pricing-table-wrapper">
          <div className="pricing-scroll-area">
            <table className="pricing-table">
              <thead className="pricing-thead">
                <tr>
                  <th className="pricing-th" style={{ zIndex: 20 }}>Curso / Concepto</th>
                  {concepts.map(concept => (
                    <th key={concept} className="pricing-th">{concept}</th>
                  ))}
                  <th className="pricing-th" style={{ width: '50px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map(division => {
                  // Find first item for this division to get the ID (assuming all items for a division have same division_id)
                  const firstItem = data.find(d => d.division_name === division);
                  const divisionId = firstItem ? firstItem.division_id : null;

                  return (
                    <tr key={division} className="pricing-tr">
                      <td className="pricing-td division-cell">
                        {divisionId ? (
                             <EditableCellInput
                                value={division}
                                type="text"
                                onSave={(val) => handleTableUpdate(divisionId, val)}
                            />
                        ) : (
                            division
                        )}
                    </td>
                      {concepts.map(concept => {
                        const item = data.find(d => d.division_name === division && d.concept_name === concept);
                        return (
                          <td
                            key={`${division}-${concept}`}
                            className="pricing-td amount-cell"
                            onClick={() => item && handleEdit(item)}
                          >
                            {item ? (
                              <div className="price-value">
                                {new Intl.NumberFormat("es-CR", {
                                  style: "currency",
                                  currency: "CRC",
                                }).format(item.amount)}
                              </div>
                            ) : "-"}
                          </td>
                        );
                      })}
                      <td className="pricing-td" style={{ textAlign: 'center' }}>
                        {divisionId && (
                          <button
                            onClick={(e) => handleDelete(e, divisionId)}
                            className={`delete-btn ${confirmingId === divisionId ? 'confirming' : ''}`}
                            title="Eliminar Curso"
                          >
                            {confirmingId === divisionId ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Actualizar Precio"
      >
        <PricingForm
          price={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar Nuevo Curso"
      >
        <div className="add-course-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#374151' }}>Nombre del Curso</label>
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Ej. Piano Incial"
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={() => setIsAddModalOpen(false)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddCourse}
              disabled={!newCourseName.trim()}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                cursor: 'pointer',
                opacity: !newCourseName.trim() ? 0.5 : 1
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PricingTable;
