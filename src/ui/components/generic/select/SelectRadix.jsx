import * as React from "react";
import * as Select from "@radix-ui/react-select";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";


import './selectradix.css';

const SelectRadix = ({ label,
                       name,
                       value,
                       onChange,
                       options = [],
                       valueKey = "value",
                       labelKey = "label",
                       placeholder = "Seleccione una opción",  
                    }) => {
    const SelectItem = React.forwardRef(
        ({ children, className, ...props }, forwardedRef) => {
            return (
                <Select.Item
                    className="SelectItem"
                    ref={forwardedRef}
                    {...props}
                >
                    <Select.ItemText>{children}</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                        <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
            );
        },
    );
    
    return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {label}
        </label>
      )}

      <Select.Root value={value?.toString()} onValueChange={onChange}>
        <Select.Trigger className="form-control SelectTrigger">
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="SelectContent">
            <Select.Viewport>
              {options.map((opt) => (
                <SelectItem
                  key={opt[valueKey]}
                  value={opt[valueKey].toString()}
                >
                  {opt[labelKey]}
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
    );
}

export default SelectRadix;