import { Injector, OnInit } from '@angular/core';
import { ActionSheetButton } from '@ionic/core';
import { first, tap } from 'rxjs/operators';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostComponentBase } from './post-component-base.class';

// This class is an intermediate base class for read-only components, so they can have the link to EditPostComponent
// without causing circular dependency and not needing to repeat a lot of code from PostComponentBase at EditPostComponent.
export class PostComponentReadonlyBase extends PostComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
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
    showOptions() {
        this.isPostFromCurrentUser$
            .pipe(
                tap(async isPostFromCurrentUser => {
                    const buttons: ActionSheetButton[] = [];
                    if (isPostFromCurrentUser) {
                        buttons.push(
                            {
                                text: 'Delete',
                                role: 'destructive',
                                icon: 'md-trash',
                                handler: async () => {
                                    const alert = await this.alertController.create({
                                        header: 'Deleting post',
                                        message: 'Are you sure you want to delete this post?',
                                        buttons: [
                                            {
                                                text: 'Cancel',
                                                role: 'cancel'
                                            },
                                            {
                                                text: 'Ok',
                                                handler: () => {
                                                    this.postService
                                                        .remove(this.post)
                                                        .pipe(first())
                                                        .subscribe();
                                                }
                                            }
                                        ]
                                    });

                                    await alert.present();
                                    return true;
                                }
                            },
                            {
                                text: 'Edit post',
                                icon: 'md-create',
                                handler: () => {
                                    this.postDetails(true);
                                }
                            }
                        );
                    } else {
                        buttons.push({
                            text: 'Hide this post',
                            role: 'destructive',
                            icon: 'md-remove-circle-outline',
                            handler: async () => {
                                const alert = await this.alertController.create({
                                    header: 'Hiding post',
                                    message: 'Are you sure you want to hide this post?',
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            role: 'cancel'
                                        },
                                        {
                                            text: 'Ok',
                                            handler: () => {
                                                this.postService
                                                    .hide(this.post)
                                                    .pipe(first())
                                                    .subscribe();
                                            }
                                        }
                                    ]
                                });

                                await alert.present();
                                return true;
                            }
                        });
                    }

                    buttons.push({
                        text: 'Cancel',
                        icon: 'md-close',
                        role: 'cancel'
                    });

                    const actionSheet = await this.actionSheetController.create({ buttons });
                    await actionSheet.present();
                })
            )
            .pipe(first())
            .subscribe();
    }
}
