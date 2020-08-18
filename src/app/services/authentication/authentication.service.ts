import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { SETTINGS } from '@config/settings';
import { SettingsService } from '@services/settings/settings.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private accessDeniedSubject = new Subject<ActivatedRouteSnapshot>();
    readonly accessDenied = this.accessDeniedSubject.asObservable();

    constructor(private http: HttpClient, private settings: SettingsService) {}

    denyAccess(next?: ActivatedRouteSnapshot) {
        this.accessDeniedSubject.next(next);
    }

    forgotLogin(emailforgot: string) {
        return this.http
            .get<string>(this.settings.environment.forgotPasswordApi, {
                params: { program_id: SETTINGS.programId, email: emailforgot }
            })
            .pipe(map(response => response === 'success'));
    }
}
