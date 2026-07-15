import type { User } from "@/types/user";

export const hasPermission = (user: User | null, permission: string) => {
  if (!user || !user.roleId) {
    return false;
  }

  return user?.roleId?.permissions?.includes(permission);
};
