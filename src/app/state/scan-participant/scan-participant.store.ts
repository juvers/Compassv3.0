import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ScanParticipant } from './scan-participant.model';

export interface ScanParticipantState extends EntityState<ScanParticipant, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ScanParticipant', idKey: 'scan_id' })
export class ScanParticipantStore extends EntityStore<ScanParticipantState> {
    constructor() {
        super();
    }
}
