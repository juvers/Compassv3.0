import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ScanParticipantState, ScanParticipantStore } from './scan-participant.store';

@Injectable({ providedIn: 'root' })
export class ScanParticipantQuery extends QueryEntity<ScanParticipantState> {
    constructor(protected store: ScanParticipantStore) {
        super(store);
    }
}
