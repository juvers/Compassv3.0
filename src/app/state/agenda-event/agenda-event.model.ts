import * as moment from 'moment';

// tslint:disable: variable-name
// Naming this AgendaEvent instead of event to avoid js conflict
export class AgendaEvent {
    event_id: number;
    average_rating: number;
    count_rating: number;
    end_date_gmt: string;
    event_description: string;
    event_name: string;
    is_featured: number;
    is_private: number;
    location_id: number;
    program_wave: string;
    rating: any;
    speaker_id: number;
    start_date_gmt: string;
    total_rating: number;
    was_private: number;
    count_attendees: number;

    get endDateTime() {
        return moment(this.end_date_gmt);
    }

    get startDateTime() {
        return moment(this.start_date_gmt);
    }

    get endDate() {
        return this.endDateTime.format('MM-DD-YYYY');
    }

    get startDate() {
        return this.startDateTime.format('MM-DD-YYYY');
    }

    get endTime() {
        return this.endDateTime.format('hh:mm A');
    }

    get startTime() {
        return this.startDateTime.format('hh:mm A');
    }

    get longStartDate() {
        return this.startDateTime.format('dddd, MMMM Do YYYY');
    }

    get extendedStartDate() {
        return this.startDateTime.format('MMM d, YYYY h:mm a');
    }

    get extendedEndDate() {
        return this.endDateTime.format('MMM d, YYYY h:mm a');
    }

    get isPast() {
        return this.startDateTime.isBefore(moment());
    }

    get isPrivate() {
        return this.is_private === 1 || this.was_private === 1;
    }

    get isMultipleDay() {
        return this.start_date_gmt !== this.end_date_gmt;
    }
}
