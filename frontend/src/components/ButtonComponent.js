import { Button } from "@mui/material";
import "../App.css";

const ButtonComponent = ({ label, onClick }) => {
  return (
    <>
      <Button className="btn-component" onClick={onClick} variant="contained">
        {label}
      </Button>
    </>
  );
};

export default ButtonComponent;
