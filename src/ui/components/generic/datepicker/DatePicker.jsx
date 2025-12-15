import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import "react-day-picker/dist/style.css";
import "./datepicker.css";

const DatePicker = ({ value, onChange, placeholder = "Seleccionar fecha" }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="form-control date-trigger">
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
            }}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;