import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/error';

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

  // Remove password from output
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

    // Check if email is already registered
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

    // Add profile image if uploaded
    if (req.file) {
      userData.profileImage = req.file.filename;
    }

    const newUser = await User.create(userData);
    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      throw new AppError('Please provide email and password!', 400);
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    // 3) If everything ok, send token to client
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