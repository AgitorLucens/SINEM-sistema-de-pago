import Chip from '../generic/chip/Chip.jsx';
import './paymentfilter.css';

const PaymentsFilters = ({ filterState, setFilterState, handleFilterChange, concepts, divisions, methods, clearFilters }) => {
    return (
        <div className="filter-card">
        <h2 className="filter-title">Clasificaci&oacute;n y Filtrado</h2>

        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">Tipo de Pago</label>
            <div className="chip-group">
              {concepts.map(c => {
                const selected = filterState.concept.includes(c.name);
                return (
                  <Chip
                    key={c.id}
                    selected={selected}
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
                  </Chip>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Curso/Division</label>
            <div className="chip-group">
              {divisions.map(d => {
                const selected = filterState.division.includes(d.name);
                return (
                  <Chip
                    key={d.id}
                    selected={selected}
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
                  </Chip>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Metodo de Pago</label>
            <div className="chip-group">
              {methods.map(m => {
                const selected = filterState.method.includes(m.value);
                return (
                  <Chip
                    key={m.value}
                    selected={selected}
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
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="filter-grid">
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
