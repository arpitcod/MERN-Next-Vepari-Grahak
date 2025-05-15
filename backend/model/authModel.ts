import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    vepari_shop: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "vepari_shop",
      // unique: true,
      sparse: true, // Add this line,
      default:null
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const authModel = mongoose.model("users", authSchema);

export default authModel;
