import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { MemberRole } from '@pulsemetrics/shared';

const ROLE_HIERARCHY: Record<MemberRole, number> = {
  viewer: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.role) {
      throw new ForbiddenException('No role assigned');
    }

    const userLevel = ROLE_HIERARCHY[user.role as MemberRole] ?? -1;
    const requiredLevel = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 99));

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
