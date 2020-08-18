import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { ErrorHandlingService } from '@services/error-handling/error-handling.service';
import { SettingsService } from '@services/settings/settings.service';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { UserService } from '@state/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class ResponseInterceptor implements HttpInterceptor {
    constructor(
        private authentication: AuthenticationService,
        private settings: SettingsService,
        private errorHandling: ErrorHandlingService,
        private router: Router,
        private userService: UserService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(
                tap(() => {
                    this.settings.internetConnected = true;
                })
            )
            .pipe(
                catchError((response: any) => {
                    console.log(response);
                    if (response instanceof HttpErrorResponse) {
                        if (response && response.status === 401) {
                            if (!this.errorHandling.shouldIgnoreError(response)) {
                                return this.userService
                                    .logout()
                                    .pipe(
                                        tap(
                                            () =>
                                                this.router
                                                    .navigate(['/'])
                                                    .then(() => this.authentication.denyAccess()),
                                            () => this.router.navigate(['/'])
                                        )
                                    )
                                    .pipe(flatMap(() => throwError(response)));
                            } else {
                                return throwError(response);
                            }
                        } else {
                            this.settings.internetConnected = false;
                            this.errorHandling.handleHttpError(response);
                            return throwError(response);
                        }
                    } else {
                        return throwError(response);
                    }
                })
            );
    }
}
