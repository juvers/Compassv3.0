import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/app/state/post/post.model';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { Participant } from 'src/app/state/participant/participant.model';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { Router } from '@angular/router';

@Component({
    selector: 'sei-festive-post',
    templateUrl: './festive-post.component.html',
    styleUrls: ['./festive-post.component.scss']
})
export class FestivePostComponent implements OnInit {
    private _post: Post;
    get post(): Post {
        return this._post;
    }
    @Input() set post(value: Post) {
        let participantId: number;
        if (value.postFeatured && value.tags && value.tags[0]?._id) {
            participantId = value.tags[0]?._id;
        } else if (value.participant) {
            participantId = value.participant._id;
        }
        if (participantId) {
            this.participant$ = this.participantService.select(participantId);
            this.participantPhotos$ = this.participantPhotoService
                .select(participantId)
                .pipe(
                    map(p => (p ? [p.participantPhotoThumbnail, p.participantPhotoOptimized, p.participantPhoto] : []))
                );
        }
        this._post = value;
    }

    participant$: Observable<Participant>;
    participantPhotos$: Observable<string[]>;

    constructor(
        private participantService: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private router: Router
    ) {}

    ngOnInit() {}

    goToParticipant(id: number) {
        if (!id) {
            return;
        }
        this.router.navigate(['/attendees', id]);
    }
}
