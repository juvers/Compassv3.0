import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostImagesModalComponent } from './post-images-modal.component';

describe('PostImagesModalComponent', () => {
    let component: PostImagesModalComponent;
    let fixture: ComponentFixture<PostImagesModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostImagesModalComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PostImagesModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
