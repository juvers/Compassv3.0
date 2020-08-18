import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostsModalComponent } from './posts-modal.component';

describe('PostsModalComponent', () => {
    let component: PostsModalComponent;
    let fixture: ComponentFixture<PostsModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostsModalComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PostsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
