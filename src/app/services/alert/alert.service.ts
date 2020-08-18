import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core/dist/types/interface';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    constructor(private alertController: AlertController) {}

    async show(options: AlertOptions, timeout?: number) {
        const alert = await this.alertController.create(options);
        await alert.present();

        if (timeout) {
            setTimeout(() => alert.dismiss(), timeout);
        }
    }
}
