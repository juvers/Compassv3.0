import { Injectable } from '@angular/core';
import { NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { SeiEntityService } from '../sei-entity.service';
import { EventPax } from './event-pax.model';
import { EventPaxQuery } from './event-pax.query';
import { EventPaxState, EventPaxStore } from './event-pax.store';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'event/pax' })
export class EventPaxService extends SeiEntityService<EventPaxState> {
    constructor(query: EventPaxQuery, store: EventPaxStore) {
        super(query, store, undefined, EventPax);
    }
}
