import { Injectable } from '@angular/core';
import { ParticipantPhoto } from './participant-photo.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ParticipantPhotoState extends EntityState<ParticipantPhoto> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'participant-photo', idKey: '_id' })
export class ParticipantPhotoStore extends EntityStore<ParticipantPhotoState> {
    constructor() {
        super();
    }
}
