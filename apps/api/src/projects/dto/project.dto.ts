import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Website' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Main production website tracking' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['production', 'development'] })
  @IsEnum(['production', 'development'])
  @IsOptional()
  environment?: 'production' | 'development';
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
