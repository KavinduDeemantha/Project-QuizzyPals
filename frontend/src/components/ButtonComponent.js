import { Button } from "@mui/material";
import "../App.css";

const ButtonComponent = ({ label, onClick, isDisabled = false }) => {
  return (
    <>
      <Button
        className="btn-component"
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
