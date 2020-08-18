import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SETTINGS } from '@config/settings';
import { User } from '@state/user/user.model';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { IMenuItem } from './menu-item.interface';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { UserService } from '@state/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

export class MenuComponentBase implements OnDestroy, OnInit {
    isAuthenticated$ = this.userService.isLoggedIn$;
    currentUser$ = this.userService.currentUser$;
    currentUser: User;

    photos$ = this.userService.currentUserId$
        .pipe(flatMap(id => this.participantPhotoService.select(id)))
        .pipe(map(p => (p ? [p.participantPhotoThumbnail, p.participantPhotoOptimized, p.participantPhoto] : [])));

    get disableLeaderboard() {
        return SETTINGS.disableLeaderboard;
    }

    get disableDigitalBadge() {
        return SETTINGS.disableDigitalBadge;
    }

    get headerImage() {
        return SETTINGS.headerImage;
    }

    get useFloatingBadges() {
        return SETTINGS.useFloatingBadges;
    }

    get verbiageProgramWave() {
        return SETTINGS.verbiageProgramWave;
    }
    constructor(
        protected authentication: AuthenticationService,
        protected participantPhotoService: ParticipantPhotoService,
        protected router: Router,
        protected userService: UserService
    ) {}

    ngOnInit() {
        this.currentUser$.pipe(untilDestroyed(this)).subscribe(currentUser => (this.currentUser = currentUser));
    }

    ngOnDestroy() {}

    clickItem(item: IMenuItem) {
        setTimeout(() => {
            if (item.action) {
                // wrapped in a timeout to allow the menu animation to happen before starting any modal animations,
                //  if delay is undefined it will execute the action right away.
                item.action();
            } else if (item.route) {
                this.router.navigate(item.route);
            }
        }, item.delay);
    }

    getBadge(item: IMenuItem, floating?: boolean) {
        if (!item.badge || (floating && !this.useFloatingBadges)) {
            return null;
        } else {
            return item.badge.pipe(
                map(badge => {
                    return `${badge}`.trim() !== '0' ? badge : '';
                })
            );
        }
    }

    getIconName(item: IMenuItem) {
        return item?.icon?.endsWith('.svg') ? null : item.icon;
    }
    getIconSrc(item: IMenuItem) {
        return item?.icon?.endsWith('.svg') ? item.icon : null;
    }

    isItemVisible(item: IMenuItem) {
        const visible = item.isVisible ? item.isVisible : of(true);
        if (item.showForAnonymous) {
            return visible;
        } else {
            return this.isAuthenticated$;
        }
    }
}
