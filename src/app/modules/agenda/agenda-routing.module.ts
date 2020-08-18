import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaPage } from './agenda.page';
import { EventPage } from './event/event.page';

const routes: Routes = [
    {
        path: '',
        component: AgendaPage
    },
    {
        path: ':id',
        component: EventPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgendaPageRoutingModule {}
