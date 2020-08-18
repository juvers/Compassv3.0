import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FestivePostComponent } from './festive-post.component';

describe('FestivePostComponent', () => {
    let component: FestivePostComponent;
    let fixture: ComponentFixture<FestivePostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FestivePostComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(FestivePostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
