import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  HttpCode,
  UseGuards,
  HttpStatus,
  Get,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TopicService } from './topic.service';
import { CreateTopicDto } from 'src/common/dtos/topic.dto';
import { IServiceResponse } from 'src/interfaces/http-response.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guards/role.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('topic')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post(':subjectId/create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic successfully added' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseInterceptors(FileInterceptor('video'))
  async createTopic(
    @Param('subjectId') subjectId: string,
    @Body() createTopicDto: CreateTopicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.topicService.createTopic(file, createTopicDto, subjectId);
  }

  @Get(':subjectId/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get topics in a subject' })
  @ApiResponse({ status: 201, description: 'Topics successfully retrieved' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getTopicsBySubject(@Param('subjectId') subjectId: string) {
    return this.topicService.getTopicsBySubject(subjectId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a topic' })
  @ApiResponse({ status: 200, description: 'Topic successfully retrieved' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getTopic(@Param('id') id: string): Promise<IServiceResponse> {
    return this.topicService.getTopic(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiResponse({ status: 200, description: 'Topic successfully deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteTopic(@Param('id') id: string): Promise<IServiceResponse> {
    return this.topicService.deleteTopic(id);
  }

  @Patch(':topicId/completed')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mark topic as completed' })
  @ApiResponse({
    status: 200,
    description: 'Topic marked as completed successfully',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async markTopicAsCompleted(
    @Param('topicId') topicId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.topicService.markTopicAsCompleted(topicId, userId);
  }

  @Get(':subjectId/rankings')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Rank students for a subject' })
  @ApiResponse({ status: 200, description: 'Students ranked successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async rankStudentsForSubject(@Param('subjectId') subjectId: string) {
    const rankings = await this.topicService.rankStudentsForSubject(subjectId);
    return {
      message: 'Students ranked successfully',
      data: rankings,
    };
  }
}
