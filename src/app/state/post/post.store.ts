import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface PostState extends EntityState<Post, string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'post', idKey: '_id' })
export class PostStore extends EntityStore<PostState> {
    constructor() {
        super();
    }
}
