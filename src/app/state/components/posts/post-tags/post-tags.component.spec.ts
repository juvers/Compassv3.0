import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostTagsComponent } from './post-tags.component';

describe('PostTagsComponent', () => {
    let component: PostTagsComponent;
    let fixture: ComponentFixture<PostTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PostTagsComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(PostTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
