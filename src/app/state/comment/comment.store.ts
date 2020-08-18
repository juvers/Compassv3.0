import { Injectable } from '@angular/core';
import { CommentModel } from './comment.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface CommentState extends EntityState<CommentModel> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'comment', idKey: '_id' })
export class CommentStore extends EntityStore<CommentState> {
    constructor() {
        super();
    }
}
