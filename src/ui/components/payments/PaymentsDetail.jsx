import {formatDate,formatMonth} from "../generic/function/Function.jsx"
import {exportPaymentsToExcel} from "../../constant/DBFunctions.jsx";
import { CalendarIcon, DownloadIcon } from "@radix-ui/react-icons";

import './paymentdetail.css';
const PaymentsDetail = ({ detail, onClick, isLoading}) => {
    
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
                  <CalendarIcon size={16} color="#9ca3af" />  {formatDate(detail.date)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9 }}>
                  {/*<CreditCard size={14}/>*/}  {detail.payment_method}
                </div>
              </div>
            </div>

            {/* Cuerpo detalles*/}
            <div className="detail-body">
              <div className="detail-infogrid">
                <div className="detail-infoblock">
                  <span className="detail-label">Estudiante</span>
                  <div className="detail-value">{/*<User size={16} color="#4f46e5" />*/} {detail.student_name}</div>
                </div>
                <div className="detail-infoblock">
                  <span className="detail-label">División</span>
                  <div className="detail-value">{/*<School size={16} color="#4f46e5" /> */}{detail.division_name}</div>
                </div>
              </div>
              <div className="detail-infogrid">
                <div className="detail-infoblock">
                  <span className="detail-label">Concepto</span>
                  <div className="detail-value">{detail.concept_type}</div>
                </div>
                <div className="detail-infoblock">
                  <span className="detail-label">Periodo Correspondiente</span>
                  <div className="detail-value">{formatMonth(detail.month)} {detail.year}</div>
                </div>
              </div>
              <div className="detail-amountcard">
                <div>
                  <span className="detail-label">Total Pagado</span>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#059669' }}>
                    ${detail.amount.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Ref: {detail.id}</div>
                </div>
              </div>
            </div>

                <button
                    onClick={() => exportPaymentsToExcel(detail)}
                    className="btn-primary-invoice"
                >
                     <DownloadIcon size={18} />
                    Generar Recibo Excel
                </button>
           
        </div>
    );
};

export default PaymentsDetail;