import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendeesPage } from './attendees.page';
import { AttendeePage } from './attendee/attendee.page';
import { EditProfilePage } from './edit-profile/edit-profile.page';

const routes: Routes = [
    {
        path: '',
        component: AttendeesPage
    },
    {
        path: ':attendeeId',
        component: AttendeePage
    },
    {
        path: ':attendeeId/edit',
        component: EditProfilePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttendeesPageRoutingModule {}
