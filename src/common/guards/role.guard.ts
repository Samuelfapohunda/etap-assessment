import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { verify } from 'jsonwebtoken';
  import { User } from '../../models/user.entity';
  import { JWT_SECRET } from 'src/config/env.config';
  import { ROLE } from '../enums/index';
 
 
 @Injectable()
 export class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
       const request = context.switchToHttp().getRequest();
       const authHeader = request.headers.authorization;
       if (!authHeader) {
          throw new UnauthorizedException('You are not authorized to access this resource');
       }
       const token = authHeader.split(' ')[1] || authHeader;
       try {
          const decoded = verify(token, JWT_SECRET) as User;
          if(decoded.role === ROLE.STUDENT){
             throw new UnauthorizedException('You are not authorized to access this resource');
           }
          request.user = decoded;
          return true;
       } catch (error) {
          throw new UnauthorizedException('You are not authorized to access this resource');
       }
    }
 }