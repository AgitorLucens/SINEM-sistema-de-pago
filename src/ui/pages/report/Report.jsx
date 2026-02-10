import { useState, useEffect } from 'react';
import ReportSelection from "../../components/report/ReportSelection.jsx";
import IncomeReport from "../../components/report/IncomeReport.jsx";
import CashRegisterReport from "../../components/report/CashRegisterReport.jsx";
import DelayByTeacherReport from "../../components/report/DelayByTeacherReport.jsx";
import DelayByMonthReport from "../../components/report/DelayByMonthReport.jsx";

import './report.css';
const Report = () => {
    //report to show
    const [selectedReport, setSelectedReport] = useState(null);

    const handleSelectReport = (reportType) => {
        setSelectedReport(reportType);
    };

    const handleBackToSelection = () => {
        setSelectedReport(null);
    };

    // Render selection screen if no report is selected
    if (!selectedReport) {
        return <ReportSelection onSelectReport={handleSelectReport} />;
    }

    // Render the selected report
    switch (selectedReport) {
        case "Ingresos":
            return <IncomeReport onBack={handleBackToSelection} />;
        case "IngresosEgresos":
            return <CashRegisterReport onBack={handleBackToSelection} />;
        case "Morosidad por Profesor":
            return <DelayByTeacherReport onBack={handleBackToSelection} />;
        case "Morosidad por Mes":
            return <DelayByMonthReport onBack={handleBackToSelection} />;
        default:
            return <ReportSelection onSelectReport={handleSelectReport} />;
    }
};

export default Report;