import { Button, SxProps } from "@mui/material";
import { MouseEvent } from "react";

interface OutlinedButtonProps {
  sx?: SxProps;
  disabled?: boolean;
  border?: string;
  children?: React.ReactNode;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  sx,
  children,
  border = "2px solid #000000",
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      variant="outlined"
      disabled={disabled}
      sx={{
        border: border,
        color: "#000",
        borderRadius: "12px",
        textTransform: "none",
        padding: "5px 12px",
        "&.Mui-disabled": {
          border: `${border}60`,
          color: "#00000080",
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default OutlinedButton;
