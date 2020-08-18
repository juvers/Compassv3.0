import { Injectable } from '@angular/core';
import { NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { SettingsService } from '@services/settings/settings.service';
import { SeiEntityService } from '../sei-entity.service';
import { ScanParticipant } from './scan-participant.model';
import { ScanParticipantQuery } from './scan-participant.query';
import { ScanParticipantState, ScanParticipantStore } from './scan-participant.store';
import { tap, switchMap, flatMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
@NgEntityServiceConfig({ resourceName: 'participant/scanParticipant' })
export class ScanParticipantService extends SeiEntityService<ScanParticipantState> {
    constructor(query: ScanParticipantQuery, store: ScanParticipantStore) {
        super(query, store, undefined, ScanParticipant);
    }

    read(eventId: number, refresh?: boolean): Observable<ScanParticipant[]> {
        const http = this.getHttp();
        return this.items$.pipe(
            flatMap(list => {
                if (!refresh && list.some(item => item.event_id === eventId)) {
                    return of(list.filter(item => item.event_id === eventId) as ScanParticipant[]);
                } else {
                    return http
                        .post<ScanParticipant[]>(
                            `${SettingsService.environment?.api}/participant/scanParticipant/read`,
                            {
                                participantEvent: `${eventId}`,
                                temporary_scan_data: []
                            }
                        )
                        .pipe(
                            tap(response => {
                                if (refresh) {
                                    this.store.remove();
                                }
                                this.store.upsertMany(response, { baseClass: ScanParticipant });
                            })
                        );
                }
            })
        );
    }

    save(payload: { participantEvent: number; participantScanned: number; scanOut?: number }) {
        const body: any = Object.assign(payload, { participantEvent: `${payload.participantEvent}` });
        const url = `${SettingsService.api}/participant/scanParticipant/save`;
        return this.getHttp()
            .post(url, body, { responseType: 'text' })
            .pipe(flatMap(() => this.read(payload.participantEvent)))
            .pipe(map(response => response.find(item => item.participant_id_scanned === payload.participantScanned)));
    }
}
