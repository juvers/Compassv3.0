import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { UserService } from '@state/user/user.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.userService.current$.pipe(
            flatMap(state => {
                if (state?.token) {
                    request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${state.token}`) });
                }
                return next.handle(request);
            })
        );
    }
}
