import  MultiSelectRadix  from "../generic/multiselect/MultiSelectRadix.jsx"

import './reportfilters.css';
const ReportFilters = ({toggleItem,toggleItemById, selectedDate, allMethods, allCourses, 
                        selectedCourses, selectedMethods, setSelectedCourses, setSelectedMethods, setSelectedDate,
                        uniqueDates}) => {
    return (
        <div>
          <section className="filters-grid">
            {/* Filtro Fecha */}
            {(uniqueDates.length > 0) && (
              <div className="filter-card">
              <span className="filter-label">Filtrar por Fecha</span>   
              <MultiSelectRadix
                options={uniqueDates?.map(d => ({label: d.date_only, value: d.date_only}))}
                value={selectedDate}
                onChange={setSelectedDate}
                valueKey="label"
                labelKey="value"
                placeholder="Escoger Fechas"
              />   
            </div>
            )}
            {/* Filtro Cursos (Columnas) */}
            <div className="filter-card">
              <span className="filter-label">Columnas: Cursos</span>
              <div className="chip-group">
                {allCourses.map(c => (
                <div 
                  key={c.name} 
                  className={`chip ${ selectedCourses.some(sc => sc.id === c.id) ? 'active-curso' : ''}`}
                  onClick={() => toggleItemById(c, selectedCourses, setSelectedCourses)}
                >
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Filtro Modos (Filas) */}
          <div className="filter-card">
          <span className="filter-label">Filas: Métodos de Pago</span>
            <div className="chip-group">
              {allMethods.map(m => (
                <div 
                  key={m.value}
                  className={`chip ${
                  selectedMethods.some(sm => sm.value === m.value)
                    ? 'active-modo'
                    : ''
                  }`}
                  onClick={() => toggleItem(m, selectedMethods, setSelectedMethods)}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
}

export default ReportFilters;