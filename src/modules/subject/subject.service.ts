import {
  Injectable,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceResponse } from 'src/interfaces/http-response.interface';
import { CreateSubjectDto } from 'src/common/dtos/subject.dto';
import { Subject } from 'src/models/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(data: CreateSubjectDto): Promise<IServiceResponse> {
    const subject = await this.subjectRepository.findOne({
      where: {
        name: data.name,
      },
    });
    if (subject) {
      throw new BadRequestException('Subject already exists');
    }

    const newSubject = await this.subjectRepository.create({
      ...data,
    });

    await this.subjectRepository.save(newSubject);

    return {
      data: {
        subject: newSubject,
      },
    };
  }

  async getSubjects(): Promise<IServiceResponse> {
    const subjects = await this.subjectRepository.find();

    return {
      data: {
        subjects,
      },
    };
  }

  async getSubject(id: string): Promise<IServiceResponse> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['topics'],
    });

    if (!subject) {
      throw new BadRequestException('Subject not found');
    }

    return {
      data: {
        subject,
      },
    };
  }

  async deleteSubject(id: string): Promise<IServiceResponse> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
    });

    if (!subject) {
      throw new BadRequestException('Subject not found');
    }

    await this.subjectRepository.delete(id);

    return {
      data: {
        message: 'Subject deleted successfully',
      },
    };
  }
}
