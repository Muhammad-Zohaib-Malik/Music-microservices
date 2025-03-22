import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  playList: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      minlength: 5,
      maxlength: 10,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: [true, "role is required"],
    },
    playList: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, strict: "throw" }
);

export const User = mongoose.model("User", userSchema);
