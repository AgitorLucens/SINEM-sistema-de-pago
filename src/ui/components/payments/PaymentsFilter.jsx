import './paymentfilter.css';
const PaymentsFilters = ({ filterState, setFilterState, handleFilterChange, concepts, divisions, methods, clearFilters }) => {
    
    return (
        <div className="filter-card">
        <h2 className="filter-title">Clasificación y Filtrado</h2>

        <div className="filter-grid">
          
          {/* Campo Concepto */}
          <div className="filter-group">
            <label className="filter-label">Concepto</label>

            <div className="chip-container">
              {concepts.map(c => {
                const selected = filterState.concept.includes(c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`chip ${selected ? "chip-active" : ""}`}
                    onClick={() => {
                      setFilterState(prev => ({
                        ...prev,
                        concept: selected
                          ? prev.concept.filter(v => v !== c.name)
                          : [...prev.concept, c.name]
                      }));
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo Curso/División */}
          <div className="filter-group">
            <label className="filter-label">Curso/Division</label>

            <div className="chip-container">
              {divisions.map(d => {
                const selected = filterState.division.includes(d.name);
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`chip ${selected ? "chip-active" : ""}`}
                    onClick={() => {
                      setFilterState(prev => ({
                        ...prev,
                        division: selected
                          ? prev.division.filter(v => v !== d.name)
                          : [...prev.division, d.name]
                      }));
                    }}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo Método de Pago */}
          <div className="filter-group">
            <label className="filter-label">Metodo de Pago</label>

            <div className="chip-container">
              {methods.map(m => {
                const selected = filterState.method.includes(m.value);
                return (
                  <button
                    key={m.value}
                    type="button"
                    className={`chip ${selected ? "chip-active" : ""}`}
                    onClick={() => {
                      setFilterState(prev => ({
                        ...prev,
                        method: selected
                          ? prev.method.filter(v => v !== m.value)
                          : [...prev.method, m.value]
                      }));
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
          
        </div>
        <div className="filter-grid">
          {/* Campo Fecha Inicial */}
          <div className="filter-group">
            <label htmlFor="startDate" className="filter-label">Fecha Inicial</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filterState.startDate}
              onChange={handleFilterChange}
              className="filter-input"
              placeholder="dd/mm/aaaa"
            />
          </div>

          {/* Campo Fecha Final */}
          <div className="filter-group">
            <label htmlFor="endDate" className="filter-label">Fecha Final</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filterState.endDate}
              onChange={handleFilterChange}
              className="filter-input"
              placeholder="dd/mm/aaaa"
            />
          </div>
        </div>
        {/* Botón de Limpiar Filtros */}
        <div className="filter-actions">
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

    );
}

export default PaymentsFilters;