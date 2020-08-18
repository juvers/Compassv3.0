import { User } from '@state/user/user.model';

// tslint:disable: variable-name

export class Participant extends User {
    _id: number;
    participantName: string;
    groupId: number;
    isAdmin: string;
    isAttendeeHidden: string;
    isGuest: string;
    participantGuestName?: string;
    participantTitle: string;
    participantTitleRow1: string;
    participantTitleRow2: string;
    participantTitleRow3?: string;
    participantTitleRow4?: string;
    participant_email_address: string;
    participant_mobile_phone: string;
    programWave: number;
    registrationStatus: string;
    registrationType: string;

    get guest() {
        if (typeof this.isGuest === 'string') {
            return this.isGuest.toLowerCase().trim() === 'yes';
        } else {
            return false;
        }
    }
    constructor(participant?: Participant) {
        super();
        if (participant) {
            Object.assign(this, participant);
        }
    }
}

export type ParticipantPartial = Pick<Participant, '_id' | 'participantName'>;
