// tslint:disable: variable-name
export class EventPax {
    event_id: number;
    location_id: number;
    participant_id: number;
    program_id: number;
    program_wave: string;
    speaker_id: number;

    get paxId() {
        return `${this.event_id}-${this.participant_id}-${this.program_id}-${this.location_id}-${this.speaker_id}`;
    }
}
