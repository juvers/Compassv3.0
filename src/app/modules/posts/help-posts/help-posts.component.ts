import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'sei-help-posts',
    templateUrl: './help-posts.component.html',
    styleUrls: ['./help-posts.component.scss']
})
export class HelpPostsComponent implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    close() {
        this.modalController.dismiss();
    }
}
