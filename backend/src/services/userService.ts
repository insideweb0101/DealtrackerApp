import { userModel } from '../models/User';
import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const userService = {
  async register(email: string, name: string, password: string, role: string = 'sales_rep') {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await userModel.create({
      email,
      name,
      password_hash: password,
      role: role as any,
    } as Partial<User>);

    return this.generateTokens(user);
  },

  async login(email: string, password: string) {
    const user = await userModel.verifyPassword(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user);
  },

  async getUser(id: string) {
    return userModel.findById(id);
  },

  async updateUser(id: string, data: Partial<User>) {
    return userModel.update(id, data);
  },

  async deleteUser(id: string) {
    return userModel.delete(id);
  },

  async getAllUsers() {
    return userModel.findAll();
  },

  generateTokens(user: any) {
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    return {
      token,
      user,
    };
  },
};
