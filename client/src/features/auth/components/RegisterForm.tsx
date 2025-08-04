import { Box, Stack, Typography, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import OutlinedTextInput from "../../../components/ui/OutlinedTextInput/OutlinedTextInput";
import TermsAndConditionsInput from "./TermsAndConditionsInput";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";
import { getRazorpayKey, loadRazorpay } from "../../../services/paymentService";
import { authApi } from "../../../services/api/authApi";
import { axiosBaseApi } from "../../../services/axiosBaseApi";
import { setAuthenticated } from "../authSlice";
import { RootState, AppDispatch } from "../../../app/store";
import httpStatus from "http-status-codes";

const FORM_STORAGE_KEY = "loginFormData";

const RegisterForm = () => {
  const navigateWithSound = useNavigateWithSound();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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
      formValues.name?.trim() !== "" &&
      formValues.email?.trim() !== "" &&
      formValues.contact?.trim() !== "" &&
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
      const userResponse = await authApi.register({
        name: formValues.name,
        email: formValues.email.toLowerCase(),
        contact: formValues.contact,
      });

      // 2. Initialize Razorpay payment
      const orderResponse = await axiosBaseApi.post("/payment/create-order", {
        // amount: 2500 * 100, // in paise
        // currency: "INR",
        userId: userResponse.user._id,
      });

      // 3. Get Razorpay key from backend
      const razorpayKey = await getRazorpayKey();

      // 4. Load Razorpay script and show payment modal
      await loadRazorpay();

      const options = {
        key: razorpayKey,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Mental Health Assessment",
        description: "Payment for diagnostic test",
        order_id: orderResponse.data.id,
        handler: async function (response: any) {
          try {
            // Verify payment on server and save details else remove it, only start from await
            await axiosBaseApi.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: userResponse.user._id,
            });

            // Set user as authenticated after successful payment verification
            dispatch(setAuthenticated(true));

            // FOR CHECKING PAYMENT DETAILS ON BROWSER ->
            // console.log(
            //   "Payment details:",
            //   verificationResponse.data.paymentDetails
            // );

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
          contact: formValues.contact,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Registration/Payment error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";

      // Handle duplicate email/contact specifically
      if (error.response?.status === httpStatus.CONFLICT) {
        alert(errorMessage);
      } else {
        alert("An error occurred. Please try again.");
      }
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
        <Box margin={"10px"} textAlign="left">
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
