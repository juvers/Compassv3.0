import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FollowingParticipant } from './following-participant.model';

export interface FollowingParticipantState
    extends EntityState<{ _id: number; followers: FollowingParticipant[] }, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'followingParticipant', idKey: '_id' })
export class FollowingParticipantStore extends EntityStore<FollowingParticipantState> {
    constructor() {
        super();
    }
}
