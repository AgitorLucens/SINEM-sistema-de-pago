
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

export const formatPhone = (value) => {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");

  if (digits.length !== 8) return value;

  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};


export const formatMonth = (monthNum) => {
  if (!monthNum || monthNum === 0 ) return "N/A";
  let month;
  switch(monthNum){
    case 1:
      month = "Enero";
      break;
    case 2:
      month = "Febrero";
      break;
    case 3:
      month = "Marzo";
      break;
    case 4:
      month = "Abril";
      break;
    case 5:
      month = "Mayo";
      break;
    case 6:
      month = "Junio";
      break;
    case 7:
      month = "Julio";
      break;
    case 8:
      month = "Agosto";
      break;
    case 9:
      month = "Septiembre";
      break;
    case 10:
      month = "Octubre";
      break;
    case 11:
      month = "Noviembre";
      break;
    case 12:
      month = "Diciembre";
      break;
  }
  return month;
}