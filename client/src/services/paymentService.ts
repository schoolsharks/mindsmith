import axios from "axios";

export const loadRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      return resolve();
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
};

// Add this new function to fetch Razorpay key from backend
export const getRazorpayKey = async (): Promise<string> => {
  try {
    const response = await axios.get('/api/v1/payment/config');
    return response.data.razorpayKey;
  } catch (error) {
    console.error("Failed to fetch Razorpay key:", error);
    throw new Error("Payment configuration failed");
  }
};