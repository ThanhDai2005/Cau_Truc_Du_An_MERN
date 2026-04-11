export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
