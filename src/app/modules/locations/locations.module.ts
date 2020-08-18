import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MaterialModule } from '@core/material.module';
import { IonicModule } from '@ionic/angular';
import { PostsModule } from '@shared/components/posts/posts.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { IonicRatingModule } from 'ionic4-rating';
import { LocationPage } from './location/location.page';
import { LocationsPageRoutingModule } from './locations-routing.module';
import { LocationsPage } from './locations.page';
import { HelpLocationComponent } from './help-location/help-location.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        IonicModule,
        IonicRatingModule,
        LocationsPageRoutingModule,
        MaterialModule,
        PipesModule,
        PostsModule,
        ReactiveFormsModule
    ],
    declarations: [LocationsPage, LocationPage, HelpLocationComponent],
    entryComponents: [HelpLocationComponent]
})
export class LocationsPageModule {}
