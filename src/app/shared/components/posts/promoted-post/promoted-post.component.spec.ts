import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromotedPostComponent } from './promoted-post.component';

describe('PromotedPostComponent', () => {
    let component: PromotedPostComponent;
    let fixture: ComponentFixture<PromotedPostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PromotedPostComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PromotedPostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
