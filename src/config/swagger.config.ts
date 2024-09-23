
const SWAGGER_API_ROOT = 'docs';
const SWAGGER_API_NAME = 'Etap';
const SWAGGER_API_DESCRIPTION = 'API';
const SWAGGER_API_CURRENT_VERSION = '1.0';


import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
   const options = new DocumentBuilder()
     .setTitle(SWAGGER_API_NAME)
     .setDescription(SWAGGER_API_DESCRIPTION)
     .setVersion(SWAGGER_API_CURRENT_VERSION)
     .addBearerAuth()
     .build();
   const document = SwaggerModule.createDocument(app, options);
   SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
 };
 