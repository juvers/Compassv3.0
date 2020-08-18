import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MaterialModule } from '@core/material.module';
import { IonicModule } from '@ionic/angular';
import { LocationModule } from '@shared/components/location/location.module';
import { ParticipantListModule } from '@shared/components/participant-list/participant-list.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MomentModule } from 'angular2-moment';
import { NgxConfettiModule } from 'ngx-confetti';
import { PostsPageRoutingModule } from './posts-routing.module';
import { PostsPage } from './posts.page';
import { PostsModule } from '@shared/components/posts/posts.module';
import { HelpPostsComponent } from './help-posts/help-posts.component';
import { IonModalLauncherModule } from 'ion-modal-launcher';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        IonicModule,
        IonModalLauncherModule,
        LocationModule,
        MaterialModule,
        MomentModule,
        NgxConfettiModule,
        ParticipantListModule,
        PipesModule,
        PostsModule,
        PostsPageRoutingModule
    ],
    declarations: [PostsPage, HelpPostsComponent],
    entryComponents: [HelpPostsComponent]
})
export class PostsPageModule {}
