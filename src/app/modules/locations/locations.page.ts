import { Component, OnInit } from '@angular/core';
import { LOCATION_OPTIONS } from '@config/locations.config';
import { LocationService } from '@state/location/location.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelpLocationComponent } from './help-location/help-location.component';

@Component({
    selector: 'sei-locations',
    templateUrl: './locations.page.html',
    styleUrls: ['./locations.page.scss']
})
export class LocationsPage implements OnInit {
    locations$ = this.locationService.items$;
    locationOptions = LOCATION_OPTIONS;
    showFilters = false;

    constructor(
        private locationService: LocationService,
        private router: Router,
        private modalController: ModalController
    ) {}

    ngOnInit() {}

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpLocationComponent
        });
        modal.present();
    }
}
