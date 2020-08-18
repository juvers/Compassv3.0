import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MaterialModule } from '@core/material.module';
import { IonicModule } from '@ionic/angular';
import { ParticipantListModule } from '@shared/components/participant-list/participant-list.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AttendeePage } from './attendee/attendee.page';
import { AttendeesPageRoutingModule } from './attendees-routing.module';
import { AttendeesPage } from './attendees.page';
import { PostsModule } from '@shared/components/posts/posts.module';
import { EditProfilePage } from './edit-profile/edit-profile.page';
import { HelpAttendeeComponent } from './attendee/help-attendee/help-attendee.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        PipesModule,
        IonicModule,
        MaterialModule,
        ReactiveFormsModule,
        ParticipantListModule,
        PostsModule,
        PipesModule,
        AttendeesPageRoutingModule
    ],
    declarations: [AttendeesPage, AttendeePage, EditProfilePage, HelpAttendeeComponent],
    entryComponents: [HelpAttendeeComponent]
})
export class AttendeesPageModule {}
