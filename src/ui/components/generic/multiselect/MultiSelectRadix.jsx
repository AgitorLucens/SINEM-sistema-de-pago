import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  CheckIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

import './multiselectradix.css';

const MultiSelectRadix = ({
                      options = [],
                      value = [],
                      onChange,
                      placeholder = "Seleccionar"
                    }) => {
  const toggleValue = (val) => {
    onChange(
      value.includes(val)
        ? value.filter(v => v !== val)
        : [...value, val]
    );
  };
  
  return (
    <DropdownMenu.Root closeOnSelect={false}>
      <DropdownMenu.Trigger asChild>
        <button className="MultiSelectTrigger">
          {value.length === options.length
            ? "Todas las fechas"
            : `${value.length} seleccionadas`}
            <ChevronDownIcon/>
        </button>
      </DropdownMenu.Trigger>


        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          {options.map(opt => (
            <DropdownMenu.CheckboxItem
              key={opt.value}
              checked={value.includes(opt.value)}
              onCheckedChange={() => toggleValue(opt.value)}
              className="DropdownMenuCheckboxItem"
            >
              <DropdownMenu.ItemIndicator>
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
              {opt.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>

    </DropdownMenu.Root>
  );
};

export default MultiSelectRadix;