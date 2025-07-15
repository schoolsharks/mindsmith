import React from "react";
import { Box, Checkbox, Stack, Typography } from "@mui/material";
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
    <Stack direction="row" alignItems={"center"} position={"relative"}>
      <Checkbox
        checked={tncAccepted}
        onChange={() => setTncAccepted((prev) => !prev)}
      />
      <Typography fontWeight={"500"} fontSize={"14px"}>
        I agree to the
        <Box
          component={"span"}
          onClick={() => navigateWithSound(tncPageRoute)}
          sx={{
            cursor: "pointer",
            marginLeft: "4px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Terms & conditions{" "}
        </Box>
      </Typography>
    </Stack>
  );
};

export default TermsAndConditionsInput;
