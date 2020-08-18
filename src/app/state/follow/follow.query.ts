import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FollowStore, FollowState } from './follow.store';
import { FollowContainer } from './follow.model';

@Injectable({ providedIn: 'root' })
export class FollowQuery extends QueryEntity<FollowState> {
    constructor(protected store: FollowStore) {
        super(store);
    }
}
