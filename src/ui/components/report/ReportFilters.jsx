import './reportfilters.css';
const ReportFilters = ({toggleItem,toggleItemById, selectedDate, allMethods, allCourses, 
                        selectedCourses, selectedMethods, setSelectedCourses, setSelectedMethods, setSelectedDate,
                        uniqueDates}) => {
    return (
        <div>
            <section className="filters-grid">
        {/* Filtro Fecha */}
        <div className="filter-card">
          <span className="filter-label">Filtrar por Fecha</span>
          <select 
            className="select-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="all">Todas las fechas (Histórico)</option>
            {uniqueDates?.map(d => <option key={d.date_only} value={d.date_only}>{d.date_only}</option>)}
          </select>
        </div>

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