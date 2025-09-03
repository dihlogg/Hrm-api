import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LeaveRequestFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const filterParticipants = (leaveRequest: any) => {
      if (!leaveRequest?.participantsRequests) return leaveRequest;

      // Nếu không phải CEO thì loại bỏ confirm
      if (!user.roles?.includes('CEO')) {
        leaveRequest.participantsRequests =
          leaveRequest.participantsRequests.filter(
            (p: any) => p.type !== 'confirmed',
          );
      }

      return leaveRequest;
    };

    const filterResponse = (data: any): any => {
      if (!data) return data;

      // Nếu có field data (pagination response)
      if (data.data && Array.isArray(data.data)) {
        data.data = data.data.map((lr) => filterParticipants(lr));
        return data;
      }

      // array leaveRequest
      if (Array.isArray(data)) {
        return data.map((lr) => filterParticipants(lr));
      }

      // single leaveRequest
      return filterParticipants(data);
    };

    return next.handle().pipe(map((data) => filterResponse(data)));
  }
}
