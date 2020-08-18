import { Injectable } from '@angular/core';
import { SeiEntityService } from '../sei-entity.service';
import { ParticipantPhotoQuery } from './participant-photo.query';
import { ParticipantPhotoState, ParticipantPhotoStore } from './participant-photo.store';

@Injectable({ providedIn: 'root' })
export class ParticipantPhotoService extends SeiEntityService<ParticipantPhotoState> {
    constructor(query: ParticipantPhotoQuery, store: ParticipantPhotoStore) {
        super(query, store, 'participants/photos');
    }
}
