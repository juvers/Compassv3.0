import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiService } from '@services/api/api.service';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { ISubscribeRequest } from '@services/push/push.service.interfaces';
import { forkJoin, from, of, throwError } from 'rxjs';
import { catchError, flatMap, tap, first } from 'rxjs/operators';
import { UserService } from '@state/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class PushService {
    hasPermission: boolean;
    token: string;

    constructor(
        private api: ApiService,
        private appVersion: AppVersion,
        private device: Device,
        private firebase: FirebaseX,
        private platform: Platform,
        private storage: Storage,
        private userService: UserService
    ) {
        this.storage.get('deviceToken').then(token => (this.token = token));
    }

    private getToken() {
        if (this.platform.is('ios') || this.platform.is('android')) {
            return from(
                this.firebase
                    .hasPermission()
                    .then(hasPermission => {
                        this.hasPermission = hasPermission;
                        if (!hasPermission) {
                            return this.firebase.grantPermission().then(() => (this.hasPermission = true));
                        } else {
                            return true;
                        }
                    })
                    .then(() => this.firebase.getToken())
            ).pipe(
                catchError(error => {
                    console.error(error);
                    return throwError(error);
                })
            );
        } else {
            return of(null as string);
        }
    }
    onMessageReceived() {
        return this.firebase.onMessageReceived();
    }

    register() {
        if (this.platform.is('ios') || this.platform.is('android')) {
            return forkJoin([
                this.getToken(),
                this.appVersion.getVersionNumber(),
                this.userService.currentUserId$.pipe(first())
            ]).pipe(
                flatMap(([token, version, currentUserId]) => {
                    // save this server-side and use it to push notifications to this device
                    console.log('Token: ' + token);
                    // it is possible that the token is null, skip if so
                    if (token) {
                        this.token = token;

                        let type = 'unknown';
                        if (this.platform.is('android')) {
                            type = 'android';
                        } else if (this.platform.is('ios')) {
                            type = 'ios';
                        }

                        const params = {
                            token,
                            type,
                            participantid: currentUserId,
                            login_device_compass_version: version,
                            // login_device_platform: this.device.platform,
                            login_device_platform_version: this.device.version,
                            login_device_model: this.device.model
                        };
                        return this.subscribe(params)
                            .pipe(
                                tap(() =>
                                    console.log(
                                        `Subscribed to Push Notifications with user id: ${JSON.stringify(
                                            currentUserId
                                        )}`
                                    )
                                )
                            )
                            .pipe(
                                catchError(error => {
                                    console.log('Could not send to auth/subscribe params:' + params.token);
                                    setTimeout(() => {
                                        this.register();
                                    }, 30000);
                                    return of<void>(null);
                                })
                            );
                    } else {
                        console.log('Token was null');
                        return of<void>(null);
                    }
                })
            );
        } else {
            return of(null);
        }
    }

    subscribe(params: ISubscribeRequest) {
        return this.api
            .post<void>('auth/subscribe', params, { isTextResponse: true })
            .pipe(tap(() => this.storage.set('deviceToken', params?.token)));
    }
}
