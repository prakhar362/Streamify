import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    streamChannelId: {
      type: String,
      default: ""
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;