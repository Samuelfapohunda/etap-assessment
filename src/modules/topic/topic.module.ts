import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { User } from 'src/models/user.entity';
import { Topic } from 'src/models/topic.entity';
import { Subject } from 'src/models/subject.entity';
import { MediaProvider } from 'src/utils/media.provider';

@Module({   
  imports: [TypeOrmModule.forFeature([Topic, Subject, User])],
  controllers: [TopicController],
  providers: [TopicService, MediaProvider],
})
export class TopicModule {}
