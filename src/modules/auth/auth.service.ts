import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { User } from '../../models/user.model.js';
import { LoginInput } from './auth.validation.js';
import { LoginResult, UserResponse } from './auth.types.js';

export class AuthService {
  static async login(input: LoginInput): Promise<LoginResult> {
    const user = await User.findOne({ email: input.email.toLowerCase().trim() });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const signOptions: jwt.SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      {
        userId: user.id || user._id.toString(),
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      signOptions
    );

    const userResponse: UserResponse = {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userResponse,
      token,
    };
  }

  static async getMe(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
