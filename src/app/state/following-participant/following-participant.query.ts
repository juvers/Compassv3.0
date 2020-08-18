import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FollowingParticipantState, FollowingParticipantStore } from './following-participant.store';

@Injectable({ providedIn: 'root' })
export class FollowingParticipantQuery extends QueryEntity<FollowingParticipantState> {
    constructor(protected store: FollowingParticipantStore) {
        super(store);
    }
}
