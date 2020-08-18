import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpPostsComponent } from './help-posts.component';

describe('HelpPostsComponent', () => {
  let component: HelpPostsComponent;
  let fixture: ComponentFixture<HelpPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpPostsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
