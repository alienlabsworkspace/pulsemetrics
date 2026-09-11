import { IsString, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production Key' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ enum: ['production', 'development'], default: 'production' })
  @IsEnum(['production', 'development'])
  @IsOptional()
  environment?: 'production' | 'development';
}
