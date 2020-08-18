import { Component, Injector } from '@angular/core';
import { ActionSheetButton } from '@ionic/core';
import { first, tap } from 'rxjs/operators';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { PostComponentBase } from '../post-component-base.class';
import { PostService } from '@state/post/post.service';
import { PostComponentReadonlyBase } from '../post-component-readonly.base.class';

@Component({
    selector: 'sei-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent extends PostComponentReadonlyBase {
    constructor(injector: Injector) {
        super(injector);
    }

    likeToggle() {
        this.postService
            .like(this.post)
            .pipe(first())
            .subscribe();
    }
    async postDetails(isEdit = false) {
        const modal = await this.modalController.create({
            component: EditPostComponent,
            componentProps: {
                post: Object.assign({}, this.post),
                isEdit
            }
        });
        return await modal.present();
    }
}
