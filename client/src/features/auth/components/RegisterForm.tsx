import { Box, Stack, Typography, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import OutlinedTextInput from "../../../components/ui/OutlinedTextInput/OutlinedTextInput";
import TermsAndConditionsInput from "./TermsAndConditionsInput";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";

const FORM_STORAGE_KEY = "loginFormData";

const RegisterForm = () => {
  const navigateWithSound = useNavigateWithSound();

  // Load initial form data from sessionStorage
  const loadFormData = () => {
    const savedData = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        return {
          name: "",
          email: "",
          contact: "",
          tncAccepted: false,
        };
      }
    }
    return {
      name: "",
      email: "",
      contact: "",
      tncAccepted: false,
    };
  };

  const initialFormData = loadFormData();
  const [formValues, setFormValues] = useState({
    name: initialFormData.name,
    email: initialFormData.email,
    contact: initialFormData.contact,
  });
  const [tncAccepted, setTncAccepted] = useState(initialFormData.tncAccepted);
  const tncPageRoute = "/user/terms-and-conditions";

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    const formData = {
      name: formValues.name,
      email: formValues.email,
      contact: formValues.contact,
      tncAccepted: tncAccepted,
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formValues, tncAccepted]);

  // Clear form data when component unmounts (optional - remove if you want to persist across sessions)
  useEffect(() => {
    return () => {
      // Uncomment the line below if you want to clear data when component unmounts
      // sessionStorage.removeItem(FORM_STORAGE_KEY);
    };
  }, []);

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

  const handleLoginRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithSound("/user/login");
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      // Clear the saved form data on successful submission
      sessionStorage.removeItem(FORM_STORAGE_KEY);
      navigateWithSound("/user/home");
    }
  };

  return (
    <Stack padding={"20px 40px"} flex={1}>
      <Typography fontSize={"30px"} fontWeight={"700"}>
        Register
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
        <Box marginTop={"8px"} textAlign="center">
          <Typography variant="body2" component="span">
            Existing User?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleLoginRedirect}
              sx={{
                color: "primary.main",
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
                font: "inherit",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
      <BottomElement>
        <OutlinedButton onClick={handleSubmit} disabled={!isFormValid()}>
          Pay Now
        </OutlinedButton>
      </BottomElement>
    </Stack>
  );
};

export default RegisterForm;
