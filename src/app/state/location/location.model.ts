// tslint:disable: variable-name
export class SeiLocation {
    location_id: number;
    location_name: string;
    location_description: string;
    is_featured: 0;
    isHidden: boolean;
    location_address_street: string;
    location_address_city: string;
    location_address_state: string;
    location_address_country: string;
    location_address_zipcode: string;
    location_gps_lat: number;
    location_gps_long: number;
    location_roombooth_value: string;
    location_roombooth_verbiage: string;
    location_photo: string;
    static_rating: string;
    static_value_rating: string;
    location_category: string;
    location_subcategory: string;
    location_phone: string;
    location_wave: string;
    rating: number;
    average_rating: number;
    count_rating: number;
    total_rating: number;

    get hasStaticRating() {
        return parseInt(`${this.static_rating}`, 10) > 0;
    }
}
