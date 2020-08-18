import { Component, Input, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ModalController } from '@ionic/angular';
import { PostImagesModalComponent } from '@shared/components/posts/post-images-modal/post-images-modal.component';
import { ImageService } from '@services/image/image.service';
import { Post } from 'src/app/state/post/post.model';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { POST_OPTIONS } from '@config/posts.config';

@Component({
    selector: 'sei-post-images',
    templateUrl: './post-images.component.html',
    styleUrls: ['./post-images.component.scss']
})
export class PostImagesComponent implements OnInit {
    private _post: Post;
    photos: string[];

    @Input() showSlider: boolean;
    @Input() isEdit: boolean;
    get post(): Post {
        return this._post;
    }
    @Input() set post(value: Post) {
        if (value.photos && value.photos.length > 0) {
            this.photos = [value?.photos[0], value?.photosOptimized[0], value?.photosThumbnail[0]];
        }
        this._post = value;
    }

    postImagesSlide = POST_OPTIONS.postImagesSlide;

    constructor(
        private imageService: ImageService,
        private modalController: ModalController,
        private photoViewer: PhotoViewer
    ) {}

    ngOnInit() {}

    download(photo: string) {
        this.imageService.download(photo);
    }
    async openModal() {
        if (POST_OPTIONS.usePopupImagePreview) {
            const modal = await this.modalController.create({
                component: PostImagesModalComponent,
                componentProps: {
                    post: this.post
                },
                cssClass: 'post-images-modal-css'
            });
            return await modal.present();
        } else {
            const modal = await this.modalController.create({
                component: EditPostComponent,
                componentProps: { post: this.post }
            });
            return await modal.present();
        }
    }

    openPreview(photo: string) {
        this.photoViewer.show(photo);
    }

    remove(photo: string) {
        this.post.photos = this.post.photos.filter(p => p !== photo);
    }
}
