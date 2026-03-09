import EditableCellDropdown from "../generic/table/EditableCellDropdown.jsx";
import EditableCellInput from "../generic/table/EditableCellInput.jsx";
import EditableCellPhone from "../generic/table/EditableCellPhone.jsx";
import { updateStudent } from "../../constant/DBFunctions.jsx";

import { PersonIcon } from "@radix-ui/react-icons";
import { CreditCard, MensualidadIcon, MatriculaIcon, OtrosIcon } from "../icons/Icons.jsx";
import { formatDate, formatMonth } from "../generic/function/Function.jsx";

import './studentdetail.css';
const StudentDetail = ({
  student,
  payments,
  years,
  filterYear,
  setFilterYear,
  handleTableUpdate,
  onClick,
  onClose
}) => {
  if (!student || !payments) return null;

  const conceptIcons = {
    "Matricula": <MatriculaIcon size={18} />,
    "Mensualidad": <MensualidadIcon size={18} />,
    "Otros": <OtrosIcon size={18} />,
  };

  return (
    <>
      <div className="studentdet-modal-header">
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '8px 12px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <PersonIcon size={16} color="#4f46e5" />
          <h2>
            <EditableCellInput
              value={student.name}
              type="text"
              onSave={(val) => {
                handleTableUpdate({ id: student.id, fields: { name: val } },
                  updateStudent);
                onClick?.({
                  ...student,
                  name: val,
                });
              }}
            />
          </h2>
          <span className={`student-badge student-badge-${student.active === 1 ? "ACTIVE" : "INACTIVE" || "default"}`}>
            {/*student.active ? "Activo" : "Inactivo"*/}
            <EditableCellDropdown
              options={[
                { value: "1", label: "Activo" },
                { value: "0", label: "Inactivo" },
              ]}
              value={student.active === 1 ? "Activo" : "Inactivo"}
              valueKey='value'
              labelKey='label'
              onSave={(val) => {
                handleTableUpdate({ id: student.id, fields: { active: Number(val) } },
                  updateStudent);
                onClick?.({
                  ...student,
                  active: Number(val),
                });
              }}
            />
          </span>
        </div>
        {/* Detalles */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '8px 12px',
          borderRadius: '10px',
          display: 'grid',
          alignItems: 'center',
          gap: '8px',
          gridTemplateColumns: 'repeat(1, 1 )'
        }}>
          <div className="detail-infogrid2">
            {/* Detalle Email */}
            <div className="detail-infoblock">
              <span className="detail-label">
                Email
              </span>
              <div style={{ color: 'black' }}>
                <EditableCellInput
                  value={student.email}
                  type="text"
                  onSave={(val) => {
                    handleTableUpdate({ id: student.id, fields: { email: val } },
                      updateStudent);
                    onClick?.({
                      ...student,
                      email: val,
                    });
                  }}
                />
              </div>
            </div>
            {/* Detalle Teléfono */}
            <div className="detail-infoblock">
              <span className="detail-label">Teléfono</span>
              <div style={{ color: 'black' }}>
                <EditableCellPhone
                  value={student.phone}
                  onSave={(val) => {
                    handleTableUpdate({ id: student.id, fields: { phone: val } },
                      updateStudent);
                    onClick?.({
                      ...student,
                      phone: val,
                    });
                  }}

                />


              </div>
            </div>
            {/* Detalle Beca */}
            <div className="detail-infoblock">
              <span className="detail-label">Beca</span>
              <div style={{ color: 'black' }}>
                <EditableCellDropdown
                  options={[
                    { value: "1", label: "Beca" },
                    { value: "0", label: "Sin Beca" },
                  ]}
                  value={student.scholarship === 1 ? "Con Beca" : "Sin Beca"}
                  valueKey='value'
                  labelKey='label'
                  onSave={(val) => {
                    handleTableUpdate({ id: student.id, fields: { scholarship: Number(val) } },
                      updateStudent);
                    onClick?.({
                      ...student,
                      scholarship: Number(val),
                    });
                  }}
                />
              </div>
            </div>
            {/* Detalle Monto Beca */}
            {student.scholarship === 1 && (
              <div className="detail-infoblock">
                <span className="detail-label">Monto Beca</span>
                <div style={{ color: 'black' }}>
                  <EditableCellInput
                    value={student.scholarship_amount ?? ""}
                    type="number"
                    onSave={(val) => {
                      handleTableUpdate({ id: student.id, fields: { scholarship_amount: val } },
                        updateStudent);
                      onClick?.({
                        ...student,
                        scholarship_amount: val,
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="detail-infoblock">
            {/* Detalle Referencia */}
            <div className="detail-infoblock">
              <span className="detail-label">Referencia</span>
              <EditableCellInput
                value={student.reference}
                type="text"
                onSave={(val) => {
                  handleTableUpdate({ id: student.id, fields: { reference: val } },
                    updateStudent);
                  onClick?.({
                    ...student,
                    reference: val,
                  });
                }}
              />
            </div>
          </div>
        </div>

        {payments?.length > 0 && (
          <div className="student-year-picker">
            {years.map(y => (
              <div key={y.year}>
                {payments.find(p => (p.year === Number(y.year) && p.student_name === student.name)) && (
                  <button
                    key={y.year}
                    onClick={() => setFilterYear(Number(y.year))}
                    className={`student-year-btn${filterYear === Number(y.year) ? " active" : " inactive"}`}
                  >
                    {y.year}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
      <div className="student-payme nts-grid">
        {payments?.length > 0 ? payments
          .filter(p => p.year === filterYear)
          .map(p => (
            <div key={p.id} className="student-payment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '10px' }}>
                  {conceptIcons[p.concept_type] || <OtrosIcon />}
                </div>
                <span className={`student-badge-date`}>{formatDate(p.date)}</span>
              </div>

              <div style={{ marginTop: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{p.concept_type}</h4>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {p.month === null ?
                    p.semester === 1 ? "Primer Semestre" : "Segundo Semestre"
                    : formatMonth(p.month)}
                </p>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Monto</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#059669' }}>{new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                    minimumFractionDigits: 2,
                  }).format(p.amount)}
                  </p>
                </div>
              </div>
            </div>
          )) : <div className="empty-cont"> Sin Matricula Registradas</div>}

      </div>
    </>
  );
};

export default StudentDetail;

