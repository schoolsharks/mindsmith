import { axiosBaseApi } from "../axiosBaseApi";

export interface RegisterRequest {
  name: string;
  email: string;
  contact: string;
}

export interface LoginRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    contact: string;
    paymentStatus: string;
    quizProgress: {
      currentSection: number;
      completed: boolean;
    };
  };
  accessToken: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosBaseApi.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosBaseApi.post("/auth/login", data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<AuthResponse> => {
    const response = await axiosBaseApi.post("/auth/verify-otp", data);
    return response.data;
  },

  fetchUser: async (): Promise<AuthResponse> => {
    const response = await axiosBaseApi.get("/auth/fetch-user");
    return response.data;
  },
};
