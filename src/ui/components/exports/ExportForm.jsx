import SelectRadix from "../generic/select/SelectRadix.jsx";
import MultiSelectRadix from "../generic/multiselect/MultiSelectRadix.jsx";
import { CalendarIcon, DownloadIcon, CheckCircledIcon, ClipboardIcon,
         ArrowBottomLeftIcon, PersonIcon,
} from "@radix-ui/react-icons";

import './exportform.css';
const ExportForm = ({ 
                      type,
                      filterConfig, 
                      filters,
                      setFilters,
                      selectData, 
                      data,
                      yearsData = [],
                      divisions = [],
                      concepts = [],
                      methods = [],
                      studentStatus  = [], 
                      onClose, 
                      onSave,
                      formState = [],
                      handleChange, 
                    }) => {
  return (
      <div className="form-group">
        {/* Tres primeras Opciones  */}
        {(type ===  "Pagos"      || 
         type === "Estudiantes"  ||
         type === "Gastos")      && (
          <div>
            <div className="input-grid">
              <div>
                <div className="label-export-form">
                  <CalendarIcon size={16} color="#9ca3af" />
                  Rango de Tiempo
                </div>
                { type === "Pagos" && (
                  <MultiSelectRadix
                    options={yearsData?.yearPayments.map(y => ({value: y.year, label: y.year}))}
                    value={filters.payments.years}
                    onChange={(years) =>
                      setFilters(prev => ({
                        ...prev,
                        payments: {
                          ...prev.payments,
                          years,
                        },
                      }))
                    }
                    placeholder="Escoger Años"
                  />
                )}
                { type === "Gastos" && (
                  <MultiSelectRadix
                    options={yearsData?.yearExpenses.map(y => ({value: y.year, label: y.year}))}
                    value={filters.expenses.years}
                    onChange={(years) =>
                      setFilters(prev => ({
                        ...prev,
                        expenses: {
                          ...prev.expenses,
                          years,
                        },
                      }))
                    }
                    placeholder="Escoger Años"
                  />
                )}
                { type === "Estudiantes" && (
                  <MultiSelectRadix
                    options={yearsData?.yearPayments.map(y => ({value: y.year, label: y.year}))}
                    value={filters.students.years}
                    onChange={(years) =>
                      setFilters(prev => ({
                        ...prev,
                        students: {
                          ...prev.students,
                          years,
                        },
                      }))
                    }
                    placeholder="Escoger Años"
                  />
                )}
              </div>
              {filterConfig.studentStatus &&(
                <div>
                  <div className="label-export-form">
                    <CheckCircledIcon size={16} color="#9ca3af" />
                    Estado Estudiante
                  </div>
                  <div className="chip-group">
                  {studentStatus.map(opt => (
                    <div
                      key={opt.value}
                      className={`chip ${filters.students.studentStatus.includes(Number(opt.active)) ? "chip-active" : ""}`}
                      onClick={() =>{
                        const value = Number(opt.active)
                        setFilters(prev => ({
                          ...prev,
                          students: {
                            ...prev.students,
                            studentStatus: prev.students.studentStatus.includes(value)
                              ? prev.students.studentStatus.filter(s => s !== value)
                              : [...prev.students.studentStatus, value],
                          }
                        }))
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filterConfig.concepts && (
              <div>
                <div className="label-export-form">
                  <CheckCircledIcon size={16} color="#9ca3af" />
                  Concepto de Pago
                </div>
                <div className="chip-group">
                {concepts.map(opt => (
                  <div
                    key={opt.id}
                    className={`chip ${filters.payments.concepts.includes(Number(opt.id)) ? "chip-active" : ""}`}
                    onClick={() =>{
                      const value = Number(opt.id)
                      setFilters(prev => ({
                        ...prev,
                        payments: {
                          ...prev.concepts,
                          concepts: prev.payments.concepts.includes(value)
                            ? prev.payments.concepts.filter(s => s !== value)
                            : [...prev.payments.concepts, value],
                        }
                      }))}
                    }
                  >
                    {opt.name}
                  </div>
                ))}
              </div>
            </div>
            )}  
          </div>
          
          <div className="input-grid">
            {filterConfig.divisions &&(
              <div>
                <div className="label-export-form">
                  <CheckCircledIcon size={16} color="#9ca3af" />
                  Curso de Pagos
                </div>
                <div className="chip-group">
                  {divisions.map(opt => (
                    <div
                      key={opt.id}
                      className={`chip ${filters.payments.divisions.includes(Number(opt.id)) ? "chip-active" : ""}`}
                      onClick={() =>{
                        const value = Number(opt.id)
                        setFilters(prev => ({
                          ...prev,
                          payments: {
                            ...prev.payments,
                            divisions: prev.payments.divisions.includes(value)
                              ? prev.payments.divisions.filter(s => s !== value)
                              : [...prev.payments.divisions, value],
                          }
                          
                        }))}
                      }
                    >
                      {opt.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filterConfig.concepts && (
              <div>
                <div className="label-export-form">
                  <CheckCircledIcon size={16} color="#9ca3af" />
                  Metodo de Pago
                </div>
                <div className="chip-group">
                  {methods.map(opt => (
                    <div
                      key={opt.value}
                      className={`chip ${filters.payments.methods.includes(Number(opt.value)) ? "chip-active" : ""}`}
                      onClick={() =>{
                        const value = Number(opt.value)
                        setFilters(prev => ({
                          ...prev,
                          payments: {
                            ...prev.payments,
                            methods: prev.payments.methods.includes(value)
                              ? prev.payments.methods.filter(s => s !== value)
                              : [...prev.payments.methods, value],
                          }
                          
                        }))
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
            )}  
          </div>
        </div>
        )}
        
        {/* Opcion Todo */}

        { type === "Todo" && ( 
          <div>
            {/* Pagos */}
            {formState.payments && (
              <div className="todo-type-container">
                <div>
                  <div className="label-export-form">
                    <ClipboardIcon size={16} color="#9ca3af" />
                    <h3> Ingreso </h3>
                  </div>
                  <div className="input-grid-todo" style={{marginTop: "-15px !important"}}>
                    <div>
                      <div className="label-export-form">
                        <CalendarIcon size={16} color="#9ca3af" />
                        Rango de Tiempo
                      </div>
                      <MultiSelectRadix
                        options={yearsData?.yearPayments.map(y => ({value: y.year, label: y.year}))}
                        value={filters.all.payments.years}
                        onChange={(years) =>
                          setFilters(prev => ({
                            ...prev,
                            all: {
                              ...prev.all,
                              payments: {
                                ...prev.all.payments,
                                years
                              },
                            },
                          })
                        )}
                        placeholder="Escoger Años"
                      />
                    </div>
                        
                    {filterConfig.concepts && (
                      <div>
                        <div className="label-export-form">
                          <CheckCircledIcon size={16} color="#9ca3af" />
                          Concepto de Pago
                        </div>
                        <div className="chip-group">
                          {concepts.map(opt => (
                            <div
                              key={opt.id}
                              className={`chip ${filters.payments.concepts.includes(Number(opt.id)) ? "chip-active" : ""}`}
                              onClick={() =>{
                                const value = Number(opt.id)
                                setFilters(prev => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    concepts: prev.payments.concepts.includes(value)
                                      ? prev.payments.concepts.filter(s => s !== value)
                                      : [...prev.payments.concepts, value],
                                  }
                                }))}
                              }
                            >
                              {opt.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}  
                  </div>
          
                  <div className="input-grid-todo">
                    {filterConfig.divisions &&(
                      <div>
                        <div className="label-export-form">
                          <CheckCircledIcon size={16} color="#9ca3af" />
                          Curso de Pagos
                        </div>
                        <div className="chip-group">
                          {divisions.map(opt => (
                            <div
                              key={opt.id}
                              className={`chip ${filters.payments.divisions.includes(Number(opt.id)) ? "chip-active" : ""}`}
                              onClick={() =>{
                                const value = Number(opt.id)
                                setFilters(prev => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    divisions: prev.payments.divisions.includes(value)
                                      ? prev.payments.divisions.filter(s => s !== value)
                                      : [...prev.payments.divisions, value],
                                  }  
                                }))}
                              }
                            >
                              {opt.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {filterConfig.concepts && (
                      <div>
                        <div className="label-export-form">
                          <CheckCircledIcon size={16} color="#9ca3af" />
                          Metodo de Pago
                        </div>
                        <div className="chip-group">
                          {methods.map(opt => (
                            <div
                              key={opt.value}
                              className={`chip ${filters.payments.methods.includes(Number(opt.value)) ? "chip-active" : ""}`}
                              onClick={() =>{
                                const value = Number(opt.value)
                                setFilters(prev => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    methods: prev.payments.methods.includes(value)
                                      ? prev.payments.methods.filter(s => s !== value)
                                      : [...prev.payments.methods, value],
                                  }  
                                }))
                              }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}  
                  </div> 
                </div>
              </div>
            )}
            {/* Gastos */}
            { formState.expenses && (
              <div className="todo-type-container">
                <div>
                  <div className="label-export-form">
                    <ArrowBottomLeftIcon size={16} color="#9ca3af" />
                    <h3> Egreso </h3>
                  </div>
                  <div className="input-grid-todo">
                    <div>
                      <div className="label-export-form">
                        <CalendarIcon size={16} color="#9ca3af" />
                        Rango de Tiempo
                      </div>
                      <MultiSelectRadix
                        options={yearsData?.yearExpenses.map(y => ({value: y.year, label: y.year}))}
                        value={filters.all.expenses.years}
                        onChange={(years) =>
                          setFilters(prev => ({
                            ...prev,
                            all: {
                              ...prev.all,
                              expenses: {
                                ...prev.all.expenses,
                                years
                              },
                            },
                          })
                        )}
                        placeholder="Escoger Años"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Estudiantes */}
            { formState.students && (
              <div className="todo-type-container">
                <div>
                  <div className="label-export-form">
                    <PersonIcon color="#9ca3af" />
                    <h3> Estudiantes</h3>
                  </div>
                  <div className="input-grid">
                    <div>
                      <div className="label-export-form">
                        <CalendarIcon size={16} color="#9ca3af" />
                        Rango de Tiempo
                      </div>
                      <MultiSelectRadix
                        options={yearsData?.yearPayments.map(y => ({value: y.year, label: y.year}))}
                        value={filters.all.students.years}
                        onChange={(years) =>
                          setFilters(prev => ({
                            ...prev,
                            all: {
                              ...prev.all,
                              students: {
                                ...prev.all.payments,
                                years
                              },
                            },
                          })
                        )}
                        placeholder="Escoger Años"
                      /> 
                    </div>
                    <div>
                      <div className="label-export-form">
                        <CheckCircledIcon size={16} color="#9ca3af" />
                        Estado Estudiante
                      </div>
                      <div className="chip-group">
                        {studentStatus.map(opt => (
                          <div
                            key={opt.value}
                            className={`chip ${filters.students.studentStatus.includes(Number(opt.active)) ? "chip-active" : ""}`}
                            onClick={() =>{
                              const value = Number(opt.active)
                              setFilters(prev => ({
                                ...prev,
                                students: {
                                  ...prev.students,
                                  studentStatus: prev.students.studentStatus.includes(value)
                                    ? prev.students.studentStatus.filter(s => s !== value)
                                    : [...prev.students.studentStatus, value],
                                } 
                              }))}
                            }
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="alert-box">
          <p>
            <strong>Nota:</strong> Los datos se procesarán en formato <strong>.xlsx</strong>. Asegúrese de que los filtros sean correctos antes de exportar.
          </p>
        </div>

        <button className="btn-primary-export" onClick={()=>handleChange()}>
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