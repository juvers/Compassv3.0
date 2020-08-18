import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'sei-help-attendee',
    templateUrl: './help-attendee.component.html',
    styleUrls: ['./help-attendee.component.scss']
})
export class HelpAttendeeComponent implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    close() {
        this.modalController.dismiss();
    }
}
