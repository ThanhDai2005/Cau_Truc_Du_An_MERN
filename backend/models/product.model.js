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
    price: { type: Number, required: true },
    discount: { type: Number },
    images: [],
    stock: { type: Number, required: true, min: 0, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema, "products");

export default Product;
