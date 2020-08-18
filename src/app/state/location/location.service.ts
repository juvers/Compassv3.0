import { Injectable } from '@angular/core';
import { SeiEntityService } from '../sei-entity.service';
import { LocationQuery } from './location.query';
import { LocationState, LocationStore } from './location.store';
import { SettingsService } from '@services/settings/settings.service';
import { first, flatMap } from 'rxjs/operators';
import { SeiLocation } from './location.model';

@Injectable({ providedIn: 'root' })
export class LocationService extends SeiEntityService<LocationState> {
    constructor(query: LocationQuery, store: LocationStore) {
        super(query, store, 'locations', SeiLocation);
    }

    saveRating(id: number, rating: number) {
        this.getHttp()
            .post(`${SettingsService.api}/location/rating`, { location_id: id, rating })
            .pipe(flatMap(() => this.load()))
            .pipe(first())
            .subscribe();
    }
}
