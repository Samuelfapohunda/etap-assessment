import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceResponse } from 'src/interfaces/http-response.interface';
import { CreateTopicDto } from 'src/common/dtos/topic.dto';
import { Topic } from 'src/models/topic.entity';
import { Subject } from 'src/models/subject.entity';
import { MediaProvider } from 'src/utils/media.provider';
import { User } from 'src/models/user.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mediaProvider: MediaProvider,
  ) {}

  async createTopic(
    file: Express.Multer.File,
    body: CreateTopicDto,
    subjectId: string,
  ): Promise<IServiceResponse> {
    try {
      console.log('Received file:', file);

      const videoUrl = await this.mediaProvider.uploadAndCompressVideo(file);
      const subject = await this.subjectRepository.findOne({
        where: {
          id: subjectId,
        },
      });

      if (!subject) {
        throw new BadRequestException('Subject not found');
      }

      const newTopic = this.topicRepository.create({
        ...body,
        subject,
        video: videoUrl,
      });

      await this.topicRepository.save(newTopic);

      return {
        data: {
          topic: newTopic,
        },
      };
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }

  async getTopicsBySubject(subjectId: string) {
    try {
      const subject = await this.subjectRepository.find({
        where: {
          id: subjectId,
        },
      });
      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      const topics = await this.topicRepository.find({
        relations: ['subject'],
        where: {
          subject: {
            id: subjectId,
          },
        },
      });

      return topics;
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }

  async deleteTopic(topicId: string): Promise<IServiceResponse> {
    try {
      const topic = await this.topicRepository.findOne({
        where: {
          id: topicId,
        },
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }

      await this.topicRepository.delete(topicId);

      return {
        data: {
          message: 'Topic deleted successfully',
        },
      };
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }

  async getTopic(topicId: string): Promise<IServiceResponse> {
    const topic = await this.topicRepository.findOne({
      where: {
        id: topicId,
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return {
      data: {
        topic,
      },
    };
  }

  async updateTopic(
    topicId: string,
    body: CreateTopicDto,
  ): Promise<IServiceResponse> {
    try {
      const topic = await this.topicRepository.findOne({
        where: {
          id: topicId,
        },
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }

      await this.topicRepository.update(
        { id: topicId },
        {
          ...body,
        },
      );

      return {
        data: {
          message: 'Topic updated successfully',
        },
      };
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }

  async markTopicAsCompleted(
    topicId: string,
    userId: string,
  ): Promise<IServiceResponse<Topic>> {
    const topic = await this.topicRepository.findOne({
      where: { id: topicId },
      relations: ['completedBy'],
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    topic.completed = true;
    topic.completedAt = new Date();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!topic.completedBy.some((u) => u.id === user.id)) {
      topic.completedBy.push(user);
    }
    topic.completed = true;
    topic.completedAt = new Date();

    const updatedTopic = await this.topicRepository.save(topic);
    return { data: updatedTopic };
  }



  async calculateCompletionRateForLearner(
    subjectId: string,
    userId: string,
  ): Promise<number> {
    const totalTopics = await this.topicRepository.count({
      where: { subject: { id: subjectId } },
    });

    const completedTopics = await this.topicRepository.count({
      where: {
        subject: { id: subjectId },
      },
      relations: ['completedBy'],
    });

    console.log('Total Topics:', totalTopics);
    console.log('Completed Topics:', completedTopics);

    if (totalTopics === 0) {
      return 0;
    }

    return (completedTopics / totalTopics) * 100;
  }

  async rankStudentsForSubject(subjectId: string): Promise<any[]> {
    const totalTopics = await this.topicRepository.count({
      where: { subject: { id: subjectId } },
    });

    if (totalTopics === 0) {
      throw new NotFoundException(
        `No topics found for subject with id ${subjectId}`,
      );
    }

    try {
      const rankings = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin(
          'user.completedTopics',
          'topic',
          'topic.subject.id = :subjectId',
          { subjectId },
        )
        .select('user.id', 'userId')
        .addSelect('user.name', 'userName')
        .addSelect(
          'CASE WHEN :totalTopics = 0 THEN 0 ELSE CAST(COUNT(DISTINCT topic.id) AS FLOAT) / :totalTopics * 100 END',
          'completion_rate',
        )
        .where('user.role = :role', { role: 'student' })
        .setParameter('totalTopics', totalTopics)
        .groupBy('user.id')
        .addGroupBy('user.name')
        .orderBy('completion_rate', 'DESC')
        .getRawMany();

      return rankings.map((r) => ({
        student: {
          id: r.userId,
          name: r.userName,
        },
        completionRate: parseFloat(r.completion_rate) || 0,
      }));
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }
}
