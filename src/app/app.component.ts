import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '@core/login/login.component';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { PushService } from '@services/push/push.service';
import { AgendaEventService } from '@state/agenda-event/agenda-event.service';
import { EventPaxService } from '@state/event-pax/event-pax.service';
import { FollowService } from '@state/follow/follow.service';
import { UserService } from '@state/user/user.service';
import { ModalLauncherOptions } from 'ion-modal-launcher';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, flatMap, map, skipWhile } from 'rxjs/operators';
import { LocationService } from './state/location/location.service';
import { ParticipantPhotoService } from './state/participant-photo/participant-photo.service';
import { ParticipantService } from './state/participant/participant.service';
import { Storage } from '@ionic/storage';
import { persistState, PersistStateParams } from '@datorama/akita';
import { User } from '@state/user/user.model';
import { PostService } from '@state/post/post.service';
import { EditPostComponent } from '@shared/components/posts/edit-post/edit-post.component';

@Component({
    selector: 'sei-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
    modalObservables: Observable<ModalLauncherOptions>[];
    isAuthenticated: boolean;
    location: any;

    constructor(
        private agendaEventService: AgendaEventService,
        private authenticationService: AuthenticationService,
        private eventPaxService: EventPaxService,
        private followService: FollowService,
        private locationService: LocationService,
        private platform: Platform,
        private participant: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private postService: PostService,
        private push: PushService,
        private router: Router,
        private storage: Storage,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private userService: UserService
    ) {
        this.initializeStatePersistency();
        this.initializeApp();
    }

    ngAfterViewInit() {
        this.platform.ready().then(() => setTimeout(() => this.splashScreen.hide(), 1000));
    }

    ngOnDestroy() {}

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();

            this.userService.isLoggedIn$
                .pipe(
                    debounceTime(300),
                    distinctUntilChanged(),
                    skipWhile(isLoggedIn => !isLoggedIn),
                    flatMap(isLoggedIn => {
                        this.isAuthenticated = isLoggedIn;

                        return this.participant
                            .load()
                            .pipe(flatMap(() => this.participantPhotoService.load()))
                            .pipe(flatMap(() => this.locationService.load()))
                            .pipe(flatMap(() => this.agendaEventService.load()))
                            .pipe(flatMap(() => this.eventPaxService.load()))
                            .pipe(
                                flatMap(() =>
                                    this.userService.currentUserId$.pipe(flatMap(id => this.followService.load(id)))
                                )
                            )
                            .pipe(flatMap(() => this.push.register()))
                            .pipe(first());
                    })
                )
                .pipe(untilDestroyed(this))
                .subscribe();

            this.push.onMessageReceived().subscribe(message => {
                console.log(`Notification: ${JSON.stringify(message)}`);
            });
        });

        const loginModalObservable = this.authenticationService.accessDenied.pipe(
            map(next => {
                const url = next?.pathFromRoot?.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
                return {
                    modalOptions: {
                        component: LoginComponent
                    },
                    callback: details => {
                        if (details?.data?.authenticated && url) {
                            this.router.navigate([url]);
                        }
                    }
                };
            })
        );

        this.modalObservables = [loginModalObservable];
    }
    // async postDetails(isEdit = false) {
    //     const modal = await this.modalController.create({
    //         component: EditPostComponent,
    //         componentProps: {
    //             post: Object.assign({}, this.post),
    //             isEdit
    //         }
    //     });
    //     return await modal.present();
    // }
    initializeStatePersistency() {
        const params: Partial<PersistStateParams> = {
            include: ['user'],
            deserialize: data => {
                const state = JSON.parse(data);
                if (state?.user) {
                    state.user.user = new User(state?.user?.token);
                }
                return state;
            }
        };
        if (this.platform.is('cordova')) {
            params.storage = {
                clear: () => this.storage.clear(),
                getItem: key => this.storage.get(key),
                setItem: (key, value) => this.storage.set(key, value)
            };
        }
        persistState(params);
    }
}
