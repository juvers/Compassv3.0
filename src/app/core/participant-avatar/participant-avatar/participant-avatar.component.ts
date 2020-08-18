import { Component, OnInit, Input } from '@angular/core';
import { Participant } from 'src/app/state/participant/participant.model';
import { ParticipantPhotoService } from 'src/app/state/participant-photo/participant-photo.service';
import { map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '@state/user/user.service';
import { ParticipantService } from '@state/participant/participant.service';

@Component({
    selector: 'sei-participant-avatar',
    templateUrl: './participant-avatar.component.html',
    styleUrls: ['./participant-avatar.component.scss']
})
export class ParticipantAvatarComponent implements OnInit {
    private _participant: Participant;
    get participant(): Participant {
        return this._participant;
    }
    @Input() set participant(value: Participant) {
        if (value?._id) {
            this.participantPhotos$ = this.participantPhotoService.select(value._id).pipe(
                map(p => {
                    if (!p) {
                        return [];
                    } else {
                        if (this.actualSize > 60) {
                            return [p.participantPhoto, p.participantPhotoOptimized, p.participantPhotoThumbnail];
                        } else {
                            return [p.participantPhotoThumbnail, p.participantPhotoOptimized, p.participantPhoto];
                        }
                    }
                })
            );
        }
        this._participant = value;
    }
    @Input() size: 'small' | 'large' = 'small';
    @Input() noLink: boolean;
    participantPhotos$: Observable<string[]>;

    get actualSize() {
        if (this.size === 'large') {
            return 200;
        } else {
            return 50;
        }
    }
    constructor(
        private participantService: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {}

    goToParticipant() {
        if (this.noLink || !this.participant || !this.participant._id) {
            return;
        }
        this.router.navigate(['/attendees', this.participant._id]);
    }
}
