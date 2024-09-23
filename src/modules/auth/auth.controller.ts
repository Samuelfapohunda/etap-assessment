import {
   Controller,
   Post,
   Body,
   HttpCode,
   HttpStatus,
   UseGuards,
 } from '@nestjs/common';
 import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
 import { AuthService } from './auth.service';
 import { RegisterDto, LoginDto, RefreshTokenDto } from 'src/common/dtos/auth.dto';
 import { IServiceResponse } from 'src/interfaces/http-response.interface';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUserId.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
 
 @ApiTags('auth')
 @Controller('auth')
 export class AuthController {
   constructor(private readonly authService: AuthService) {}
 
   @Post('register')
   @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Register a new user' })
   @ApiResponse({ status: 201, description: 'User successfully registered' })
   @ApiResponse({ status: 400, description: 'Bad Request' }) 
   async register(@Body() data: RegisterDto): Promise<IServiceResponse> {
     return this.authService.register(data);
   }
 
   @Post('login')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Login a user' })
   @ApiResponse({ status: 200, description: 'User successfully logged in' })
   @ApiResponse({ status: 502, description: 'Invalid email or password' })
   async login(@Body() data: LoginDto): Promise<IServiceResponse> {
     return this.authService.login(data);
   }
 
   @Post('refresh-token')
   @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard)
   @ApiOperation({ summary: 'Refresh access token' })
   @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
   @ApiResponse({ status: 502, description: 'Invalid email or password' })
   async refreshToken(
     @GetCurrentUserId() userId: string,
     @Body() refreshToken: RefreshTokenDto,
   ): Promise<IServiceResponse> {
     return this.authService.refreshToken(userId, refreshToken);
   }
 }
 