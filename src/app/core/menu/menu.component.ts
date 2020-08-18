import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '@core/login/login.component';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { of } from 'rxjs';
import { first, map, flatMap } from 'rxjs/operators';
import { IMenuItem } from './menu-item.interface';
import { MenuComponentBase } from './menu.base.class';
import { SETTINGS } from '@config/settings';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { UserService } from '@state/user/user.service';
import { PostService } from '@state/post/post.service';

@Component({
    selector: 'sei-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends MenuComponentBase {
    // TODO: DELETE: define the following when developing features, those are just mock for example badges
    totalEvents$ = of('2');
    // totalChats$ = of(2);
    // totalNews$ = of(0);
    // totalPosts$ = of(0);
    totalNotifications = of(0);
    totalSpeakers$ = of(3);
    totalSponsors$ = of(0);

    menuItems: IMenuItem[] = [
        { icon: 'md-home', title: 'Welcome', route: ['/welcome'], showForAnonymous: true },
        {
            icon: 'md-briefcase',
            title: 'Getting Ready',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableGettingReady),
            showForAnonymous: true
        },
        {
            icon: 'ios-power',
            title: 'Login',
            action: () => this.login(),
            delay: 400,
            largeIcon: true,
            showForAnonymous: true,
            class: 'menu-login',
            isVisible: SETTINGS.disableLogin
                ? of(false)
                : this.isAuthenticated$.pipe(map(isAuthenticated => !isAuthenticated))
        },
        {
            icon: 'ios-megaphone',
            title: 'Alerts',
            route: ['/welcome'],
            // badge: this.totalNews$,
            isVisible: of(!SETTINGS.disableAlerts)
        },
        {
            icon: 'md-aperture',
            title: 'Activity Feed',
            route: ['/posts'],
            // badge: this.totalPosts$,
            isVisible: of(!SETTINGS.disableActivityFeed)
        },
        {
            icon: 'md-calendar',
            title: 'Agenda',
            route: ['/agenda'],
            badge: this.totalEvents$,
            isVisible: of(!SETTINGS.disableAgenda)
        },

        {
            icon: 'md-people',
            title: 'Attendees',
            route: ['/attendees'],
            isVisible: of(!SETTINGS.disableAttendees)
        },

        {
            icon: 'md-chatbubbles',
            title: 'Chat',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableChat)
            // badge: SETTINGS.showChatBadge || this.currentUser?.roles.operations ? this.totalChats$ : null
        },

        {
            icon: 'md-happy',
            title: 'Event Tickets',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableLocationsTickets)
        },

        {
            icon: 'md-calendar',
            title: 'Events',
            route: ['/welcome'],
            badge: this.totalEvents$,
            isVisible: this.currentUser$.pipe(map(user => !!user?._id_hide))
        },
        {
            icon: 'assets/icons/fork.svg',
            largeIcon: true,
            class: 'menu-gala',
            title: 'Gala',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableLocationsShuttles)
        },
        {
            icon: 'md-images',
            title: 'Galleries',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableGalleries)
        },
        {
            icon: 'md-pin',
            title: 'Locations',
            route: ['/locations'],
            // badge: this.totalLocations,
            isVisible: of(!SETTINGS.disableLocations)
        },

        {
            icon: 'md-map',
            title: 'Maps',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableLocationsMaps)
        },
        {
            icon: 'md-notifications',
            title: 'Notifications',
            route: ['/welcome'],
            badge: this.totalNotifications,
            isVisible: of(!SETTINGS.disableNotifications)
        },
        {
            icon: 'md-bus',
            title: 'Shuttles',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableLocationsShuttles)
        },
        {
            icon: 'md-images',
            title: 'Slideshow',
            route: ['/welcome'],
            isVisible: of(
                !SETTINGS.disableSlideshow && (SETTINGS.showSlideShowToAll || this.currentUser?.roles.operations)
            )
        },
        {
            icon: 'md-megaphone',
            title: 'Speakers',
            route: ['/welcome'],
            badge: this.totalSpeakers$,
            isVisible: of(!SETTINGS.disableSpeakers)
        },

        {
            icon: 'md-star',
            title: 'Sponsors',
            route: ['/welcome'],
            badge: this.totalSponsors$,
            isVisible: of(!SETTINGS.disableSponsors)
        },

        {
            icon: 'md-cloud',
            title: 'Weather',
            route: ['/welcome'],
            showForAnonymous: true,
            isVisible: of(!SETTINGS.disableWeather)
        },
        {
            icon: 'md-eye',
            title: 'Webcams',
            route: ['/welcome'],
            isVisible: of(!SETTINGS.disableLocationsWebcams)
        },
        {
            icon: 'md-call',
            title: 'Contact Us',
            route: ['/welcome'],
            showForAnonymous: true,
            isVisible: of(!SETTINGS.disableContactUs)
        },
        {
            icon: 'ios-power',
            title: 'Log Out',
            action: () => this.logout()
        }
    ];
    constructor(
        private modal: ModalController,
        private postService: PostService,
        participantPhotoService: ParticipantPhotoService,
        authentication: AuthenticationService,
        router: Router,
        userService: UserService
    ) {
        super(authentication, participantPhotoService, router, userService);
    }

    editProfile() {
        this.userService.currentUserId$.pipe(first()).subscribe(id => this.router.navigate(['/attendees', id, 'edit']));
    }
    async login() {
        const modal = await this.modal.create({
            component: LoginComponent
        });
        return await modal.present();
    }

    logout() {
        this.userService
            .logout()
            .pipe(first())
            .subscribe(
                () => this.router.navigate(['/']),
                () => this.router.navigate(['/'])
            );
    }
}
