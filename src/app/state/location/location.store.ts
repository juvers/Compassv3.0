import { Injectable } from '@angular/core';
import { SeiLocation } from './location.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface LocationState extends EntityState<SeiLocation, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'location', idKey: 'location_id' })
export class LocationStore extends EntityStore<LocationState> {
    constructor() {
        super();
    }
}
