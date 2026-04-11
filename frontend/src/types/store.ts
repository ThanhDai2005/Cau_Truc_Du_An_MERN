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
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
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

export interface AdminState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface UserState {
  uploadAvatar: (formData: FormData) => Promise<void>;
  updateInfo: (
    displayName: string,
    username: string,
    email: string,
    phone: string,
  ) => Promise<void>;
}
