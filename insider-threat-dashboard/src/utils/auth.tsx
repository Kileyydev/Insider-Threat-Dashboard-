// utils/auth.ts
import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api-token-auth/", {
      username: email,
      password: password,
    });

    const token = response.data.token;
    localStorage.setItem("authToken", token);
    return token;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};
