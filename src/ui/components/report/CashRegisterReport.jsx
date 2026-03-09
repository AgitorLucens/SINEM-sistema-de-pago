import { useEffect, useState, useMemo } from "react";
import { getCashRegister, exportCashRegisterReportToExcel } from "../../constant/DBFunctions";
import { ChevronLeftIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import EditableCellInput from "../generic/table/EditableCellInput.jsx";
import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix.jsx";
import { formatCRC, formatDate } from "../generic/function/Function.jsx";

import './cashregisterreport.css';
const CashRegisterReport = ({ onBack }) => {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const data = await getCashRegister();
            setTransactions(data);
        }
        getData();
    }, []);
    // se tiene que establecer saldo anteriro
    const [initialBalance, setInitialBalance] = useState(0);
    const [selectedYears, setSelectedYears] = useState([]);

    const uniqueYears = useMemo(() => {
        if (!transactions?.length) return [];
        const years = new Set(transactions.map(t => new Date(t.date).getFullYear()));
        return Array.from(years).sort((a, b) => b - a); // Sort descending
    }, [transactions]);

    // Auto-select all years initially when data loads
    useEffect(() => {
        if (uniqueYears.length > 0 && selectedYears.length === 0) {
            setSelectedYears(uniqueYears);
        }
    }, [uniqueYears]);

    const filteredTransactions = useMemo(() => {
        if (!selectedYears.length) return [];
        return transactions.filter(t => selectedYears.includes(new Date(t.date).getFullYear()));
    }, [transactions, selectedYears]);

    const rows = useMemo(() => {
        if (!filteredTransactions?.length) return [];

        let saldo = initialBalance;

        return filteredTransactions.map(r => {
            let matricula = "—";
            let mensualidad = "—";
            let pagoProf = "—";
            let pagoAdmn = "—";
            let otros = "—";

            if (r.rubro === "Ingreso") {
                if (r.concept === "Matricula") matricula = r.amount;
                else if (r.concept === "Mensualidad") mensualidad = r.amount;
                else otros = r.amount;

                saldo += r.amount;
                // egresos
            } else {
                if (r.status === "PagoProfesor") pagoProf = r.amount;
                else if (r.status === "PagoAdministrativo") pagoAdmn = r.amount;
                else otros = r.amount;

                saldo -= r.amount;
            }

            return {
                fecha: r.date,
                tipo: r.tipo,
                doc: r.year
                    ? `${r.year}-${String(r.sequence).padStart(5, "0")}`
                    : r.sequence,
                subject: r.subject,
                detalle: r.detail,
                rubro: r.rubro,
                matricula,
                mensualidad,
                pagoProf,
                pagoAdmn,
                otros,
                saldo
            };
        });
    }, [filteredTransactions, initialBalance]);


    return (
        <div className="container-income-report">
            <div className="header-income-report">
                <div className="header-income-report-title">
                    <button
                        onClick={onBack}
                        className="btn-back-report"
                        title="Volver a selección de reportes"
                    >
                        <ChevronLeftIcon />
                        Volver
                    </button>
                    <h1>Reporte de Ingresos y Egresos</h1>
                </div>

                <div className="download-button">
                    <button
                        onClick={async () => {
                            await exportCashRegisterReportToExcel({
                                transactions: filteredTransactions,
                                initialBalance: initialBalance
                            });
                        }}
                        className='btn-primary-export'
                    >
                        <ArrowDownIcon /> Exportar Reporte
                    </button>
                </div>
            </div>
            <div className="filter-cashregister">
                <div className="filter-card">
                    <MultiSelectRadix
                        options={uniqueYears.map(y => ({ value: y, label: String(y) }))}
                        value={selectedYears}
                        onChange={setSelectedYears}
                        placeholder="Años"
                    />
                </div>
            </div>
            <div className="tx-log-table-responsive">
                <table className="tx-log-main-table">
                    <thead className="tx-log-thead">
                        <tr>
                            <th className="tx-log-th">Fecha</th>
                            <th className="tx-log-th">Tipo Mov.</th>
                            <th className="tx-log-th">N° Doc</th>
                            <th className="tx-log-th">Proveedor / Cliente</th>
                            <th className="tx-log-th tx-log-th-center">Detalle</th>
                            <th className="tx-log-th tx-log-th-center">Rubro</th>
                            <th className="tx-log-th tx-log-th-right">Matrículas</th>
                            <th className="tx-log-th tx-log-th-right">Mensualidades</th>
                            <th className="tx-log-th tx-log-th-right">Pago Prof.</th>
                            <th className="tx-log-th tx-log-th-right">Pago Admn.</th>
                            <th className="tx-log-th tx-log-th-right">Otros</th>
                            <th className="tx-log-th tx-log-th-right saldo">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key="head" className="tx-log-row-initial">
                            <td className="tx-log-td" colSpan="4"></td>
                            <td className="tx-log-td">SALDO ANTERIOR</td>
                            <td className="tx-log-td" colSpan="6"></td>
                            <td className="tx-log-td tx-log-col-balance">
                                <EditableCellInput
                                    value={initialBalance}
                                    onSave={(val) => setInitialBalance(Number(val))}
                                    type="number"
                                    formatDisplay={formatCRC}
                                />
                            </td>
                        </tr>

                        {rows.map(row => (
                            <tr key={row.id} className="tx-log-tr">
                                <td>{formatDate(row.fecha)}</td>
                                <td className="tx-log-td">
                                    {row.tipo}
                                </td>
                                <td>
                                    {row.rubro === "Ingreso" ?
                                        <span className="badge-id">
                                            {row.doc}
                                        </span>
                                        : ""}
                                </td>
                                <td className="tx-log-td tx-log-col-subject">{row.subject}</td>
                                <td className="tx-log-td">{row.detalle}</td>
                                <td className="tx-log-td tx-log-th-center">
                                    <span className={row.rubro === "Ingreso" ? "tx-log-badge-income" : "tx-log-badge-expense"}>
                                        {row.rubro}
                                    </span>
                                </td>
                                <td>{row.matricula !== "—" ? formatCRC(row.matricula) : ""}</td>
                                <td>{row.mensualidad !== "—" ? formatCRC(row.mensualidad) : ""}</td>
                                <td className="tx-log-td tx-log-th-right">{row.pagoProf !== "—" ? formatCRC(row.pagoProf) : ""}</td>
                                <td className="tx-log-td tx-log-th-right">{row.pagoAdmn !== "—" ? formatCRC(row.pagoAdmn) : ""}</td>
                                <td>{row.otros !== "—" ? formatCRC(row.otros) : ""}</td>
                                <td className="tx-log-td tx-log-col-balance"><span className="tx-log-currency-symbol"></span>{formatCRC(row.saldo)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default CashRegisterReport;
