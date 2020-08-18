import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@core/guards/authentication.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        loadChildren: () => import('./modules/welcome/welcome.module').then(m => m.WelcomePageModule)
    },
    {
        path: 'posts',
        loadChildren: () => import('./modules/posts/posts.module').then(m => m.PostsPageModule),
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'attendees',
        loadChildren: () => import('./modules/attendees/attendees.module').then(m => m.AttendeesPageModule)
    },
    {
        path: 'agenda',
        loadChildren: () => import('./modules/agenda/agenda.module').then(m => m.AgendaPageModule)
    },
    {
        path: 'locations',
        loadChildren: () => import('./modules/locations/locations.module').then(m => m.LocationsPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
