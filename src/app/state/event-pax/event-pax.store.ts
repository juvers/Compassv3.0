import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { EventPax } from './event-pax.model';

export interface EventPaxState extends EntityState<EventPax, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'eventPax', idKey: 'paxId' })
export class EventPaxStore extends EntityStore<EventPaxState> {
    constructor() {
        super();
    }
}
