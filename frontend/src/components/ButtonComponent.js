import { Button } from "@mui/material"

const ButtonComponent = ({ label, width, height, onClick, fontSize = 18}) => {
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
            >{ label }</Button>
        </>
    )
};

export default ButtonComponent;
