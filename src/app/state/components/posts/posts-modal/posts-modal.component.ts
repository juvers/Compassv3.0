import { Component, OnInit, Input } from '@angular/core';
import { Post } from '@state/post/post.model';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'sei-posts-modal',
    templateUrl: './posts-modal.component.html',
    styleUrls: ['./posts-modal.component.scss']
})
export class PostsModalComponent implements OnInit {
    @Input() posts: Post[];
    constructor(private modalController: ModalController) {}

    ngOnInit() {}
    close() {
        this.modalController.dismiss();
    }
}
