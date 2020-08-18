import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ParticipantPhotoStore, ParticipantPhotoState } from './participant-photo.store';

@Injectable({ providedIn: 'root' })
export class ParticipantPhotoQuery extends QueryEntity<ParticipantPhotoState> {

  constructor(protected store: ParticipantPhotoStore) {
    super(store);
  }

}
