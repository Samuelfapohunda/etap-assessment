import { sign } from 'jsonwebtoken';
import { User } from '../../models/user.entity';
import { JwtPayload } from 'src//interfaces/jwt.interface';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../../config/env.config';


export class Helpers {
   static async signToken(user: User) {
      const payload: JwtPayload = {
        id: user.id,
        role: user.role,
        
      };
      return sign(payload, JWT_SECRET, { expiresIn: '1hr' });
    }
  
    static async refreshJWT(user: User) {
      const payload: JwtPayload = {
        id: user.id,
        role: user.role,
       
      };
      return sign(payload, JWT_REFRESH_SECRET, { expiresIn: '72hr' });
    }
  
    static async generateOtp(length) {
      if (length < 1 || length > 10) {
        throw new Error('Invalid OTP length. Length should be between 1 and 10.');
      }
  
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
  
      return Math.floor(min + Math.random() * (max - min + 1));
    }
}