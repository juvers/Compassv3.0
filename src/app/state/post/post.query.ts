import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { PostStore, PostState } from './post.store';
@QueryConfig({
    sortBy: 'postUpdatedAt',
    sortByOrder: Order.DESC
})
@Injectable({ providedIn: 'root' })
export class PostQuery extends QueryEntity<PostState> {
    constructor(protected store: PostStore) {
        super(store);
    }
}
