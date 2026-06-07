import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix.jsx";
import Chip from "../generic/chip/Chip.jsx";
import {
  CalendarIcon, DownloadIcon, CheckCircledIcon, ClipboardIcon,
  ArrowBottomLeftIcon, PersonIcon,
} from "@radix-ui/react-icons";
import { EXPORT_FILTERS } from "../../hooks/useExportData.js";

import './exportform.css';

const toggleFilterValue = (setFilters, path, value) => {
  setFilters(prev => {
    const next = { ...prev };
    let target = next;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      target[key] = { ...target[key] };
      target = target[key];
    }
    const lastKey = path[path.length - 1];
    const arr = target[lastKey];
    if (!Array.isArray(arr)) return next;
    target[lastKey] = arr.includes(value)
      ? arr.filter(v => v !== value)
      : [...arr, value];
    return next;
  });
};

const setFilterField = (setFilters, path, value) => {
  setFilters(prev => {
    const next = { ...prev };
    let target = next;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      target[key] = { ...target[key] };
      target = target[key];
    }
    target[path[path.length - 1]] = value;
    return next;
  });
};

const getFilterByPath = (filters, path) => {
  return path.reduce((obj, key) => obj?.[key], filters);
};

const FilterChipGroup = ({ icon, label, options, selectedValues, onToggle }) => (
  <div>
    <div className="label-export-form">
      {icon}
      {label}
    </div>
    <div className="chip-group">
      {options.map(opt => (
        <Chip
          key={opt.value}
          selected={selectedValues.includes(opt.value)}
          onClick={() => onToggle(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  </div>
);

const YearSelect = ({ options, value, onChange }) => (
  <div>
    <div className="label-export-form">
      <CalendarIcon size={16} color="#9ca3af" />
      Rango de Tiempo
    </div>
    <MultiSelectRadix
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Escoger Años"
    />
  </div>
);

const TYPE_KEY_MAP = {
  Pagos: 'payments',
  Gastos: 'expenses',
  Estudiantes: 'students',
};

const FilterSection = ({ filterPath, options, filterConfig, filters, setFilters, title, titleIcon }) => {
  const currentFilter = getFilterByPath(filters, filterPath);

  const yearOptions = filterPath.includes('expenses')
    ? options.yearExpenses
    : options.yearPayments;

  const handleToggle = (field, value) => {
    toggleFilterValue(setFilters, [...filterPath, field], value);
  };

  const handleYearsChange = (years) => {
    setFilterField(setFilters, [...filterPath, 'years'], years);
  };

  const gridClass = title ? 'input-grid-todo' : 'input-grid';

  return (
    <div className={title ? 'todo-type-container' : undefined}>
      {title && (
        <div className="label-export-form">
          {titleIcon}
          <h3> {title} </h3>
        </div>
      )}
      <div className={gridClass}>
        <YearSelect
          options={yearOptions}
          value={currentFilter?.years ?? []}
          onChange={handleYearsChange}
        />
        {filterConfig.studentStatus && (
          <FilterChipGroup
            icon={<CheckCircledIcon size={16} color="#9ca3af" />}
            label="Estado Estudiante"
            options={options.studentStatus}
            selectedValues={currentFilter?.studentStatus ?? []}
            onToggle={(v) => handleToggle('studentStatus', v)}
          />
        )}
        {filterConfig.concepts && (
          <FilterChipGroup
            icon={<CheckCircledIcon size={16} color="#9ca3af" />}
            label="Concepto de Pago"
            options={options.concepts}
            selectedValues={currentFilter?.concepts ?? []}
            onToggle={(v) => handleToggle('concepts', v)}
          />
        )}
        {filterConfig.divisions && (
          <FilterChipGroup
            icon={<CheckCircledIcon size={16} color="#9ca3af" />}
            label="Curso de Pagos"
            options={options.divisions}
            selectedValues={currentFilter?.divisions ?? []}
            onToggle={(v) => handleToggle('divisions', v)}
          />
        )}
        {filterConfig.methods && (
          <FilterChipGroup
            icon={<CheckCircledIcon size={16} color="#9ca3af" />}
            label="Metodo de Pago"
            options={options.methods}
            selectedValues={currentFilter?.methods ?? []}
            onToggle={(v) => handleToggle('methods', v)}
          />
        )}
      </div>
    </div>
  );
};

const ExportForm = ({
  type,
  filterConfig,
  filters,
  setFilters,
  options = {},
  onClose,
  handleChange,
  formState = {},
}) => {
  const isTodo = type === 'Todo';

  const singlePath = TYPE_KEY_MAP[type]
    ? [TYPE_KEY_MAP[type]]
    : null;

  return (
    <div className="form-group">
      {isTodo ? (
        <>
          {formState.payments && (
            <FilterSection
              filterPath={['all', 'payments']}
              options={options}
              filterConfig={EXPORT_FILTERS.Pagos}
              filters={filters}
              setFilters={setFilters}
              title="Ingreso"
              titleIcon={<ClipboardIcon size={16} color="#9ca3af" />}
            />
          )}
          {formState.expenses && (
            <FilterSection
              filterPath={['all', 'expenses']}
              options={options}
              filterConfig={EXPORT_FILTERS.Gastos}
              filters={filters}
              setFilters={setFilters}
              title="Egreso"
              titleIcon={<ArrowBottomLeftIcon size={16} color="#9ca3af" />}
            />
          )}
          {formState.students && (
            <FilterSection
              filterPath={['all', 'students']}
              options={options}
              filterConfig={EXPORT_FILTERS.Estudiantes}
              filters={filters}
              setFilters={setFilters}
              title="Estudiantes"
              titleIcon={<PersonIcon size={16} color="#9ca3af" />}
            />
          )}
        </>
      ) : singlePath ? (
        <FilterSection
          filterPath={singlePath}
          options={options}
          filterConfig={filterConfig}
          filters={filters}
          setFilters={setFilters}
        />
      ) : null}

      <div className="alert-box">
        <p>
          <strong>Nota:</strong> Los datos se procesarán en formato <strong>.xlsx</strong>. Asegúrese de que los filtros sean correctos antes de exportar.
        </p>
      </div>

      <button className="btn-primary-export" onClick={() => handleChange()}>
        <DownloadIcon size={18} />
        Exportar Excel
      </button>
      <button className="btn-ghost-export" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );
};

export default ExportForm;
