import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpLocationComponent } from './help-location.component';

describe('HelpLocationComponent', () => {
    let component: HelpLocationComponent;
    let fixture: ComponentFixture<HelpLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HelpLocationComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(HelpLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
