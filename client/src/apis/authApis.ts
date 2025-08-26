import type { UserFormData } from "../types/type";
import api from "./api";

export const signup = async (formData: UserFormData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Signup failed");
  }
}
export const login = async (formData: { email: string, password: string }) => {
  try {
    const response = await api.post('/auth/login', formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Login failed");
  }
}
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Login failed");
  }
}

