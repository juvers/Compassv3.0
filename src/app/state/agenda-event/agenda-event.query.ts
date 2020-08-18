import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { AgendaEventState, AgendaEventStore } from './agenda-event.store';

@Injectable({ providedIn: 'root' })
export class AgendaEventQuery extends QueryEntity<AgendaEventState> {
    constructor(protected store: AgendaEventStore) {
        super(store);
    }
}
