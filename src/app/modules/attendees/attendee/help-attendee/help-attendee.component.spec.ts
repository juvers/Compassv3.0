import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpAttendeeComponent } from './help-attendee.component';

describe('HelpAttendeeComponent', () => {
  let component: HelpAttendeeComponent;
  let fixture: ComponentFixture<HelpAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpAttendeeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
