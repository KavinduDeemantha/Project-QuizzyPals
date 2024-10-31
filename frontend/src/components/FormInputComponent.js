import { TextField } from "@mui/material";

const FormInputComponent = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  isRequired = false,
}) => {
  return (
    <>
      <div className="form-component-container">{label}</div>

      <TextField
        className="form-component"
        value={value}
        label={placeholder}
        variant="standard"
        type={type}
        onChange={onChange}
        required={isRequired}
      />
    </>
  );
};

export default FormInputComponent;
