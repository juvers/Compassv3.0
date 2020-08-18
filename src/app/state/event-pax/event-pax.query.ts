import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EventPaxState, EventPaxStore } from './event-pax.store';

@Injectable({ providedIn: 'root' })
export class EventPaxQuery extends QueryEntity<EventPaxState> {
    constructor(protected store: EventPaxStore) {
        super(store);
    }
}
