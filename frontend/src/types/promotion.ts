export interface ApplyPromotionResponse {
  promotionId: string;
  code: string;
  title: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}
