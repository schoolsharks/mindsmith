import { TextField, useTheme } from "@mui/material";
import "./OutlinedTextInput.css";

interface OutlinedTextInputProps {
  value: string;
  name: string;
  isMandatory?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OutlinedTextInput: React.FC<OutlinedTextInputProps> = ({
  name,
  value,
  isMandatory,
  handleChange,
}) => {
  const placeholder =
    name.charAt(0).toUpperCase() + name.slice(1) + (isMandatory ? "*" : "");
  const fieldName = name.toLowerCase().replace(" ", "_");

  const theme = useTheme();
  return (
    <TextField
      id={name}
      name={fieldName}
      className={`${isMandatory ? "" : "not-mandate"}`}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      sx={{
        width: "100%",
        "& fieldset": { border: `2px solid ${theme.palette.primary.main}` },
      }}
    />
  );
};

export default OutlinedTextInput;
