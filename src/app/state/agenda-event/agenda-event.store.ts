import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AgendaEvent } from './agenda-event.model';

export interface AgendaEventState extends EntityState<AgendaEvent, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'agendaEvent', idKey: 'event_id' })
export class AgendaEventStore extends EntityStore<AgendaEventState> {
    constructor() {
        super();
    }
}
