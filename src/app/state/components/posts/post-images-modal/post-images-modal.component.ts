import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'sei-post-images-modal',
    templateUrl: './post-images-modal.component.html',
    styleUrls: ['./post-images-modal.component.scss']
})
export class PostImagesModalComponent implements OnInit {
    @Input() post: string[];

    constructor(private modalController: ModalController) {}

    ngOnInit() {}
    close() {
        this.modalController.dismiss();
    }
}
