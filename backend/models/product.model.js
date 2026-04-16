import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    stock: { type: Number, required: true, min: 0, default: 0 },
    attributes: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema, "products");

export default Product;
