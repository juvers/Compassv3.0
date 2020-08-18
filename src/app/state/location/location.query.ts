import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { LocationStore, LocationState } from './location.store';

@Injectable({ providedIn: 'root' })
export class LocationQuery extends QueryEntity<LocationState> {
    constructor(protected store: LocationStore) {
        super(store);
    }
}
