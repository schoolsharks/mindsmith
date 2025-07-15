import React from "react";
import { Checkbox, Stack, Typography } from "@mui/material";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";

interface TermsAndConditionsInputProps {
  tncAccepted: boolean;
  tncPageRoute: string;
  setTncAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermsAndConditionsInput: React.FC<TermsAndConditionsInputProps> = ({
  tncAccepted,
  tncPageRoute,
  setTncAccepted,
}) => {
  const navigateWithSound = useNavigateWithSound();
  return (
    <Stack direction="row" alignItems={"center"}>
      <Checkbox
        checked={tncAccepted}
        onChange={() => setTncAccepted((prev) => !prev)}
      />
      <Typography fontWeight={"500"} fontSize={"14px"}>
        I agree to the
        <span
          onClick={() => navigateWithSound(tncPageRoute)}
          style={{
            cursor: "pointer",
            marginLeft: "4px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Terms & conditions{" "}
        </span>
      </Typography>
    </Stack>
  );
};

export default TermsAndConditionsInput;
