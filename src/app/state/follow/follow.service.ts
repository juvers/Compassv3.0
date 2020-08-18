import { Injectable } from '@angular/core';
import { DefaultObjectMapper } from '@core/default-object-mapper.class';
import { NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { SettingsService } from '@services/settings/settings.service';
import { FollowingParticipantService } from '@state/following-participant/following-participant.service';
import { FollowingParticipantStore } from '@state/following-participant/following-participant.store';
import { combineLatest, Observable } from 'rxjs';
import { first, flatMap } from 'rxjs/operators';
import { SeiEntityService } from '../sei-entity.service';
import { Follow, FollowContainer } from './follow.model';
import { FollowQuery } from './follow.query';
import { FollowState, FollowStore } from './follow.store';
import { UserService } from '@state/user/user.service';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'participant/following' })
export class FollowService extends SeiEntityService<FollowState> {
    constructor(
        private authenticationService: AuthenticationService,
        private followingParticipantService: FollowingParticipantService,
        private followingParticipantStore: FollowingParticipantStore,
        private userService: UserService,
        query: FollowQuery,
        store: FollowStore
    ) {
        super(query, store);
    }

    load(id: number): Observable<unknown> {
        const mapResponseFn = (response: Follow[]) =>
            DefaultObjectMapper.map({ _id: id, follow: response }, FollowContainer);

        return this.query.hasEntity(id) ? this.query.selectEntity(id) : this.get(id, { mapResponseFn });
    }

    follow(id: number) {
        return this.userService.currentUserId$.pipe(
            flatMap(userId => {
                return this.getHttp()
                    .get(`${SettingsService.api}/participant/follow/${id}`, { responseType: 'text' })
                    .pipe(
                        flatMap(() => {
                            this.store.remove(userId);
                            this.followingParticipantStore.remove(id);
                            return combineLatest([
                                this.load(userId).pipe(first()),
                                this.followingParticipantService.load(id).pipe(first())
                            ]);
                        })
                    );
            })
        );
    }
}
