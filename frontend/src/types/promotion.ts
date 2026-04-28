export interface Promotion {
  _id: string;
  title: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
