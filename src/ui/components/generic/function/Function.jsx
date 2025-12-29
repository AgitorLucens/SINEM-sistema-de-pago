
export const handleFieldChange = (handleChange,name) => (value) => {
  handleChange({
    target: {
      name,
      value,
    },
  });
};

//handle radix dropdown
export const onRadixChange = (handleChange,name) => (value) => {
  handleChange({ target: { name, value } });
};

/*
  formats
*/
export const formatConsecutive = (year, consecutive) => {
  return `${year}-${String(consecutive).padStart(5, "0")}`;
}

export const formatDate = (iso) =>
  new Intl.DateTimeFormat("es-CR").format(new Date(iso));

export const formatCRC = (value) => {
    if (value === "" || value === null) return "";
    return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 2,
    }).format(value);
};