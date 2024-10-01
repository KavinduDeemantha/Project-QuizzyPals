import { Button } from "@mui/material";
import "../App.css";

<<<<<<< HEAD
const ButtonComponent = ({ label, width, height, onClick, fontSize = 18, isDisabled = false}) => {
    return (
        <>
            <Button style={{
                width: width,
                height: height,
                backgroundColor: '#cccccc',
                color: '#000000',
                fontSize: fontSize
            }}
                onClick={onClick}
                variant="contained"
                disabled={isDisabled}
            >{ label }</Button>
        </>
    )
=======
const ButtonComponent = ({ label, onClick }) => {
  return (
    <>
      <Button className="btn-component" onClick={onClick} variant="contained">
        {label}
      </Button>
    </>
  );
>>>>>>> eb27995 (removed inline css and set them in separare css files (#12))
};

export default ButtonComponent;
