import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    video: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    subjectId: string;
    }