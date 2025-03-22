import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";

export const registerUser = asyncHandler(async (req, res): Promise<any> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields are required",
    });

  try {
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const user = await User.findById(newUser._id).select("-password");

    return res
      .status(StatusCodes.CREATED)
      .json({ user, message: "User Registered Successfully" });
  } catch (error: any) {
    if (error.code === 11000 && error.keyValue.email)
      return res.status(StatusCodes.CONFLICT).json({
        message: "Email already exists",
      });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
