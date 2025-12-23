import {formatDate} from "../generic/function/Function.jsx"
import {exportPaymentsToExcel} from "../../constant/DBFunctions.jsx";
import { CalendarIcon, DownloadIcon } from "@radix-ui/react-icons";

import './paymentdetail.css';
const PaymentsDetail = ({ detail, onClick, isLoading}) => {
    
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ color: '#4b5563' }}>Detalles del pago</p>

                {/* Campo Nombre del Estudiante/Participante */}
                <div>
                    <label htmlFor="studentName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Nombre del Estudiante/Participante
                    </label>
                    {detail.student_name}
                </div>

                {/* Campo Monto y Fecha (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Monto (₡)
                        </label>
                        {detail.amount}
                    </div>
                    <div>
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Fecha del Pago
                        </label>
                        {formatDate(detail.date)}
                    </div>
                </div>

                {/* Campo Concepto y Método de Pago (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="concept" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Tipo de Pago
                        </label>
                        {detail.concept_type}
                    </div>
                
                    {/* Campo Método de Pago */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Método de Pago
                        </label>
                        {detail.payment_method}
                    </div>
                </div>

                <div>
                        <label htmlFor="division" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Curso
                        </label>
                        {detail.division_name}
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