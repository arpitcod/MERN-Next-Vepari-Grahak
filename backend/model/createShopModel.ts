import mongoose from "mongoose";

const createShopSchema = new mongoose.Schema(
  {
    vepariname: {
      type: String,
      required: true,
    },
    shopname: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
   
    description: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    banner: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      country: {
        type: String,
        default: "india",
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      unique: true,
    },
    shopTime: {
      startTime: {
        type: String, // you can use Date if you want specific time objects
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
     products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        default: [], // optional
      },
    ],
  },
  { timestamps: true }
);

const createShopModel = mongoose.model("vepari_shop", createShopSchema);

export default createShopModel;
