import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AllowedRoles } from "./auth.role.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector,
  ) {}
  
  canActivate(context: ExecutionContext) {
    
    const role = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!role) return true;
    else if(role === 'Any') return true
    
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    if (user.role !== role) return false
    return true;
  }
}
