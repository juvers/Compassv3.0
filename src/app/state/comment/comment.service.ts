import { Injectable } from '@angular/core';
import { NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { SeiEntityService } from '../sei-entity.service';
import { CommentQuery } from './comment.query';
import { CommentState, CommentStore } from './comment.store';
import { CommentModel, CommentApiModel } from './comment.model';
import { Participant } from '@state/participant/participant.model';
import { SettingsService } from '@services/settings/settings.service';
import { tap, flatMap } from 'rxjs/operators';
import { PostStore } from '@state/post/post.store';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'comments' })
export class CommentService extends SeiEntityService<CommentState> {
    // private updateSubject = new BehaviorSubject<void>(null);

    constructor(query: CommentQuery, store: CommentStore, private postStore: PostStore) {
        super(query, store);
    }

    // getPostComments(postId: string) {
    //     return this.updateSubject.pipe(
    //         flatMap(() => this.query.selectAll({ filterBy: comment => postId === comment.postId }))
    //     );
    // }

    loadPostComments(postId: string) {
        return super.load(null, {
            params: { postId },
            mapResponseFn: (response: CommentApiModel[]) => response?.map(item => new CommentModel(item, postId))
        });
    }

    sendComment(payload: { post: string; participant: Participant; postOwner: Participant; text: string }) {
        return this.getHttp()
            .post(`${SettingsService.api}/comment`, payload)
            .pipe(
                tap((response: CommentApiModel) => {
                    this.store.add(new CommentModel(response, payload.post), { prepend: true, loading: true });
                    // this.updateSubject.next();
                    this.postStore.update(payload.post, entity => {
                        return {
                            commentsCount: entity.commentsCount + 1
                        };
                    });
                })
            );
    }
}
