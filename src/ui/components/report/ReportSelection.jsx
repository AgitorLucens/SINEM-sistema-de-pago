import ReportCard from "./ReportCard.jsx";
import { Users, FileText, TrendingUp, TrendingDown, PieDiagramIcon } from "../icons/Icons.jsx";

import './reportsection.css';

const ReportSelection = ({ onSelectReport }) => {
  return (
    <div className="container-report-selection">
      <div className="content-wrapper-report-selection">
        <div className="report-selection-header">
          <h1>Reportes</h1>
          <p>Selecciona el tipo de reporte que deseas visualizar.</p>
        </div>

        <div className="grid-report-card">
          <ReportCard
            title="Ingresos"
            description="Reporte matricial de ingresos recaudados por curso y método de pago."
            colorClass="color-ingresos"
            icon={TrendingUp}
            onClick={() => onSelectReport("Ingresos")}
          />

          <ReportCard
            title="Ingresos y Egresos"
            description="Reporte de ingresos y egresos registrados en el sistema."
            colorClass="color-egresos"
            icon={PieDiagramIcon}
            onClick={() => onSelectReport("IngresosEgresos")}
          />

          <ReportCard
            title="Morosidad por Profesor"
            description="Reporte de porcentaje de morosidad segun Profesor"
            colorClass="color-estudiantes"
            icon={Users}
            onClick={() => onSelectReport("Morosidad por Profesor")}
          />

          <ReportCard
            title="Morosidad por Mes"
            description="Reporte general que incluye todos los módulos del sistema."
            colorClass="color-general"
            icon={FileText}
            onClick={() => onSelectReport("Morosidad por Mes")}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportSelection;
