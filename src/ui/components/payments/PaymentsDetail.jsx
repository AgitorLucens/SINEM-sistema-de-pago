import { formatDate, formatMonth } from "../generic/function/Function.jsx";
import { exportReceiptToExcel } from "../../constant/DBFunctions.jsx";
import { updatePayment } from "../../constant/DBFunctions.jsx";
import EditableCellInput from "../generic/table/EditableCellInput.jsx";
import EditableCellDropdown from "../generic/table/EditableCellDropdown.jsx";
import EditableCellDate from "../generic/table/EditableCellDate.jsx";
import EditableCellSearchDropdown from "../generic/table/EditableCellSearchDropdown.jsx";
import EditableCellPhone from "../generic/table/EditableCellPhone.jsx";
import { CalendarIcon, DownloadIcon } from "@radix-ui/react-icons";
import { CreditCard, CashIcon } from "../icons/Icons.jsx";

import './paymentdetail.css';
const PaymentsDetail = ({ detail, divisions, concepts, students, months, handleTableUpdate, onClick, isLoading }) => {

  return (
    <div style={{ padding: '0.5rem' }}>
      <div className="detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', display: 'inline-block' }}>
              RECIBO DE PAGO
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>#{detail.year && detail.sequence ? `${detail.year}-${String(detail.sequence).padStart(5, '0')}` : '---'}</h2>
          </div>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9 }}>
            <CalendarIcon size={16} color="#9ca3af" />
            <EditableCellDate
              value={detail.date}
              onSave={(val) => {
                handleTableUpdate(
                  { id: detail.id, fields: { date: val } },
                  updatePayment);
                onClick?.({
                  ...detail,
                  date: val,
                });
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9 }}>
            {detail.payment_method === "Efectivo" ? <CashIcon size={15} /> : <CreditCard />}
            <EditableCellDropdown
              options={[
                { value: "Transferencia", label: "Transferencia" },
                { value: "Efectivo", label: "Efectivo" },
              ]}
              value={detail.payment_method}
              onSave={(val) => {
                handleTableUpdate({ id: detail.id, fields: { payment_method: val } },
                  updatePayment);
                onClick?.({
                  ...detail,
                  payment_method: val,
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* Cuerpo detalles*/}
      <div className="detail-body">
        <div className="detail-infogrid">
          <div className="detail-infoblock">
            <span className="detail-label">Estudiante</span>
            <div className="detail-value">{/*<User size={16} color="#4f46e5" />*/}
              <EditableCellSearchDropdown
                value={detail.student_name}
                options={students.map(s => ({ value: s.id, label: s.name }))}
                valueKey="value"
                labelKey="label"
                onSave={(val) => {
                  handleTableUpdate(
                    { id: detail.id, fields: { student_id: val } },
                    updatePayment
                  );
                  onClick?.({
                    ...detail,
                    student_id: val,
                    student_name: students.find(s => s.id === Number(val))?.name || detail.student_name,
                  });
                }}
              />
            </div>
          </div>
          <div className="detail-infoblock">
            <span className="detail-label">División</span>
            <div className="detail-value">{/*<School size={16} color="#4f46e5" /> */}
              <EditableCellDropdown
                options={divisions}
                value={detail.division_name}
                valueKey='id'
                labelKey='name'
                onSave={(val) => {
                  handleTableUpdate({ id: detail.id, fields: { division_id: val } },
                    updatePayment);
                  onClick?.({
                    ...detail,
                    division_id: val,
                    division_name: divisions.find(d => d.id === Number(val))?.name || detail.division_name,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="detail-infogrid">
          <div className="detail-infoblock">
            <span className="detail-label">Concepto</span>
            <div className="detail-value">
              <EditableCellDropdown
                options={concepts}
                value={detail.concept_type}
                valueKey='id'
                labelKey='name'
                onSave={(val) => {
                  handleTableUpdate({ id: detail.id, fields: { concept_id: val } },
                    updatePayment);
                  onClick?.({
                    ...detail,
                    concept_id: val,
                    concept_type: concepts.find(c => c.id === Number(val))?.name || detail.concept_type,
                  });
                }}
              />
            </div>
          </div>
          <div className="detail-infoblock">
            <span className="detail-label">Periodo Correspondiente</span>
            <div className="detail-value">
              {detail.month !== null ?
                <EditableCellDropdown
                  value={formatMonth(detail.month)}
                  options={months}
                  valueKey="value"
                  labelKey="label"
                  onSave={(val) => {
                    handleTableUpdate({ id: detail.id, fields: { month: val } },
                      updatePayment);
                    onClick?.({
                      ...detail,
                      month: Number(val),
                    });
                  }}
                />
                :
                <EditableCellDropdown
                  value={detail.semester ? `Semestre ${detail.semester}` : "Semestre no definido"}
                  options={[
                    { value: 1, label: "Semestre 1" },
                    { value: 2, label: "Semestre 2" },
                  ]}
                  valueKey="value"
                  labelKey="label"
                  onSave={(val) => {
                    handleTableUpdate({ id: detail.id, fields: { semester: val } },
                      updatePayment);
                    onClick?.({
                      ...detail,
                      semester: Number(val),
                    });
                  }}
                />
              }
              {detail.year}</div>
          </div>
        </div>
        <div className="detail-amountcard">
          <div>
            <span className="detail-label">Total Pagado</span>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#059669' }}>
              <EditableCellInput
                value={detail.amount}
                type="number"
                formatDisplay={(val) =>
                  new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                    minimumFractionDigits: 2,
                  }).format(val)
                }
                onSave={(val) => {
                  handleTableUpdate(
                    { id: detail.id, fields: { amount: parseFloat(val) } },
                    updatePayment
                  );
                  onClick?.({
                    ...detail,
                    amount: parseFloat(val),
                  });
                }}
              />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{/*Ref: {detail.id}*/}</div>
          </div>
        </div>
        {/* # Comprobante */}
        {detail.receipt && (
          <div className="detail-infogrid">
            <div className="detail-infoblock">
              <span className="detail-label"># Comprobante</span>
              <div className="detail-value">
                {detail.receipt}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => exportReceiptToExcel(detail)}
        className="btn-primary-invoice"
      >
        <DownloadIcon size={18} />
        Generar Recibo Excel
      </button>

    </div>
  );
};

export default PaymentsDetail;