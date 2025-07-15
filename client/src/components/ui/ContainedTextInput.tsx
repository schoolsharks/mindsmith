import { Button, SxProps } from "@mui/material";

interface ContainedButtonProps {
  sx?: SxProps;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
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
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ContainedButton;
