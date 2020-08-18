import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ParticipantPartial } from 'src/app/state/participant/participant.model';
import { Router } from '@angular/router';

@Component({
    selector: 'sei-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnInit {
    participants: ParticipantPartial[];
    title: string;
    constructor(
        private router: Router,
        private _bottomSheetRef: MatBottomSheetRef<ParticipantListComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
    ) {}

    ngOnInit() {
        this.participants = this.data?.participants as ParticipantPartial[];
        this.title = this.data?.title as string;
    }

    goToParticipant(id: number) {
        this._bottomSheetRef.dismiss();
        if (!id) {
            return;
        }
        this.router.navigate(['/attendees', id]);
    }
}
