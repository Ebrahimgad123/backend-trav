import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/error';
import path from "path"
import { sendEmail } from '../services/sendEmail';
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface UserSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  profileImage?: string;
}

const signToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '90d' }
  );
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const signup = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      throw new AppError('Please provide all required fields', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "fail",
        message: "Email is already registered",
      });
      return;
    }

    const userData: UserSignupData = {
      name,
      email,
      phone,
      password,
      role: "user",
    };

    if (req.file) {
      userData.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newUser = await User.create(userData);

    const emailToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    try {
      await sendEmail({
        email: newUser.email,
        username: newUser.name,
        emailToken,
      });

      res.status(201).json({
        success: true,
        message: "User registered. Please check your email to verify your account.",
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      next(new AppError("Failed to send verification email", 500));
    }
  } catch (error) {
    next(error);
  }
};


export const login = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      throw new AppError('Please provide email and password!', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }
     if (!user.isVerified) {
      throw new AppError('Please verify your email before logging in.', 401);
    }
   
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
}; 
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.id as string;

  if (!token) return next(new AppError("Verification token missing", 400));

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError("User not found", 404));
    if (user.isVerified) return next(new AppError("User already verified", 400));

    user.isVerified = true;
    await user.save();

    const filePath = path.join(process.cwd(), "public", "verified.html");
    return res.sendFile(filePath);
  } catch (err) {
    const failPath = path.join(process.cwd(), "public", "verification-failed.html");
    return res.sendFile(failPath);
  }
};