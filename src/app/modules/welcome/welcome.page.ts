import { Component } from '@angular/core';
import { WELCOME_PAGE_CONFIG } from '@config/welcome-page.config';
import { IonSlidesHelperService } from '@services/ion-slides-helper/ion-slides-helper.service';
import { IWelcomePageItem } from './welcome.config.interface';

@Component({
    selector: 'sei-welcome',
    templateUrl: 'welcome.page.html',
    styleUrls: ['welcome.page.scss']
})
export class WelcomePage {
    slideOptions = this.ionSlidesHelper.getOptions({ effect: 'fade', speed: this.config.speed, allowTouchMove: false });
    testObject = { key1: 'value1', key2: 'value2' };

    get config() {
        return WELCOME_PAGE_CONFIG;
    }

    constructor(private ionSlidesHelper: IonSlidesHelperService) {}

    getItemClasses(item: IWelcomePageItem) {
        return [...(this.config.classes || []), ...(item.classes || [])];
    }
    getItemStyles(item: IWelcomePageItem) {
        return Object.assign({}, this.config.style, item.style);
    }
}
