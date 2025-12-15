export const handleFieldChange = (handleChange,name) => (value) => {
  handleChange({
    target: {
      name,
      value,
    },
  });
};

export const formatDate = (iso) =>
  new Intl.DateTimeFormat("es-CR").format(new Date(iso));

export const onRadixChange = (handleChange,name) => (value) => {
  handleChange({ target: { name, value } });
};