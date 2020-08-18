import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TIME_ZONE_TEXT } from '@constants/datetime.constants';
import { Order } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { AgendaEvent } from '@state/agenda-event/agenda-event.model';
import { AgendaEventService } from '@state/agenda-event/agenda-event.service';
import { EventPax } from '@state/event-pax/event-pax.model';
import { EventPaxService } from '@state/event-pax/event-pax.service';
import { SeiLocation } from '@state/location/location.model';
import { LocationService } from '@state/location/location.service';
import { Participant } from '@state/participant/participant.model';
import { ParticipantService } from '@state/participant/participant.service';
import { ParticipantState } from '@state/participant/participant.store';
import { ScanParticipant } from '@state/scan-participant/scan-participant.model';
import { ScanParticipantService } from '@state/scan-participant/scan-participant.service';
import { AkitaFiltersPlugin } from 'akita-filters-plugin';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, first, flatMap, map, skipWhile, tap } from 'rxjs/operators';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@Component({
    selector: 'sei-event',
    templateUrl: './event.page.html',
    styleUrls: ['./event.page.scss']
})
export class EventPage implements OnDestroy, OnInit {
    event$: Observable<AgendaEvent>;
    location$: Observable<SeiLocation>;
    pax$: Observable<EventPax[]>;
    paxParticipantsId$: Observable<number[]>;
    paxParticipantsIds$: Observable<number[]>;
    scanned$: Observable<ScanParticipant[]>;
    scannedParticipants$: Observable<Participant[]>;
    scannedParticipantsId$: Observable<number[]>;
    scannedParticipantsIds$: Observable<number[]>;

    timezone = TIME_ZONE_TEXT;
    eventId: number;

    rateForm: FormGroup = new FormGroup({
        rate: new FormControl('')
    });
    filterParticipantForm = new FormGroup({
        search: new FormControl('')
    });

    participantCount$ = this.participantService.count$;
    filter = new AkitaFiltersPlugin<ParticipantState>(this.participantService.query);
    participants$: Observable<Participant[]> = this.filter
        .selectAllByFilters()
        .pipe(map(result => (Array.isArray(result) ? result : Object.values(result))));

    constructor(
        private agendaEventService: AgendaEventService,
        private eventPaxService: EventPaxService,
        private locationService: LocationService,
        private launchNavigator: LaunchNavigator,
        private participantService: ParticipantService,
        private routerQuery: RouterQuery,
        private scanParticipantService: ScanParticipantService
    ) {}
    ngOnDestroy() {}

    ngOnInit() {
        this.routerQuery
            .selectParams<string>('id')
            .pipe(distinctUntilChanged())
            .pipe(skipWhile(id => !id))
            .pipe(
                flatMap(id => {
                    this.eventId = Number.parseInt(id, 10);
                    this.event$ = this.agendaEventService.select(this.eventId);
                    return this.scanParticipantService.read(this.eventId).pipe(first());
                }),
                flatMap(() => {
                    this.location$ = this.event$.pipe(
                        flatMap(event => this.locationService.query.selectEntity(event?.location_id))
                    );

                    this.scanned$ = this.scanParticipantService.items$.pipe(
                        map(items => items.filter(item => item.event_id === this.eventId))
                    );
                    this.scannedParticipantsIds$ = this.scanned$.pipe(
                        map(list => [...new Set(list.map(item => item.participant_id_scanned))])
                    );

                    this.pax$ = this.eventPaxService.items$.pipe(
                        map(list => list.filter(item => item?.event_id === this.eventId))
                    );

                    this.paxParticipantsIds$ = this.pax$.pipe(
                        map(list => [...new Set(list.map(item => item.participant_id))])
                    );

                    return combineLatest([this.paxParticipantsIds$, this.scannedParticipantsIds$])
                        .pipe(
                            map(([paxParticipantsIds, scannedParticipantsId]) => [
                                ...new Set(paxParticipantsIds.concat(scannedParticipantsId))
                            ])
                        )
                        .pipe(
                            tap(ids => {
                                this.filter.setSortBy({ sortBy: 'participantName', sortByOrder: Order.ASC });
                                this.filter.setFilter({
                                    id: 'idFilter',
                                    value: true,
                                    predicate: (value, index, array) => ids?.some(idItem => idItem === value?._id)
                                });
                            })
                        );
                }),
                flatMap(() => {
                    return this.event$;
                })
            )
            .pipe(skipWhile(event => !event))
            .pipe(first())
            .subscribe(event => this.initializeForms(event));
    }

    changeRating(rating) {
        this.agendaEventService.saveRating(this.eventId, rating);
    }

    initializeForms(event: AgendaEvent) {
        this.rateForm.controls.rate.setValue(event?.rating, { emitEvent: false });
        this.rateForm.controls.rate.valueChanges
            .pipe(distinctUntilChanged())
            .pipe(untilDestroyed(this))
            .subscribe(rating => {
                this.changeRating(rating);
            });

        this.filterParticipantForm.controls.search.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe((search: string) => {
                search = typeof search === 'string' ? search.toLowerCase() : null;
                if (!search) {
                    this.filter.removeFilter('search');
                } else {
                    this.filter.setFilter({
                        id: 'search',
                        value: search,
                        predicate: (value, index, array) => value?.participantName?.toLowerCase().includes(search)
                    });
                }
            });
    }

    navigate(location: SeiLocation) {
        if (location) {
            this.launchNavigator.navigate(
                `${location.location_address_street}, ${location.location_address_city},  ${location.location_address_state}  ${location.location_address_zipcode}`
            );
        }
    }
    refreshParticipants() {
        this.participantService
            .load()
            .pipe(first())
            .subscribe();
    }
    scanIn(participantId: number) {
        this.scanParticipantService
            .save({ participantEvent: this.eventId, participantScanned: participantId })
            .pipe(first())
            .subscribe();
    }

    scanOut(participantId: number) {
        this.scanParticipantService
            .save({
                participantEvent: this.eventId,
                participantScanned: participantId,
                scanOut: 1
            })
            .pipe(first())
            .subscribe();
    }
}
