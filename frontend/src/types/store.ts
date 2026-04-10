import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  forgotPasswordLoading: boolean;

  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getDetail: () => Promise<void>;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
}
