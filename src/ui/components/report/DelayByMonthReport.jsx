import { useState, useEffect } from "react";
import { ChevronLeftIcon, ArrowDownIcon, DownloadIcon } from "@radix-ui/react-icons";
import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix";
import { formatCRC, formatMonth } from "../generic/function/Function";
import {
  getYearsOfPayments, getDelayPayments, getExpectedIncome,
  exportDelayByMonthReportToExcel
} from '../../constant/DBFunctions.jsx';


import './delaybymonthreport.css';
const DelayByMonthReport = ({ onBack }) => {
  //report delays
  const [yearsPayments, setYearsPayments] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [stats, setStats] = useState({ activeStudents: 0 });

  const getPorcentage = (amount) => {
    if (amount < 50 && amount > 0) {
      return 'badge-warning'
    } else if (amount >= 50) {
      return 'badge-danger';
    } else {
      return 'badge-optimal';
    }
  }

  useEffect(() => {
    const getyears = async () => {
      const years = await getYearsOfPayments();
      setYearsPayments(years);
      setSelectedYear(years?.map(y => y.year));
    }
    getyears();
  }, [])

  function buildRow(label, total, paid) {
    const paidValue = paid || 0;

    const pPaid = total
      ? ((paidValue / total) * 100).toFixed(1) + "%"
      : "0%";

    const pDelin = total
      ? (100 - (paidValue / total) * 100).toFixed(1) + "%"
      : "100%";

    return {
      concept: label,
      total,
      paid: paidValue === 0 ? "-" : paidValue,
      pPaid,
      pDelin
    };
  }

  //Carga inicial
  useEffect(() => {
    const getDelays = async () => {
      const delay = await getDelayPayments(selectedYear);
      const expected = await getExpectedIncome(selectedYear);

      const EXPECTED_MONTH_TOTAL_1 = expected.monthly1 || 0;
      const EXPECTED_MONTH_TOTAL_2 = expected.monthly2 || 0;
      const MATRICULA_TOTAL_1 = expected.matricula1 || 0;
      const MATRICULA_TOTAL_2 = expected.matricula2 || 0;

      setStats({ activeStudents: expected.activeStudents || 0 });

      const rows = [];

      // Matrícula 1
      rows.push(buildRow("Matrícula 1", MATRICULA_TOTAL_1, delay.matricula1));

      // Meses 1–6
      for (let m = 1; m <= 6; m++) {
        rows.push(buildRow(formatMonth(m), EXPECTED_MONTH_TOTAL_1, delay.months[m] || 0));
      }

      // Matrícula 2
      rows.push(buildRow("Matrícula 2", MATRICULA_TOTAL_2, delay.matricula2));

      // Meses 7–12
      for (let m = 7; m <= 12; m++) {
        rows.push(buildRow(formatMonth(m), EXPECTED_MONTH_TOTAL_2, delay.months[m] || 0));
      }
      setReportData(rows);

    }
    getDelays();
  }, [selectedYear])

  const handleExport = async () => {
    const result = await exportDelayByMonthReportToExcel({ reportData, stats });
    if (result.success) {
      // Success notification could go here
      console.log("Export successful:", result.path);
    } else {
      console.error("Export failed");
    }
  };

  return (
    <div className="report-card">
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
          <h1>Reporte Morosidad por Mes</h1>
        </div>
        <div className="download-button">
          <button
            onClick={handleExport} // Abre el modal
            className='btn-primary-export'
          >
            <ArrowDownIcon /> Exportar Reporte
          </button>
        </div>
      </div>
      <div className="report-header">
        <div className="header-item">
          <span className="header-label">Estudiantes</span>
          <span className="header-value">{stats.activeStudents}</span>
        </div>
        <div className="header-item">
          <span className="header-label">Periodo</span>
          <span className="header-value">
            <MultiSelectRadix
              options={yearsPayments?.map(y => ({ value: y.year, label: y.year }))}
              value={selectedYear}
              allSelectedText="Todos los años"
              onChange={(selectedYear) => {
                if (selectedYear?.length < 1) return
                setSelectedYear(selectedYear)
                console.log(selectedYear)
              }
              }
              placeholder="Escoger Años"
            />
          </span>
        </div>
        <div className="header-item text-right">
          <span className="header-label">Morosidad Global</span>
          <span className="header-value">85.8%</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th className="text-right">Monto Total</th>
              <th className="text-right">Pagado</th>
              <th className="text-right">% Pago</th>
              <th className="text-right">% Morosidad</th>
            </tr>
          </thead>
          <tbody>
            {reportData?.map((item, index) => (
              <tr key={index}>
                <td className="row-concept">{item.concept}</td>
                <td className="text-right font-mono">{formatCRC(item.total)}</td>
                <td className={`text-right font-mono ${item.paid === '-' ? 'text-empty' : 'text-paid'}`}>
                  {item.paid !== "-" ? formatCRC(item.paid) : formatCRC(0)}
                </td>
                <td className="text-right">{item.pPaid}</td>
                <td className="text-right">
                  <span className={`badge ${getPorcentage(parseFloat(item.pDelin))}`}>
                    {item.pDelin}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
};

export default DelayByMonthReport;
