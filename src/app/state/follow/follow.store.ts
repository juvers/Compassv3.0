import { Injectable } from '@angular/core';
import { FollowContainer } from './follow.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface FollowState extends EntityState<FollowContainer, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'follow', idKey: '_id' })
export class FollowStore extends EntityStore<FollowState> {
    constructor() {
        super();
    }
}
