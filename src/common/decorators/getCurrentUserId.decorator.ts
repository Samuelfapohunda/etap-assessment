import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';


export const GetCurrentUserId = createParamDecorator(
   (data: unknown, ctx: ExecutionContext) => {
     const request = ctx.switchToHttp().getRequest();
     if (!request.user) {
       throw new UnauthorizedException('Unauthorized request');
     }
     return request.admin;
   },
 );