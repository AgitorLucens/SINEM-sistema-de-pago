import './paymentfilter.css';
const PaymentsFilters = ({ filterState, handleFilterChange, concepts, divisions, clearFilters }) => {
    
    return (
        <div className="filter-card">
        <h2 className="filter-title">Clasificación y Filtrado</h2>

        <div className="filter-grid">
          
          {/* Campo Concepto */}
          <div className="filter-group">
            <label htmlFor="concept" className="filter-label">Concepto</label>
            <select
              id="concept"
              name="concept"
              value={filterState.concept}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Todos</option>
              {concepts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {/* Campo Curso/División */}
          <div className="filter-group">
            <label htmlFor="division" className="filter-label">Curso/División</label>
            <select
              id="division"
              name="division"
              value={filterState.division}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Todos</option>
              {divisions.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {/* Campo Método de Pago */}
          <div className="filter-group">
            <label htmlFor="method" className="filter-label">Método de Pago</label>
            <select
              id="method"
              name="method"
              value={filterState.mode}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Todos</option>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
          
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