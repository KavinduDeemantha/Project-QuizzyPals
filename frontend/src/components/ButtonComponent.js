import { Button } from "@mui/material";
import "../App.css";

const ButtonComponent = ({ label, onClick, isDisabled = false, className }) => {
  return (
    <>
      <Button
        className={`btn-component ${className}`}
        disabled={isDisabled}
        onClick={onClick}
        variant="contained"
      >
        {label}
      </Button>
    </>
  );
};

export default ButtonComponent;
