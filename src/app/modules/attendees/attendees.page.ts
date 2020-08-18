import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SETTINGS } from '@config/settings';
import { UserService } from '@state/user/user.service';
import { AkitaFiltersPlugin } from 'akita-filters-plugin';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { Participant } from 'src/app/state/participant/participant.model';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { ParticipantState } from 'src/app/state/participant/participant.store';
import { ModalController } from '@ionic/angular';
import { HelpAttendeeComponent } from './attendee/help-attendee/help-attendee.component';

@Component({
    selector: 'sei-attendees',
    templateUrl: './attendees.page.html',
    styleUrls: ['./attendees.page.scss']
})
export class AttendeesPage implements OnDestroy, OnInit {
    attendees$: Observable<Participant[]>;
    filter = new AkitaFiltersPlugin<ParticipantState>(this.participantService.query);
    waves$ = this.participantService.waves$;
    participantCount$ = this.participantService.count$;
    showFilters = false;

    filterForm = new FormGroup({
        sortBy: new FormControl(''),
        search: new FormControl(''),
        wave: new FormControl(''),
        filterOptions: new FormControl(''),
        hideGuest: new FormControl(true)
    });
    filteredCount$: Observable<number>;

    get waveLabel() {
        return SETTINGS.verbiageProgramWave;
    }

    // TODO: leaderboard
    get isLeaderboardSelected() {
        return this.filterForm.controls?.sortBy?.value === 'leaderboard';
    }

    constructor(
        private participantService: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private userService: UserService,
        private modalController: ModalController
    ) {}

    ngOnDestroy() {}

    ngOnInit() {
        const setAttendees = () => {
            this.attendees$ = this.filter
                .selectAllByFilters()
                .pipe(map(result => (Array.isArray(result) ? result : Object.values(result))));

            this.filteredCount$ = this.attendees$.pipe(map(list => list?.length));
        };

        this.filter.setFilter({
            id: 'defaultFilters',
            value: true,
            predicate: (value, index, array) =>
                value?.isAttendeeHidden?.toLowerCase().trim() !== 'yes' &&
                value?.registrationStatus?.toLowerCase().trim() === 'completed'
        });

        this.userService.currentUser$.pipe(first()).subscribe(
            user => {
                this.filterForm.controls.wave.setValue(user?.programWave ? user.programWave : 0);
                setAttendees();
            },
            () => setAttendees()
        );

        this.filterForm.controls.wave.valueChanges.pipe(untilDestroyed(this)).subscribe((wave: number) => {
            if (!wave) {
                this.filter.removeFilter('wave');
            } else {
                this.filter.setFilter({
                    id: 'wave',
                    value: wave,
                    predicate: (value, index, array) => value?.programWave === wave
                });
            }
        });

        this.filterForm.controls.search.valueChanges.pipe(untilDestroyed(this)).subscribe((search: string) => {
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
        this.filterForm.controls.hideGuest.valueChanges.pipe(untilDestroyed(this)).subscribe((hideGuest: boolean) => {
            if (!hideGuest) {
                this.filter.removeFilter('hideGuest');
            } else {
                this.filter.setFilter({
                    id: 'hideGuest',
                    value: hideGuest,
                    predicate: (value, index, array) => !value?.guest
                });
            }
        });
        this.filterForm.controls.hideGuest.updateValueAndValidity();
        this.filterForm.controls.wave.updateValueAndValidity();
    }

    clickFilter() {
        this.showFilters = true;
    }

    participantPhoto(participant: Participant) {
        this.participantPhotoService.items$
            .pipe(map(items => items?.find(i => i?._id === participant?._id)))
            .pipe(map(item => [item.participantPhotoThumbnail, item.participantPhoto, item.participantPhotoOptimized]));
    }

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpAttendeeComponent
        });
        modal.present();
    }
}
