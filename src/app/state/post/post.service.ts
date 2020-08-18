import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings/settings.service';
import { first, flatMap, map, combineLatest, skipWhile, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { PostQuery } from './post.query';
import { PostState, PostStore } from './post.store';
import { SeiEntityService } from '../sei-entity.service';
import { DefaultObjectMapper } from '@core/default-object-mapper.class';
import { UserService } from '@state/user/user.service';
import { arrayAdd, UpdateStateCallback, arrayRemove } from '@datorama/akita';
import { Observable, ReplaySubject, Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService extends SeiEntityService<PostState> {
    items$ = this.query.selectAll();
    loaders = this.loader.loadersFor(this.store.config?.name);
    postUpdatedAt: string;

    constructor(query: PostQuery, store: PostStore, private userService: UserService) {
        super(query, store);
    }

    remove(post: Post) {
        return this.getHttp()
            .post(`${SettingsService.api}/post/delete`, { _id: post._id }, { responseType: 'text' })
            .pipe(
                tap(() => {
                    this.store.remove(post._id);
                })
            );
    }

    hide(post: Post) {
        return this.getHttp()
            .post(`${SettingsService.api}/post/hide`, { _id: post._id }, { responseType: 'text' })
            .pipe(
                tap(() => {
                    this.store.remove(post._id);
                })
            );
    }
    like(post: Post) {
        return this.userService.currentUser$.pipe(
            flatMap(user => {
                const hasPreviousLike = !!post.likes.find(like => like._id === user._id);
                const params = {
                    participant: user._id,
                    post: post._id,
                    postOwner: post.participant,
                    action: hasPreviousLike ? 'pull' : 'push'
                };

                return this.getHttp()
                    .post(`${SettingsService.api}/like`, params, { responseType: 'text' })
                    .pipe(
                        tap(() => {
                            this.store.update(post._id, ({ likes }) => ({
                                likes: hasPreviousLike
                                    ? arrayRemove(likes, like => like._id === user._id)
                                    : arrayAdd(likes, { _id: user._id, participantName: user.participantName })
                            }));
                        })
                    );
            })
        );
    }

    load() {
        const params: { [param: string]: string } = {};

        return this.items$.pipe(first()).pipe(
            flatMap(posts => {
                if (this.postUpdatedAt && posts?.length > 0) {
                    params.postUpdatedAt = this.postUpdatedAt;
                }

                let count = 0;

                return this.get<Post>({
                    url: `${SettingsService.api}/posts`,
                    append: true,
                    params,
                    mapResponseFn: (res: Post[]) => {
                        if (res?.length) {
                            count = res.length;
                        }
                        if (res?.length > 0) {
                            this.postUpdatedAt = res[res.length - 1].postUpdatedAt;
                        }
                        return DefaultObjectMapper.map(res, Post);
                    }
                }).pipe(map(() => count));
            })
        );
    }

    loadLocationPosts(id: number) {
        if (this.query.hasEntity(e => e.location === id)) {
            return this.items$.pipe(map(items => items.filter(i => i.location === id)));
        } else {
            return this.get({ url: `${SettingsService.api}/postsByLocation/${id}` });
        }
    }

    loadParticipantPosts(id) {
        if (this.query.hasEntity(e => e.participant?._id === id)) {
            return this.items$.pipe(map(items => items.filter(i => i.participant?._id === id)));
        } else {
            return this.get({ url: `${SettingsService.api}/postsByPax/${id}` });
        }
    }

    save(post: Partial<Post>) {
        return this.getHttp()
            .post(`${SettingsService.api}/post`, post, { responseType: 'text' })
            .pipe(
                flatMap(() => {
                    if (post._id) {
                        // ISSUE: sometimes the get does not bring the updated post.
                        return this.getHttp()
                            .get<Post>(`${SettingsService.api}/post/${post._id}`)
                            .pipe(
                                tap(response => {
                                    this.store.update(post._id, response);
                                })
                            );
                    } else {
                        return this.get<Post>({
                            url: `${SettingsService.api}/posts`,
                            append: true,
                            mapResponseFn: (res: Post[]) => {
                                return DefaultObjectMapper.map(res, Post);
                            }
                        });
                    }
                })
            );
    }
}
