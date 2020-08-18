import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { MaterialModule } from '@core/material.module';
import { IonicModule } from '@ionic/angular';
import { PostImagesModalComponent } from '@shared/components/posts/post-images-modal/post-images-modal.component';
import { LocationModule } from '@shared/components/location/location.module';
import { ParticipantListModule } from '@shared/components/participant-list/participant-list.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MomentModule } from 'angular2-moment';
import { NgxConfettiModule } from 'ngx-confetti';
import { PostComponent } from './post/post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PromotedPostComponent } from './promoted-post/promoted-post.component';
import { PostImagesComponent } from './post-images/post-images.component';
import { PostTagsComponent } from './post-tags/post-tags.component';
import { PostLikesComponent } from './post-likes/post-likes.component';
import { PostsModalComponent } from './posts-modal/posts-modal.component';

const components = [
    PostComponent,
    EditPostComponent,
    PromotedPostComponent,
    PostImagesComponent,
    PostTagsComponent,
    PostLikesComponent,
    PostImagesModalComponent,
    PostsModalComponent
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule,
        IonicModule,
        LocationModule,
        MaterialModule,
        MomentModule,
        NgxConfettiModule,
        ParticipantListModule,
        PipesModule
    ],
    declarations: components,
    exports: components,
    entryComponents: [EditPostComponent, PostImagesModalComponent, PostsModalComponent]
})
export class PostsModule {}
