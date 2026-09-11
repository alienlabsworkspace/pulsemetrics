import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import Redis from 'ioredis';
import { CACHE_TTL } from '@pulsemetrics/shared';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('Missing API key');
    }

    // Check Redis cache first
    const cached = await this.redis.get(`apikey:${apiKey.substring(0, 12)}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      request.projectId = parsed.projectId;
      request.environment = parsed.environment;
      return true;
    }

    // Validate against database
    const result = await this.apiKeysService.validateKey(apiKey);
    if (!result) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Cache the result
    await this.redis.setex(
      `apikey:${apiKey.substring(0, 12)}`,
      CACHE_TTL.API_KEY,
      JSON.stringify(result),
    );

    request.projectId = result.projectId;
    request.environment = result.environment;
    return true;
  }

  private extractApiKey(request: any): string | undefined {
    // Check header first
    const headerKey = request.headers['x-api-key'];
    if (headerKey) return headerKey;

    // Check query param
    const queryKey = request.query?.key;
    if (queryKey) return queryKey;

    return undefined;
  }
}
