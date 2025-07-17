import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import OutlinedTextInput from "../../../components/ui/OutlinedTextInput/OutlinedTextInput";
import TermsAndConditionsInput from "./TermsAndConditionsInput";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";

const LoginForm = () => {
  const navigate = useNavigateWithSound();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [tncAccepted, setTncAccepted] = useState(false);
  const tncPageRoute = "/user/terms-and-conditions";

  const handleChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [name]: event.target.value,
      });
    };

  const isFormValid = () => {
    return (
      formValues.name.trim() !== "" &&
      formValues.email.trim() !== "" &&
      formValues.contact.trim() !== "" &&
      tncAccepted
    );
  };

  return (
    <Stack padding={"20px 40px"} flex={1}>
      <Typography fontSize={"30px"} fontWeight={"700"}>
        Login
      </Typography>
      <Stack gap="12px" marginTop={"12px"}>
        <OutlinedTextInput
          name="Name*"
          value={formValues.name}
          handleChange={(event) => handleChange("name")(event)}
        />
        <OutlinedTextInput
          name="Email*"
          value={formValues.email}
          handleChange={(event) => handleChange("email")(event)}
        />
        <OutlinedTextInput
          name="Contact*"
          value={formValues.contact}
          handleChange={(event) => handleChange("contact")(event)}
        />
      </Stack>
      <Box marginLeft={"-10px"} marginTop={"12px"}>
        <TermsAndConditionsInput
          tncAccepted={tncAccepted}
          tncPageRoute={tncPageRoute}
          setTncAccepted={setTncAccepted}
        />
      </Box>
      <BottomElement>
        <OutlinedButton 
          onClick={() => navigate("/user/home")}
          disabled={!isFormValid()}
        >
          Pay Now
        </OutlinedButton>
      </BottomElement>
    </Stack>
  );
};

export default LoginForm;
