import { Injectable } from '@angular/core';
import { map, flatMap, combineLatest, first, tap } from 'rxjs/operators';
import { SeiEntityService } from '../sei-entity.service';
import { ParticipantQuery } from './participant.query';
import { ParticipantState, ParticipantStore } from './participant.store';
import { SettingsService } from '@services/settings/settings.service';
import { ParticipantPhotoService } from '@state/participant-photo/participant-photo.service';
import { ParticipantPhoto } from '@state/participant-photo/participant-photo.model';
import { ParticipantPhotoStore } from '@state/participant-photo/participant-photo.store';
import { Participant } from './participant.model';
import { UserService } from '@state/user/user.service';

@Injectable({ providedIn: 'root' })
export class ParticipantService extends SeiEntityService<ParticipantState> {
    currentUserParticipant$ = this.userService.currentUserId$.pipe(
        flatMap(userId =>
            this.items$.pipe(map(participants => participants.find(participant => participant._id === userId)))
        )
    );
    participants$ = this.query.selectAll();
    count$ = this.query.selectCount();
    waves$ = this.participants$
        .pipe(map(list => [...new Set(list.map(item => item.programWave))]))
        .pipe(map((waves: number[]) => waves.filter(w => !!w)));

    constructor(
        private participantPhotoService: ParticipantPhotoService,
        private participantPhotoStore: ParticipantPhotoStore,
        private userService: UserService,
        query: ParticipantQuery,
        store: ParticipantStore
    ) {
        super(query, store, 'participants/detailed', Participant);
    }

    save(id: number, options: { changePassword: string; photo: string; showBadgeChat: number }) {
        const http = this.getHttp();
        return http.post(`${SettingsService.api}/participant`, options, { responseType: 'text' }).pipe(
            flatMap(() =>
                this.participantPhotoService
                    .load(id, {
                        refresh: true,
                        url: `${SettingsService.api}/participant/${id}`
                    })
                    .pipe(
                        tap((response: ParticipantPhoto) => {
                            if (!response?.participantPhoto) {
                                this.participantPhotoStore.remove(id);
                            }
                        })
                    )
            )
        );
    }
}
