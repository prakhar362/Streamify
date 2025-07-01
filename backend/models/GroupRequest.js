import mongoose from "mongoose";

const groupRequestSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate requests
groupRequestSchema.index(
  { group: 1, sender: 1, recipient: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

const GroupRequest = mongoose.model("GroupRequest", groupRequestSchema);

export default GroupRequest;