import * as Select from "@radix-ui/react-select";
import {
	MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { useMemo, useState, useRef, useEffect, useEffectEvent } from "react";

const SearchSelectRadix = ({
  value,
  options,
  valueKey = "value",
  labelKey = "label",
  placeholder = "Seleccione",
  onChange,
  open,
  onOpenChange,
}) => {
  const [search, setSearch] = useState("");
  //rrecuperar foco cuando hay cambios en lista
  const inputRef = useRef(null);

  useEffect(()=>{
    if (inputRef.current){
      inputRef.current.focus();
    }
  }, [search]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;

    return options.filter(opt =>
      String(opt[labelKey])
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, options, labelKey]);

  const handleValueChange = (val) => {
    if (search) return; // ⛔ no cambiar value mientras se busca
    onChange(val);
  };

  return (
    <Select.Root
      value={value}
      open={open}
      onValueChange={(val) => {
        if (!search) onChange(val);
      }}
      onOpenChange={(o) => {
        if (!o) setSearch("");
        onOpenChange?.(o);
      }}
    >
      <Select.Trigger className="SelectTrigger">
        {!open && <Select.Value placeholder={placeholder} />}
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="SelectContent"
          position="popper"
          sideOffset={4}
        >
          
          {/* 🔍 Buscador */}
          <div style={{ padding: "0.5rem" }}>
            { search?.length === 0 && (
              <MagnifyingGlassIcon
                style={{
                  position: "absolute",
                  left: "0.5rem",
                  top: "18%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
              />
            )}
            
            <input
              ref={inputRef}
              autoFocus
              onKeyDownCapture={(e) => {
                e.stopPropagation(); // 🔥 esto bloquea el typeahead de Radix
              }}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="   Buscar..."
              className="search-input"
            />
          </div>

          <Select.Viewport>
            {filteredOptions.length === 0 && (
              <div
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "0.875rem",
                }}
              >
                Sin resultados
              </div>
            )}

            {filteredOptions.map(opt => (
              <Select.Item
                key={opt[valueKey]}
                value={String(opt[valueKey])}
                className="SelectItem"
              >
                <Select.ItemText>
                  {opt[labelKey]}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default SearchSelectRadix;
