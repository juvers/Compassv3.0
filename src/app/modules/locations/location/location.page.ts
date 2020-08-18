import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AGENDA_OPTIONS } from '@config/agenda.config';
import { LOCATION_OPTIONS } from '@config/locations.config';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { AgendaEvent } from '@state/agenda-event/agenda-event.model';
import { AgendaEventService } from '@state/agenda-event/agenda-event.service';
import { SeiLocation } from '@state/location/location.model';
import { LocationService } from '@state/location/location.service';
import { Post } from '@state/post/post.model';
import { PostService } from '@state/post/post.service';
import { UserService } from '@state/user/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { distinctUntilChanged, flatMap, map, skipWhile, tap } from 'rxjs/operators';

@Component({
    selector: 'sei-location',
    templateUrl: './location.page.html',
    styleUrls: ['./location.page.scss']
})
export class LocationPage implements OnDestroy, OnInit {
    events$: Observable<AgendaEvent[]>;
    location$: Observable<SeiLocation>;
    posts$: Observable<Post[]>;
    agendaOptions = AGENDA_OPTIONS;
    locationId: number;
    locationOptions = LOCATION_OPTIONS;
    rateForm: FormGroup = new FormGroup({
        rate: new FormControl('')
    });
    currentUser$ = this.userService.currentUser$;

    constructor(
        private agendaEventService: AgendaEventService,
        private routerQuery: RouterQuery,
        private locationService: LocationService,
        private postService: PostService,
        private userService: UserService
    ) {}

    ngOnDestroy() {}

    ngOnInit() {
        this.routerQuery
            .selectParams<string>('id')
            .pipe(distinctUntilChanged())
            .pipe(skipWhile(id => !id))
            .pipe(untilDestroyed(this))
            .pipe(
                flatMap(id => {
                    if (id) {
                        this.locationId = parseInt(`${id}`, 10);
                        return this.postService.loadLocationPosts(this.locationId);
                    }
                }),
                flatMap(() => {
                    this.location$ = this.locationService.select(this.locationId);
                    this.posts$ = this.postService.items$.pipe(
                        map(items => items.filter(item => item.location === this.locationId))
                    );
                    this.events$ = this.agendaEventService.items$.pipe(
                        map(items => items.filter(item => item.location_id === this.locationId))
                    );

                    return this.location$;
                })
            )
            .subscribe(location => {
                this.rateForm.controls.rate.setValue(location?.rating, { emitEvent: false });
                this.rateForm.controls.rate.valueChanges
                    .pipe(distinctUntilChanged())
                    .pipe(untilDestroyed(this))
                    .subscribe(rating => {
                        this.changeRating(rating);
                    });
            });
    }

    changeRating(rating) {
        this.locationService.saveRating(this.locationId, rating);
    }
}
