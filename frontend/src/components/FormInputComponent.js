import { TextField } from "@mui/material";

const FormInputComponent = ({ type, label, placeholder, value, onChange }) => {
    return (
        <>
            <div style={{
                fontSize: 24,
                marginTop: '5vh',
            }}>{label}</div>

            <TextField
                style={{
                    width: 300,
                    marginTop: '1vh',
                }}
                value={value}
                label={placeholder}
                variant="standard"
                type={type}
                onChange={onChange}
            />
        </>
    );
};

export default FormInputComponent;
