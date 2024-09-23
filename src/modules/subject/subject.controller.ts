import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
    Param,
    Delete,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { IServiceResponse } from 'src/interfaces/http-response.interface';
 import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from 'src/common/dtos/subject.dto';
  
  @ApiTags('subject')
  @Controller('subject')
  export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}
  

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: 'Create a new subject' })
    @ApiResponse({ status: 201, description: 'Subject successfully added' })
    @ApiResponse({ status: 400, description: 'Bad Request' }) 
    async createSubject(@Body() data: CreateSubjectDto): Promise<IServiceResponse> {
      return this.subjectService.createSubject(data);
    }

    @Get('all')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all subjects' })
    @ApiResponse({ status: 200, description: 'Subjects successfully retrieved' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getSubjects(): Promise<IServiceResponse> {
      return this.subjectService.getSubjects();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get a subject' })
    @ApiResponse({ status: 200, description: 'Subject successfully retrieved' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getSubject(@Param('id') id: string): Promise<IServiceResponse> {
      return this.subjectService.getSubject(id);
    } 

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: 'Delete a subject' })
    @ApiResponse({ status: 200, description: 'Subject successfully deleted' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async deleteSubject(@Param('id') id: string): Promise<IServiceResponse> {
      return this.subjectService.deleteSubject(id);
    }
  }
  