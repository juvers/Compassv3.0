import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
    selector: 'sei-help-agenda',
    templateUrl: './help-agenda.component.html',
    styleUrls: ['./help-agenda.component.scss']
})
export class HelpAgendaComponent implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    close() {
        this.modalController.dismiss();
    }
}
