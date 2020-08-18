import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { IGNORE_HTTP_ERRORS } from '@constants/ignore-http-errors.constants';
import { ApiService } from '@services/api/api.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {
    constructor(
        private alertController: AlertController,
        private api: ApiService,
        private appVersion: AppVersion,
        private device: Device,
        private platform: Platform
    ) {}

    async handleHttpError(error: HttpErrorResponse) {
        if (this.shouldIgnoreError(error)) {
            return;
        }

        const errorText = !environment.production ? `<p>${JSON.stringify(error)}<p>` : '';
        let alertText: string;

        if (this.platform.is('cordova')) {
            const version = await this.appVersion.getVersionNumber();
            alertText = `
                <p> In the event there is a problem with this application, the information below may be helpful to our support team. </p>
                <p>
                    Compass Version: ${version}
                </p>
                <p>
                    Platform: ${this.device.platform}<br>
                    Version: ${this.device.version}<br>
                    Model: ${this.device.model}<br>
                    Cordova: ${this.device.cordova}<br>
                </p>
                ${errorText}
            `;
        } else {
            alertText = errorText;
        }
        const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'An error has occurred, please check your Internet connection.',
            message: alertText,
            buttons: ['OK']
        });

        await alert.present();
    }

    shouldIgnoreError(response: HttpErrorResponse) {
        let url = response.url.replace(this.api.root, '');
        url = url.endsWith('/') ? url.slice(0, -1) : url;
        url = url.startsWith('/') ? url.slice(1) : url;
        const ignore = IGNORE_HTTP_ERRORS[url];
        return ignore === true || (ignore && ignore[url] ? ignore[url][JSON.stringify(response?.error)] : false);
    }
}
