import { Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { POST_OPTIONS } from '@config/posts.config';
import { SETTINGS } from '@config/settings';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';
import { ParticipantListComponent } from '@shared/components/participant-list/participant-list.component';
import { UserService } from '@state/user/user.service';
import { EMPTY, forkJoin, ReplaySubject, Observable } from 'rxjs';
import { first, flatMap, map, tap } from 'rxjs/operators';
import { CommentService } from 'src/app/state/comment/comment.service';
import { FollowService } from 'src/app/state/follow/follow.service';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { ParticipantPartial } from 'src/app/state/participant/participant.model';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { Post } from 'src/app/state/post/post.model';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PostService } from '@state/post/post.service';
import { CommentModel } from '@state/comment/comment.model';

export class PostComponentBase implements OnDestroy, OnInit {
    private participantIdSubject = new ReplaySubject<number>(1);
    private _post: Post;

    protected actionSheetController = this.injector.get(ActionSheetController);
    protected alertController = this.injector.get(AlertController);
    protected bottomSheet = this.injector.get(MatBottomSheet);
    protected commentService = this.injector.get(CommentService);
    protected followService = this.injector.get(FollowService);
    protected modalController = this.injector.get(ModalController);
    protected participantPhotoService = this.injector.get(ParticipantPhotoService);
    protected participantService = this.injector.get(ParticipantService);
    protected postService = this.injector.get(PostService);
    protected router = this.injector.get(Router);
    protected userService = this.injector.get(UserService);

    participant$ = this.participantIdSubject.pipe(flatMap(id => this.participantService.select(id)));
    currentUser$ = this.userService.currentUser$;
    isPostFromCurrentUser$ = this.currentUser$.pipe(map(user => user._id === this.post?.participant?._id));

    participantPhotos$ = this.participantIdSubject
        .pipe(flatMap(id => this.participantPhotoService.select(id)))
        .pipe(map(p => (p ? [p.participantPhotoThumbnail, p.participantPhotoOptimized, p.participantPhoto] : [])));

    following$ = this.participantIdSubject.pipe(
        flatMap(id => {
            return this.followService.select(id).pipe(map(list => list?.follow?.some(follow => list._id === id)));
        })
    );
    comments$ = this.commentService.query.selectAll({ filterBy: comment => this.post?._id === comment?.postId });
    pulseAnimation: boolean;

    get post(): Post {
        return this._post;
    }
    @Input() set post(value: Post) {
        if (value) {
            let participantId: number;
            if (value.postFeatured && value.tags && value.tags[0]?._id) {
                participantId = value.tags[0]?._id;
            } else if (value.participant) {
                participantId = value.participant._id;
            }
            if (participantId) {
                this.participantIdSubject.next(participantId);
            }
            if (value.postFeatured && value.postTemplate === 3) {
                window.setInterval(() => {
                    this.pulseAnimation = !this.pulseAnimation;
                }, 2000);
            }
        }
        this._post = value;
    }

    get confettiOptions() {
        return POST_OPTIONS.confettiOptions;
    }

    get verbiageProgramWave() {
        return SETTINGS.verbiageProgramWave;
    }
    constructor(private injector: Injector) {}

    ngOnDestroy() {}
    ngOnInit() {}

    goToLocation(id: number) {
        if (!id) {
            return;
        }
        this.router.navigate(['/locations', id]);
    }

    goToParticipant(id: number) {
        if (!id) {
            return;
        }
        this.router.navigate(['/attendees', id]);
    }

    async showFollowingOptions() {
        const participantId = this.post?.participant?._id;
        const buttons = [
            {
                text: 'Unfollow',
                role: 'destructive',
                icon: 'md-remove-circle-outline',
                handler: () => {
                    this.followService
                        .follow(participantId)
                        .pipe(first())
                        .subscribe();
                }
            },
            {
                text: 'Go to person',
                icon: 'md-person',
                handler: () => {
                    this.router.navigate(['/attendees', participantId]);
                }
            }
        ];
        buttons.push({
            text: 'Followed by me',
            icon: 'md-people',
            handler: () => {
                this.currentUser$
                    .pipe(flatMap(currentUser => this.followService.select(currentUser._id)))
                    .pipe(map(list => list?.follow))
                    .pipe(
                        flatMap(follows =>
                            this.participantService.query.selectMany(follows.map(follow => follow.participantFollow))
                        )
                    )
                    .pipe(first())
                    .subscribe(participants => {
                        this.bottomSheet.open(ParticipantListComponent, {
                            data: { participants, title: 'Followed by me' }
                        });
                    });
            }
        });
        const actionSheet = await this.actionSheetController.create({ buttons });
        await actionSheet.present();
    }

    async openList(title: string, participants: ParticipantPartial[]) {
        this.bottomSheet.open(ParticipantListComponent, {
            data: { participants, title }
        });
    }
}
