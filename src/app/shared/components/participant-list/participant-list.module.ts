import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantListComponent } from './participant-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ParticipantListComponent],
    entryComponents: [ParticipantListComponent],
    exports: [ParticipantListComponent],
    imports: [CommonModule, IonicModule]
})
export class ParticipantListModule {}
