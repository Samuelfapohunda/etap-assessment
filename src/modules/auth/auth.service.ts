import {
   Injectable,
   BadRequestException,
   BadGatewayException,
 } from '@nestjs/common';
 import { Repository } from 'typeorm';
 import { InjectRepository } from '@nestjs/typeorm';
 import { User } from 'src/models/user.entity';
 import { IServiceResponse } from 'src/interfaces/http-response.interface';
 import { Helpers } from 'src/common/helpers';
 import { hash, verify } from 'argon2';
 import { ROLE } from 'src/common/enums';
 import { access } from 'fs';
 import { LoginDto, RefreshTokenDto, RegisterDto } from 'src/common/dtos/auth.dto';
 
 @Injectable()  
 export class AuthService {
   constructor(
     @InjectRepository(User)
     private readonly userRepository: Repository<User>,
   ) {}    
  
   async register(data: RegisterDto): Promise<IServiceResponse> {
     const user = await this.userRepository.findOne({
       where: {
         email: data.email,
       },
     });
     if (user) {
       throw new BadRequestException('User already exists');
     }
 
     const hashedPassword = await hash(data.password);
     const newUser = await this.userRepository.create({
       ...data,
       password: hashedPassword,
     });
 
     await this.userRepository.save(newUser);
     const token = await Helpers.signToken(newUser);
     const refreshToken = await Helpers.refreshJWT(newUser);
     const hashRefreshToken = await hash(refreshToken);
 
     await this.userRepository.update(
       { id: newUser.id },
       {
         refreshokenHash: hashRefreshToken,
       },
     );
 
     return {
       data: {
         tokens: {
           accessToken: token,
           refreshToken: refreshToken,
         },
       },
     };
   }
 
   async login(data: LoginDto): Promise<IServiceResponse> {
     const user = await this.userRepository.findOne({
       where: {
         email: data.email,
       },
     });
     if (!user) {
       throw new BadGatewayException('Invalid email or password');
     }
 
     const isValid = await verify(user.password, data.password);
     if (!isValid) {
       throw new BadGatewayException('Invalid email or password');
     }
 
     const token = await Helpers.signToken(user);
     const refreshToken = await Helpers.refreshJWT(user);
 
     const hashRefreshToken = await hash(refreshToken);
 
     await this.userRepository.update(
       { id: user.id },
       {
         refreshokenHash: hashRefreshToken,
       },
     );
 
     return {
       data: {
         accessToken: token,
         refreshToken: refreshToken,
       },
     };
   }
 
async forgotPassword(email: string): Promise<IServiceResponse> {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new BadGatewayException('Invalid email');
      }
  
      const token = await Helpers.signToken(user);
      const refreshToken = await Helpers.refreshJWT(user);
  
      return {
        data: {
          accessToken: token,
          refreshToken: refreshToken,
        },
      };
    }

    async resetPassword(
      email: string,
      newPassword: string,
    ): Promise<IServiceResponse> {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new BadGatewayException('Invalid email');
      }
  
      const hashedPassword = await hash(newPassword);
  
      await this.userRepository.update(
        { id: user.id },
        {
          password: hashedPassword,
        },
      );
  
      return {
        data: {
          message: 'Password reset successfully',
        },
      };
    }

   async refreshToken(
     userId: string,
     refreshToken: RefreshTokenDto,
   ): Promise<IServiceResponse> {
     const user = await this.userRepository.findOne({
       where: {
         id: userId,
       },
     });
     if (!user || !user.refreshokenHash) {
       throw new BadGatewayException('Invalid email or password');
     }
 
     const isMatch = await verify(user.refreshokenHash, refreshToken.refreshToken);
     if (!isMatch) {
       throw new BadGatewayException('Invalid email or password');
     }
     const token = await Helpers.signToken(user);
     const refresh = await Helpers.refreshJWT(user);
 
     return {
       data: {
         accessToken: token,
         refreshToken: refresh,
       },
     };
   }
 }
 