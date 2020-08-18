import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SETTINGS } from '@config/settings';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { ParticipantListComponent } from '@shared/components/participant-list/participant-list.component';
import { PostsModalComponent } from '@shared/components/posts/posts-modal/posts-modal.component';
import { Follow } from '@state/follow/follow.model';
import { FollowService } from '@state/follow/follow.service';
import { FollowingParticipant } from '@state/following-participant/following-participant.model';
import { FollowingParticipantService } from '@state/following-participant/following-participant.service';
import { UserService } from '@state/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { distinctUntilChanged, first, flatMap, map, skipWhile } from 'rxjs/operators';
import { Participant, ParticipantPartial } from 'src/app/state/participant/participant.model';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { Post } from 'src/app/state/post/post.model';
import { PostService } from 'src/app/state/post/post.service';
import { HelpAgendaComponent } from '@modules/agenda/help-agenda/help-agenda.component';

@Component({
    selector: 'sei-attendee',
    templateUrl: './attendee.page.html',
    styleUrls: ['./attendee.page.scss']
})
export class AttendeePage implements OnDestroy, OnInit {
    participant$: Observable<Participant>;
    posts$: Observable<Post[]>;
    following$: Observable<Follow[]>;
    followers$: Observable<FollowingParticipant[]>;
    isCurrentUser$: Observable<boolean>;
    isFollowingUser$: Observable<boolean>;
    attendeeId: number;
    showContact$: Observable<boolean>;

    get waveLabel() {
        return SETTINGS.verbiageProgramWave;
    }

    get waveToCountAsAllWaves() {
        return SETTINGS.waveToCountAsAllWaves;
    }

    constructor(
        private bottomSheet: MatBottomSheet,
        private followService: FollowService,
        private followParticipantService: FollowingParticipantService,
        private inAppBrowser: InAppBrowser,
        private modalController: ModalController,
        private participantService: ParticipantService,
        private platform: Platform,
        private postService: PostService,
        private routerQuery: RouterQuery,
        private userService: UserService
    ) {}

    ngOnDestroy() {}
    ngOnInit() {
        this.routerQuery
            .selectParams<string>('attendeeId')
            .pipe(distinctUntilChanged())
            .pipe(skipWhile(id => !id))
            .pipe(
                map(attendeeId => {
                    if (attendeeId) {
                        const id = parseInt(`${attendeeId}`, 10);
                        this.attendeeId = id;
                        this.followService
                            .load(id)
                            .pipe(first())
                            .subscribe();
                        this.followParticipantService
                            .load(id)
                            .pipe(first())
                            .subscribe();
                        return id;
                    } else {
                        return null;
                    }
                })
            )
            .pipe(untilDestroyed(this))
            .subscribe(id => {
                if (id) {
                    this.posts$ = this.postService.items$.pipe(
                        map(posts => posts.filter(p => p.participant?._id === id))
                    );
                    this.postService.loadParticipantPosts(id).subscribe();
                    this.participant$ = this.participantService.items$.pipe(map(list => list.find(i => i._id === id)));
                    this.followers$ = this.followParticipantService.select(id).pipe(map(i => i?.followers));
                    this.following$ = this.followService.select(id).pipe(map(list => list?.follow));
                    this.isFollowingUser$ = this.userService.currentUserId$.pipe(
                        flatMap(userId =>
                            this.followService
                                .select(userId)
                                .pipe(map(i => i?.follow))
                                .pipe(map(list => list?.some(i => i.participantFollow === id)))
                        )
                    );
                    this.isCurrentUser$ = this.userService.currentUserId$.pipe(
                        map(currentUserId => currentUserId === id)
                    );
                    this.showContact$ = this.userService.currentUser$.pipe(map(user => user.roles.operations));
                }
            });
    }

    follow() {
        this.followService
            .follow(this.attendeeId)
            .pipe(first())
            .subscribe();
    }

    loadExternalBrowserTel(value: string) {
        if (this.platform.is('cordova')) {
            this.inAppBrowser.create('tel:' + value, '_system');
        } else {
            window.open('tel:' + value, '_system', 'location=yes');
        }
    }
    loadExternalBrowserEmail(value: string) {
        if (this.platform.is('cordova')) {
            this.inAppBrowser.create('mailto:' + value, '_system');
        } else {
            window.open('mailto:' + value, '_system', 'location=yes');
        }
    }

    openFollowing() {
        this.following$
            .pipe(map(list => list?.map(i => i.participantFollow)))
            .pipe(flatMap(ids => this.participantService.query.selectMany(ids)))
            .pipe(first())
            .subscribe(participants => this.openList('Following', participants));
    }

    openFollowers() {
        this.followers$
            .pipe(map(list => list?.map(i => i.participant)))
            .pipe(flatMap(ids => this.participantService.query.selectMany(ids)))
            .pipe(first())
            .subscribe(participants => this.openList('Followers', participants));
    }

    openPosts() {
        this.posts$.pipe(first()).subscribe(async posts => {
            const modal = await this.modalController.create({
                component: PostsModalComponent,
                componentProps: { posts }
            });
            await modal.present();
        });
    }

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpAgendaComponent
        });
        modal.present();
    }

    private async openList(title: string, participants: ParticipantPartial[]) {
        this.bottomSheet.open(ParticipantListComponent, {
            data: { participants, title }
        });
    }
}
