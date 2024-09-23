import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SubjectModule } from './modules/subject/subject.module';
import { TopicModule } from './modules/topic/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';

@Module({
  imports: [ 
    AuthModule,
    SubjectModule,
    TopicModule,
    TypeOrmModule.forRoot(typeormConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
