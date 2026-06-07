import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix.jsx";
import Chip from "../generic/chip/Chip.jsx";

import './reportfilters.css';

const ReportFilters = ({ toggleItem, toggleItemById, selectedDate, allMethods, allCourses,
    selectedCourses, selectedMethods, setSelectedCourses, setSelectedMethods, setSelectedDate,
    uniqueDates }) => {
    return (
        <div>
            <section className="filters-grid">
                {(uniqueDates.length > 0) && (
                    <div className="filter-card">
                        <span className="filter-label">Filtrar por Fecha</span>
                        <MultiSelectRadix
                            options={uniqueDates?.map(d => ({ label: d.date_only, value: d.date_only }))}
                            value={selectedDate}
                            onChange={setSelectedDate}
                            valueKey="label"
                            labelKey="value"
                            placeholder="Escoger Fechas"
                        />
                    </div>
                )}
                <div className="filter-card">
                    <span className="filter-label">Columnas: Cursos</span>
                    <div className="chip-group">
                        {allCourses.map(c => (
                            <Chip
                                key={c.name}
                                selected={selectedCourses.some(sc => sc.id === c.id)}
                                activeClass="active-curso"
                                onClick={() => toggleItemById(c, selectedCourses, setSelectedCourses)}
                            >
                                {c.name}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div className="filter-card">
                    <span className="filter-label">Filas: M&eacute;todos de Pago</span>
                    <div className="chip-group">
                        {allMethods.map(m => (
                            <Chip
                                key={m.value}
                                selected={selectedMethods.some(sm => sm.value === m.value)}
                                activeClass="active-modo"
                                onClick={() => toggleItem(m, selectedMethods, setSelectedMethods)}
                            >
                                {m.label}
                            </Chip>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ReportFilters;
