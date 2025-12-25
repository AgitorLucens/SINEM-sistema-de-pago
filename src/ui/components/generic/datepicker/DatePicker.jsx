import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import {useState} from "react";
import "react-day-picker/dist/style.css";
import "./datepicker.css";

const DatePicker = ({ value, onChange, placeholder = "Seleccionar fecha" }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="form-control date-trigger"
                onClick={() => setOpen(true)}>
          <span>
            {value ? format(value, "dd-MM-yyyy") : placeholder}
          </span>
          <CalendarIcon />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="date-popover" sideOffset={8}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date) onChange(date);
              setOpen(false);
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;