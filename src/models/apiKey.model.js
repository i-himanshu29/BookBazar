import mongoose, { Schema } from "mongoose";

const apiKeySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const ApiKey = mongoose.model("ApiKey", apiKeySchema);
