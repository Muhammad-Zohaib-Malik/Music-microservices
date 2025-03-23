import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  playList: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
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
      default:"user",
      required: true,
    },
    playList: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, strict: "throw" }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (): string {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const User = mongoose.model("User", userSchema);
