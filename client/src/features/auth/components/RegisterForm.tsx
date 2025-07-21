import { Box, Stack, Typography, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import OutlinedTextInput from "../../../components/ui/OutlinedTextInput/OutlinedTextInput";
import TermsAndConditionsInput from "./TermsAndConditionsInput";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";
import axios from 'axios';
import { loadRazorpay } from '../../../services/paymentService';

const FORM_STORAGE_KEY = "loginFormData";

const RegisterForm = () => {
  const navigateWithSound = useNavigateWithSound();

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
  const [isProcessing, setIsProcessing] = useState(false);
  const tncPageRoute = "/user/terms-and-conditions";

  useEffect(() => {
    const formData = {
      name: formValues.name,
      email: formValues.email,
      contact: formValues.contact,
      tncAccepted: tncAccepted,
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formValues, tncAccepted]);

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

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    
    setIsProcessing(true);
    try {
      // 1. First create the user (without payment)
      const userResponse = await axios.post('/api/v1/auth/register', {
        name: formValues.name,
        email: formValues.email,
        contact: formValues.contact
      });
      console.log("user createtd");

      // 2. Initialize Razorpay payment
      const orderResponse = await axios.post('/api/v1/payment/create-order', {
        amount: 2500 * 100, // in paise
        currency: 'INR',
        userId: userResponse.data.user._id
      });

      // 3. Load Razorpay script and show payment modal
      await loadRazorpay();

      const options = {
        key: "rzp_test_zPx6C3jYARmFmh",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Mental Health Assessment",
        description: "Payment for diagnostic test",
        order_id: orderResponse.data.id,
        handler: async function(response: any) {
          try {
            // Verify payment on server
            await axios.post('/api/v1/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userResponse.data.user._id
            });
            
            // Clear form data and redirect
            sessionStorage.removeItem(FORM_STORAGE_KEY);
            navigateWithSound("/user/home");
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formValues.name,
          email: formValues.email,
          contact: formValues.contact
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Registration/Payment error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
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
      <OutlinedButton 
          onClick={handleSubmit} 
          disabled={!isFormValid() || isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now (₹2500)"}
        </OutlinedButton>
      </BottomElement>
    </Stack>
  );
};

export default RegisterForm;
