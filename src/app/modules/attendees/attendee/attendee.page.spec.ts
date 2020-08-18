import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttendeePage } from './attendee.page';

describe('AttendeePage', () => {
    let component: AttendeePage;
    let fixture: ComponentFixture<AttendeePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttendeePage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AttendeePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
