import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from same user on same book
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
