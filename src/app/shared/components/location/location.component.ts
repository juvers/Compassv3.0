import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationService } from 'src/app/state/location/location.service';
import { SeiLocation } from 'src/app/state/location/location.model';
import { first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'sei-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
    private _id: number;
    locations$: Observable<SeiLocation[]>;
    get id(): number {
        return this._id;
    }
    @Input()
    set id(value: number) {
        if (value) {
            this.locations$ = this.locationService.items$;
        }
        this._id = value;
    }

    constructor(private locationService: LocationService, private router: Router) {}

    ngOnInit() {}

    goToLocation(location: SeiLocation) {
        if (!location?.location_id) {
            return;
        }
        this.router.navigate(['/locations', location.location_id]);
    }
}
