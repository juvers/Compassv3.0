import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostLikesComponent } from './post-likes.component';

describe('PostLikesComponent', () => {
    let component: PostLikesComponent;
    let fixture: ComponentFixture<PostLikesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostLikesComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PostLikesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
