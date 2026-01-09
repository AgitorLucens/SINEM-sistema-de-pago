import { PersonIcon } from "@radix-ui/react-icons";
import { formatMonth } from "../generic/function/Function.jsx";

import './studentdetail.css';
const StudentDetail = ({
  student,
  payments,
  years,
  filterYear,
  setFilterYear,
  onClose
}) => {
  if (!student || !payments) return null;

  return (
    <>
      <div className="studentdet-modal-header">
          <div style={{ backgroundColor: '#f8fafc',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'}}>
            <PersonIcon size={16} color="#4f46e5" />
            <h2>{student.name}</h2>
          </div>
        

        <div className="student-year-picker">
          {years.map(y => (
            <button
              key={y.year}
              onClick={() => setFilterYear(Number(y.year))}
              className={`student-year-btn${filterYear === Number(y.year) ? " active" : " inactive"}`}
            >
              {y.year}
            </button>
          ))}
        </div>
      </div>
        <div className="student-payments-grid">
              {payments
                .filter(p => p.year === filterYear)
                .map(p => (
                  <div key={p.id} className="student-payment-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ backgroundColor: '#f8fafc', padding: '8px', borderRadius: '10px' }}>
                        {p.concept_type === 'Matrícula' ? <PersonIcon size={16} color="#4f46e5" /> : <PersonIcon size={16} color="#64748b" />}
                      </div>
                      <span className={`student-badge student-badge-${p.status || "default"}`}>{p.status}</span>
                    </div>
                    
                    <div style={{ marginTop: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{p.concept_type}</h4>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{formatMonth(p.month)}</p>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                       <div>
                         <p style={{ margin: 0, fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Monto</p>
                         <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>₡{p.amount}</p>
                       </div>
                    </div>
                  </div>
              ))}
        </div>
    </>
  );
};

export default StudentDetail;

