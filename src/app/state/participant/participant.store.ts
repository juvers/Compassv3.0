import { Injectable } from '@angular/core';
import { Participant } from './participant.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ParticipantState extends EntityState<Participant, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'participant', idKey: '_id' })
export class ParticipantStore extends EntityStore<ParticipantState> {
    constructor() {
        super();
    }
}
