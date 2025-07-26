import { Button, SxProps } from "@mui/material";
import { MouseEvent } from "react";

interface ContainedButtonProps {
  sx?: SxProps;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void;
}
const ContainedButton: React.FC<ContainedButtonProps> = ({
  sx,
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      sx={{
        color: "#000",
        borderRadius: "12px",
        textTransform: "none",
        padding: "2px 12px",
        boxShadow: "none",
        "&:disabled": {
          backgroundColor: "#E0E0E0",
          color: "#B0B0B0",
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ContainedButton;
