import { Injectable } from '@angular/core';
import { SeiEntityService } from '../sei-entity.service';
import { AgendaEventQuery } from './agenda-event.query';
import { AgendaEventState, AgendaEventStore } from './agenda-event.store';
import { NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { AgendaEvent } from './agenda-event.model';
import { SettingsService } from '@services/settings/settings.service';
import { tap, first, flatMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'events' })
export class AgendaEventService extends SeiEntityService<AgendaEventState> {
    constructor(query: AgendaEventQuery, store: AgendaEventStore) {
        super(query, store, undefined, AgendaEvent);
    }

    saveRating(id: number, rating: number) {
        this.getHttp()
            .post(`${SettingsService.api}/event/rating`, { event_id: id, rating })
            .pipe(flatMap(() => this.load()))
            .pipe(first())
            .subscribe();
    }
}
