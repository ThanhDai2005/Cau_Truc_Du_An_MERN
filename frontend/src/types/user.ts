export interface User {
  _id: string;
  email: string;
  displayName: string;
  role: "user" | "admin" | "staff";
  status: "active" | "inactive";
  avatarUrl?: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}
