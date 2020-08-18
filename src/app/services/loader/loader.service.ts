import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core/dist/types/interface';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    constructor(private loadingController: LoadingController) {}

    /**
     * This starts a loading spinner.
     * @param options - LoadingOptions from ion-loading, more information at https://ionicframework.com/docs/api/loading
     */
    async show(options: LoadingOptions = {}) {
        if (!options.message) {
            options.message = 'Loading...';
        }
        if (!options.spinner) {
            options.spinner = null;
        }
        const loading = await this.loadingController.create(options);
        await loading.present();
    }

    /**
     * Hides all ion-loading instances
     */
    async hide() {
        const topLayer = await this.loadingController.getTop();
        if (topLayer) {
            await topLayer.dismiss();
            setTimeout(() => {
                this.hide();
            }, 500);
        }
    }
    hideLoading() {
        this.loadingController.dismiss();
    }
}
