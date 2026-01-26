import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import {useState} from "react";
import "react-day-picker/dist/style.css";
import "./datepicker.css";

const DatePicker = ({
                  value,
                  onChange,
                  onOpenChange, 
                  placeholder = "Seleccionar fecha",
                }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (val) => {
    setOpen(val);
    onOpenChange?.(val); // 👈 avisa al padre
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button type="button" className="form-control date-trigger">
          <span>
            {value ? format(value, "dd/MM/yyyy") : placeholder}
          </span>
          <CalendarIcon />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
              className="date-popover"
              side="top"
              align="start"
              sticky="always"
              sideOffset={8}
        >
          <DayPicker
            mode="single"
            fixedWeeks
            selected={value}
            onSelect={(date) => {
              if (date) onChange(date);
              handleOpenChange(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;