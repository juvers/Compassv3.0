import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'sei-help-location',
    templateUrl: './help-location.component.html',
    styleUrls: ['./help-location.component.scss']
})
export class HelpLocationComponent implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    close() {
        this.modalController.dismiss();
    }
}
