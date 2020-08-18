import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { SETTINGS } from '@config/settings';
import { ModalController } from '@ionic/angular';
import { User } from '@state/user/user.model';
import { UserService } from '@state/user/user.service';
import { AkitaFiltersPlugin } from 'akita-filters-plugin';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable, of } from 'rxjs';
import { first, flatMap, map, tap } from 'rxjs/operators';
import { FollowService } from 'src/app/state/follow/follow.service';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { Post } from 'src/app/state/post/post.model';
import { PostService } from 'src/app/state/post/post.service';
import { PostState } from 'src/app/state/post/post.store';
import { EditPostComponent } from '../../shared/components/posts/edit-post/edit-post.component';
import { PostsModalComponent } from '@shared/components/posts/posts-modal/posts-modal.component';
import { HelpPostsComponent } from './help-posts/help-posts.component';

@Component({
    selector: 'sei-posts',
    templateUrl: './posts.page.html',
    styleUrls: ['./posts.page.scss']
})
export class PostsPage implements OnDestroy, OnInit {
    filter = new AkitaFiltersPlugin<PostState>(this.postService.query);
    waves$ = this.participantService.waves$;

    isAuthenticated$ = this.userService.isLoggedIn$;
    currentUser$ = this.userService.currentUser$;

    following$ = this.currentUser$
        .pipe(flatMap(user => combineLatest([this.posts$, this.followService.select(user?._id), of(user?._id)])))
        .pipe(
            map(([posts, followList, userId]) => {
                return posts.filter(
                    post =>
                        post?.participant?._id === userId ||
                        followList?.follow?.some(follow => follow?.participantFollow === post?.participant?._id)
                );
            })
        )
        .pipe(
            tap(posts => {
                if (posts?.length < 5 && !this.finishedLoading) {
                    this.loadMore();
                }
            })
        );
    finishedLoading: boolean;
    showOnlyFollowing: boolean;
    showFilters = false;

    filterForm = new FormGroup({
        wave: new FormControl('')
    });

    get waveLabel() {
        return SETTINGS.verbiageProgramWave;
    }
    posts$: Observable<Post[]>;
    photos$ = this.userService.currentUserId$
        .pipe(flatMap(id => this.participantPhotoService.select(id)))
        .pipe(map(p => (p ? [p.participantPhotoThumbnail, p.participantPhotoOptimized, p.participantPhoto] : [])));

    constructor(
        private followService: FollowService,
        private modalController: ModalController,
        private participantPhotoService: ParticipantPhotoService,
        private postService: PostService,
        private participantService: ParticipantService,
        private userService: UserService
    ) {}

    ngOnDestroy() {}
    ngOnInit() {
        this.postService
            .load()
            .pipe(first())
            .subscribe();

        const setPosts = () => {
            this.posts$ = this.filter
                .selectAllByFilters()
                .pipe(map(result => (Array.isArray(result) ? result : Object.values(result))));
        };

        this.currentUser$
            .pipe(first())
            .pipe(
                tap(
                    () => setPosts(),
                    () => setPosts()
                )
            )
            .pipe(flatMap(user => this.initializeFilters(user)))
            .pipe(untilDestroyed(this))
            .subscribe();

        this.postService.items$
            .pipe(
                flatMap(items => {
                    const distinct = (value: any, index: any, self: any) => {
                        return self.indexOf(value) === index;
                    };
                    return combineLatest(
                        items
                            .map(i => i?.participant?._id)
                            .filter(distinct)
                            .map(id => (id ? this.followService.load(id) : of(null)))
                    );
                })
            )
            .pipe(untilDestroyed(this))
            .subscribe();
    }

    initializeFilters(user: User) {
        this.filterForm.controls.wave.setValue(0);
        return combineLatest([this.filterForm.controls.wave.valueChanges, this.participantService.items$]).pipe(
            map(([wave, participants]) => {
                if (!wave) {
                    this.filter.removeFilter('wave');
                } else {
                    this.filter.setFilter({
                        id: 'wave',
                        value: wave,
                        predicate: (value, index, array) => {
                            const participant = participants?.find(p => p._id === value?.participant?._id);
                            return participant?.programWave === wave;
                        }
                    });
                }
            })
        );
    }

    loadMore(event?) {
        this.postService
            .load()
            .pipe(first())
            .subscribe(count => {
                if (count === 0) {
                    this.finishedLoading = true;
                    if (event) {
                        event.target.disabled = true;
                    }
                }
                if (event) {
                    event.target.complete();
                }
            });
    }

    async newPost() {
        const modal = await this.modalController.create({
            component: EditPostComponent,
            componentProps: { isEdit: true }
        });
        return await modal.present();
    }

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpPostsComponent
        });
        modal.present();
    }

    tabChanged($event: MatTabChangeEvent) {
        if ($event?.index === 0) {
            this.showOnlyFollowing = false;
        } else {
            this.showOnlyFollowing = true;
        }
    }
}
