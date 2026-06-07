import ExportCard from "../../components/exports/ExportCard.jsx";
import Modal from "../../components/generic/modal/Modal.jsx";
import ExportForm from "../../components/exports/ExportForm.jsx";
import ErrorMessage from "../../components/generic/message/ErrorMessage.jsx";
import { Users, FileText, TrendingUp, TrendingDown } from "../../components/icons/Icons.jsx";
import { useExportData, EXPORT_FILTERS } from "../../hooks/useExportData.js";

import './export.css';

const Export = () => {
const {
  yearsPayments, yearsExpenses, studentActive,
  filters, setFilters,
  error,
  isModalOpen,
  selectedType,
  exportOptions,
  openExportModal, closeExportModal, handleExport,
} = useExportData();

const formState = {
  payments: yearsPayments.length > 0,
  expenses: yearsExpenses.length > 0,
  students: studentActive.length > 0 && yearsPayments.length > 0,
};

    return (
        <div className="container-export">
            <div className="content-wrapper-export">
                <div className="section-title">
                    <h2>Exportación de Datos</h2>
                </div>
                <div className="export-header">
                    <p>Selecciona el módulo administrativo para generar el reporte en Excel.</p>
                </div>
                <div className="grid-export-card">
                    <ExportCard
                        title="Ingresos"
                        description="Pagos, matrículas y mensualidades recibidas."
                        colorClass={"color-ingresos"}
                        icon={TrendingUp}
                        disabled={yearsPayments.length > 0 ? false : true}
                        disabledMessage={"Agrega Ingreso para exportar"}
                        onClick={() => openExportModal("Pagos")}
                    />
                    <ExportCard
                        title="Egresos"
                        description="Gastos incluidos en el sistema."
                        colorClass={"color-egresos"}
                        icon={TrendingDown}
                        disabled={yearsExpenses.length > 0 ? false : true}
                        disabledMessage={"Agrega Egreso para exportar"}
                        onClick={() => openExportModal("Gastos")}
                    />
                    <ExportCard
                        title="Estudiantes"
                        description="Listado de alumnos matriculados por año"
                        colorClass={"color-estudiantes"}
                        disabled={(studentActive.length > 0 && yearsPayments.length > 0) ? false : true}
                        disabledMessage={"Agrega gasto para exportar"}
                        icon={Users}
                        onClick={() => openExportModal("Estudiantes")}
                    />
                    <ExportCard
                        title="Historico"
                        description="Archivo que incluye todos los módulos."
                        colorClass={"color-completo"}
                        disabled={((studentActive.length > 0 && yearsPayments.length > 0) || yearsExpenses.length > 0) ? false : true}
                        disabledMessage={"Agrega Ingreso, Egreso o Estudiante para exportar"}
                        icon={FileText}
                        onClick={() => openExportModal("Todo")}
                    />
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeExportModal}
                    title="Informacion a exportar"
                >
                    {error && (
                        <ErrorMessage message={error} />
                    )}
    <ExportForm
      type={selectedType}
      options={exportOptions}
      filterConfig={EXPORT_FILTERS[selectedType]}
      filters={filters}
      setFilters={setFilters}
      handleChange={handleExport}
      formState={formState}
      onClose={closeExportModal}
    />
                </Modal>
            </div>
        </div>
    );
};

export default Export;