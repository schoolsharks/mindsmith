import { Box, Stack, Typography, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import OutlinedTextInput from "../../../components/ui/OutlinedTextInput/OutlinedTextInput";
import TermsAndConditionsInput from "./TermsAndConditionsInput";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";
import { loginUser } from "../authSlice";
import { RootState, AppDispatch } from "../../../app/store";

const FORM_STORAGE_KEY = "loginFormData";

const LoginForm = () => {
  const navigate = useNavigateWithSound();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Load initial form data from sessionStorage
  const loadFormData = () => {
    const savedData = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        return {
          email: "",
          tncAccepted: false,
        };
      }
    }
    return {
      email: "",
      tncAccepted: false,
    };
  };

  const initialFormData = loadFormData();
  const [formValues, setFormValues] = useState({
    email: initialFormData.email,
  });
  const [tncAccepted, setTncAccepted] = useState(initialFormData.tncAccepted);
  const [isProcessing, setIsProcessing] = useState(false);
  const tncPageRoute = "/user/terms-and-conditions";

  useEffect(() => {
    const formData = {
      email: formValues.email,
      tncAccepted: tncAccepted,
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formValues, tncAccepted]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(FORM_STORAGE_KEY);
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
    return formValues.email?.trim() !== "" && tncAccepted;
  };

  const handleRegisterRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/user/register");
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsProcessing(true);
    try {
      // Call login thunk
      const result = await dispatch(
        loginUser({
          email: formValues.email.toLowerCase(),
        })
      );

      if (loginUser.fulfilled.match(result)) {
        // Clear the saved form data on successful login
        sessionStorage.removeItem(FORM_STORAGE_KEY);

        // Navigate to home page
        // navigate("/user/home");
      } else {
        // Handle login error
        const errorMessage =
          (result.payload as string) || "Login failed. Please try again.";

        if (
          errorMessage.includes("unauthorized") ||
          errorMessage.includes("not found")
        ) {
          alert(
            "Invalid email or user not found. Please check your email or register first."
          );
        } else {
          alert(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/user/home" replace />;
  }

  return (
    <Stack padding={"20px 40px"} flex={1}>
      <Typography fontSize={"30px"} fontWeight={"700"}>
        Login
      </Typography>
      <Stack gap="12px" marginTop={"12px"}>
        <OutlinedTextInput
          name="Email*"
          value={formValues.email}
          handleChange={(event) => handleChange("email")(event)}
        />
      </Stack>
      <Box marginLeft={"-10px"} marginTop={"12px"}>
        <TermsAndConditionsInput
          tncAccepted={tncAccepted}
          tncPageRoute={tncPageRoute}
          setTncAccepted={setTncAccepted}
        />
        <Box margin={"10px"} textAlign="left">
          <Typography variant="body2" component="span">
            New User?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleRegisterRedirect}
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
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
      <BottomElement>
        <OutlinedButton
          onClick={handleSubmit}
          disabled={!isFormValid() || isProcessing || loading}
        >
          {isProcessing || loading ? "Logging in..." : "Log In"}
        </OutlinedButton>
      </BottomElement>
    </Stack>
  );
};

export default LoginForm;
