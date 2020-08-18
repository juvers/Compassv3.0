import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsPage } from './locations.page';
import { LocationPage } from './location/location.page';

const routes: Routes = [
    {
        path: '',
        component: LocationsPage
    },
    {
        path: ':id',
        component: LocationPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocationsPageRoutingModule {}
