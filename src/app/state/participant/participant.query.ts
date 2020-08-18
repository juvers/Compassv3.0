import { Injectable } from '@angular/core';
import { QueryEntity, Order, QueryConfig } from '@datorama/akita';
import { ParticipantStore, ParticipantState } from './participant.store';
import { Participant } from './participant.model';

@Injectable({ providedIn: 'root' })
export class ParticipantQuery extends QueryEntity<ParticipantState> {
    constructor(protected store: ParticipantStore) {
        super(store);
    }
}
