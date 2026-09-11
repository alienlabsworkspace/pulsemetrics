import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'acme-corp' })
  @IsString()
  @IsOptional()
  slug?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(255)
  name?: string;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ enum: ['admin', 'member', 'viewer'] })
  @IsEnum(['admin', 'member', 'viewer'])
  role: 'admin' | 'member' | 'viewer';
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: ['admin', 'member', 'viewer'] })
  @IsEnum(['admin', 'member', 'viewer'])
  role: 'admin' | 'member' | 'viewer';
}
