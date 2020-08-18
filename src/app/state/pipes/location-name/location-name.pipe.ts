import { Pipe, PipeTransform } from '@angular/core';
import { SeiLocation } from '@state/location/location.model';
import { LocationService } from '@state/location/location.service';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'locationName'
})
export class LocationNamePipe implements PipeTransform {
    constructor(private locationService: LocationService) {}
    transform(value: number | { location_id: number }, ...args: any[]): any {
        if (!value) {
            return null;
        }
        const id = typeof value === 'number' ? value : value.location_id;

        return this.locationService.select(id).pipe(map(item => item.location_name));
    }
}
