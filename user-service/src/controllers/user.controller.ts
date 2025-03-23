import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const registerUser = asyncHandler(async (req, res): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields are required",
    });
    return;
  }
  try {
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    const user = await User.findById(newUser._id).select("-password");

    res
      .status(StatusCodes.CREATED)
      .json({ user, message: "User Registered Successfully" });
  } catch (error: any) {
    if (error.code === 11000 && error.keyValue.email) {
      res.status(StatusCodes.CONFLICT).json({
        message: "Email already exists",
      });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

export const loginUser = asyncHandler(async (req, res): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields are required",
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "User Not Found",
    });
    return;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid password",
    });
    return;
  }

  const token = user.generateToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      playlist: user.playList,
      token,
    },
  });
});

export const myProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        playlist: user?.playList,
      },
    });
  }
);

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Logged out successfully",
  });
});
