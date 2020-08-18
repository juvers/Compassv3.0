import { Injectable } from '@angular/core';
import { NgEntityServiceConfig, HttpConfig, Msg } from '@datorama/akita-ng-entity-service';
import { SeiEntityService } from '../sei-entity.service';
import { FollowingParticipantQuery } from './following-participant.query';
import { FollowingParticipantState, FollowingParticipantStore } from './following-participant.store';
import { Observable } from 'rxjs';
import { FollowingParticipant } from './following-participant.model';
import { DefaultObjectMapper } from '@core/default-object-mapper.class';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'participant/followingParticipant' })
export class FollowingParticipantService extends SeiEntityService<FollowingParticipantState> {
    constructor(query: FollowingParticipantQuery, store: FollowingParticipantStore) {
        super(query, store);
    }

    load(
        id?: number,
        config?: HttpConfig & {
            append?: boolean;
        } & Msg
    ): Observable<unknown> {
        if (typeof id !== 'number') {
            throw new Error('id required');
        }
        if (!config) {
            config = {};
        }
        config.mapResponseFn = (response: FollowingParticipant) => {
            return {
                _id: id,
                followers: DefaultObjectMapper.map(response, FollowingParticipant) as FollowingParticipant[]
            };
        };
        return super.load(id, config);
    }
}
