import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UserQuery } from './user.query';
import { UserStore } from './user.store';
import { User } from './user.model';
import { ILoginRequest, ILoginResponse } from '@services/authentication/authentication.service.interfaces';
import { ApiService } from '@services/api/api.service';
import { tap, map } from 'rxjs/operators';
import { AlertService } from '@services/alert/alert.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(
        private alert: AlertService,
        private apiService: ApiService,
        private query: UserQuery,
        private store: UserStore
    ) {}

    current$ = this.query.select();
    currentUser$ = this.current$.pipe(map(current => current?.user));
    currentUserId$ = this.currentUser$.pipe(map(user => user?._id));
    isLoggedIn$ = this.current$.pipe(map(current => !!current?.user));

    login(params: ILoginRequest) {
        return this.apiService.post<ILoginResponse>('auth/login', params).pipe(
            tap(response => {
                if (response.token) {
                    this.store.update(() => {
                        return {
                            token: response.token,
                            user: new User(response.token)
                        };
                    });
                }
            })
        );
    }

    logout() {
        const clear = () => {
            this.alert.show(
                {
                    message: 'Successfuly logged out'
                },
                3000
            );
            this.store.update(() => {
                return {
                    token: null,
                    user: null
                };
            });
        };
        return this.apiService
            .get<string>('auth/logout', { isTextResponse: true })
            .pipe(map(result => result === 'OK'))
            .pipe(
                tap(
                    () => clear(),
                    () => clear()
                )
            );
    }
}
