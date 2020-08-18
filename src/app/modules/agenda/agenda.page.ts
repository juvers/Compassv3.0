import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AGENDA_OPTIONS } from '@config/agenda.config';
import { SETTINGS } from '@config/settings';
import { IonSlides, ModalController } from '@ionic/angular';
import { AgendaEventService } from '@state/agenda-event/agenda-event.service';
import { AgendaEventState } from '@state/agenda-event/agenda-event.store';
import { ParticipantService } from '@state/participant/participant.service';
import { AkitaFiltersPlugin } from 'akita-filters-plugin';
import * as moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { first, flatMap, map } from 'rxjs/operators';
import { TIME_ZONE_TEXT } from './../../constants/datetime.constants';
import { HelpAgendaComponent } from './help-agenda/help-agenda.component';

// TODO: CORDOVA: add cordova calendar support
@Component({
    selector: 'sei-agenda',
    templateUrl: './agenda.page.html',
    styleUrls: ['./agenda.page.scss']
})
export class AgendaPage implements OnDestroy, OnInit {
    @ViewChild('slides', { static: false }) slides: IonSlides;

    filter = new AkitaFiltersPlugin<AgendaEventState>(this.agendaEventService.query);
    items$ = this.filter
        .selectAllByFilters()
        .pipe(map(result => (Array.isArray(result) ? result : Object.values(result))));
    loading$ = this.agendaEventService.query
        .selectLoading()
        .pipe(flatMap(i => (!!i ? Promise.resolve(i) : new Promise(resolve => setTimeout(() => resolve(i), 300)))));

    dates$ = this.items$.pipe(map(l => Array.from(new Set(l.map(i => i.longStartDate)))));
    waves$ = this.participantService.waves$;

    filterForm = new FormGroup({
        wave: new FormControl('')
    });
    showAgendas = false;
    showFilters = false;
    slideOptions = AGENDA_OPTIONS.agendaSlide;
    timezone = TIME_ZONE_TEXT;
    waveLabel = SETTINGS.verbiageProgramWave;

    get wave() {
        return this.filterForm?.controls?.wave?.value || 'All';
    }
    constructor(
        private agendaEventService: AgendaEventService,
        private modalController: ModalController,
        private participantService: ParticipantService
    ) {}
    ngOnDestroy() {}

    ngOnInit() {
        this.initializeFilters();
        this.initializeDate();
    }

    initializeDate() {
        this.dates$.pipe(untilDestroyed(this)).subscribe(dates => {
            const index = dates.findIndex(date =>
                moment(date, 'MM-DD-YYYY')
                    .startOf('day')
                    .isSameOrAfter(moment())
            );
            this.loading$
                .pipe(
                    map(l => {
                        if (!l) {
                            setTimeout(() => this.slides?.slideTo(index || 0, 0));
                        }
                    })
                )
                .pipe(first())
                .subscribe();
        });
    }

    initializeFilters() {
        this.filterForm.controls.wave.setValue(0);
        return this.filterForm.controls.wave.valueChanges
            .pipe(
                map(wave => {
                    if (!wave || wave === '0') {
                        this.filter.removeFilter('wave');
                    } else {
                        this.filter.setFilter({
                            id: 'wave',
                            value: wave,
                            predicate: value => value.program_wave === `${wave}`
                        });
                    }
                })
            )
            .pipe(untilDestroyed(this))
            .subscribe();
    }

    refresh() {
        this.agendaEventService.load(undefined, { refresh: true });
    }

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpAgendaComponent
        });
        modal.present();
    }
}
