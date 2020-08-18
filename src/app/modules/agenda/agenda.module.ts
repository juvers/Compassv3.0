import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MaterialModule } from '@core/material.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { IonicRatingModule } from 'ionic4-rating';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import { EventPage } from './event/event.page';
import { HelpAgendaComponent } from './help-agenda/help-agenda.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        IonicModule,
        IonicRatingModule,
        MaterialModule,
        AgendaPageRoutingModule,
        PipesModule
    ],
    declarations: [AgendaPage, EventPage, HelpAgendaComponent],
    entryComponents: [HelpAgendaComponent]
})
export class AgendaPageModule {}
