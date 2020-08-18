import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { ParticipantListComponent } from '@shared/components/participant-list/participant-list.component';
import { Post } from 'src/app/state/post/post.model';
import { ParticipantPartial } from 'src/app/state/participant/participant.model';
import { Router } from '@angular/router';

@Component({
    selector: 'sei-post-tags',
    templateUrl: './post-tags.component.html',
    styleUrls: ['./post-tags.component.scss']
})
export class PostTagsComponent implements OnInit {
    @Input() post: Post;
    constructor(private bottomSheet: MatBottomSheet, private router: Router) {}

    ngOnInit() {}

    goToParticipant(id: number) {
        if (!id) {
            return;
        }
        this.router.navigate(['/attendees', id]);
    }
    async openList(title: string, participants: ParticipantPartial[]) {
        this.bottomSheet.open(ParticipantListComponent, {
            data: { participants, title }
        });
    }
}
