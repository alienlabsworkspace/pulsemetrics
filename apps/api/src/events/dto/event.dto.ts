import { IsString, IsOptional, IsObject, MaxLength, ValidateNested, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IngestEventDto {
  @ApiProperty({ example: 'page_view' })
  @IsString()
  @MaxLength(255)
  event: string;

  @ApiPropertyOptional({ example: 'user_abc123' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ example: 'sess_xyz789' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({ example: '/pricing' })
  @IsString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsString()
  @IsOptional()
  referrer?: string;

  @ApiPropertyOptional({ example: { button: 'cta-hero', variant: 'A' } })
  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;
}

export class IngestBatchDto {
  @ApiProperty({ type: [IngestEventDto] })
  @ValidateNested({ each: true })
  @Type(() => IngestEventDto)
  @ArrayMaxSize(100)
  events: IngestEventDto[];
}
