import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env.config';
import { AppDataSource } from '../../config/typeorm.config';
import { User } from 'src/models/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('No token provided');
    }
    const token = request.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, JWT_SECRET);
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: decoded['id'] },
      });
      request.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

