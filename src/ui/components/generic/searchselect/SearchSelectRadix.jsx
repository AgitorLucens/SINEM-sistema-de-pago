import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixSelect from "@radix-ui/react-select";
import { matchSorter } from "match-sorter";
import { startTransition, useMemo, useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronUpDownIcon, SearchIcon } from "../../icons/Icons.jsx";

import "./searchselectradix.css";

const SearchSelectRadix = ({
  value,
  options,
  onChange,
  valueKey = "value",
  labelKey = "label",
  open,
  onOpenChange,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    if (!searchValue) return options;

    const filtered = matchSorter(options, searchValue, {
      keys: [labelKey, valueKey],
    });

    const selected = options.find(
      (opt) => String(opt[valueKey]) === String(value)
    );

    if (selected && !filtered.includes(selected)) {
      filtered.push(selected);
    }

    return filtered;
  }, [searchValue, value, options, valueKey, labelKey]);

  return (
    <RadixSelect.Root
      value={String(value ?? "")}
      onValueChange={onChange}
      open={open}
      onOpenChange={onOpenChange}
    >
      <ComboboxProvider
        open={open}
        setOpen={onOpenChange}
        resetValueOnHide
        includesBaseElement={false}
        setValue={(val) => {
          startTransition(() => {
            setSearchValue(val);
          });
        }}
      >
        <RadixSelect.Trigger className="select">
          <RadixSelect.Value placeholder="Seleccionar..." />
          <RadixSelect.Icon className="select-icon">
            <ChevronUpDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Content
          role="dialog"
          position="popper"
          className="popover"
          sideOffset={4}
        >
          <div className="combobox-wrapper">
            <SearchIcon />
            <Combobox
              autoSelect
              placeholder="Buscar..."
              className="combobox"
              onBlurCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>

          <ComboboxList className="listbox">
            {matches.map((opt) => (
              <RadixSelect.Item
                key={opt[valueKey]}
                value={String(opt[valueKey])}
                asChild
                className="item"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>
                    {opt[labelKey]}
                  </RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="item-indicator">
                    <CheckIcon />
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
};

export default SearchSelectRadix;
