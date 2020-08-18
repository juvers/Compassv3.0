import { TestBed } from '@angular/core/testing';

import { IonSlidesHelperService } from './ion-slides-helper.service';

describe('IonSlidesHelperService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: IonSlidesHelperService = TestBed.get(IonSlidesHelperService);
        expect(service).toBeTruthy();
    });
});
