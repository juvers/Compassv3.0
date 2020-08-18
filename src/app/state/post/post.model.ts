import { Participant, ParticipantPartial } from '../participant/participant.model';

export class Post {
    tagsLocation: number;
    constructor(post?: Post) {
        if (post) {
            Object.assign(this, post);
        } else {
            this.tags = [];
            this.photos = [];
            this.postTemplate = 0;
        }
    }
    _id: string;
    commentsCount: number;
    location: number;
    postFeatured: boolean;
    featuredPost: boolean;
    postTemplate: number;
    photos: string[];
    photosThumbnail: string[];
    photosOptimized: string[];
    photo: string[];
    tags: ParticipantPartial[];
    likes: ParticipantPartial[];
    text: string;
    participant: Participant;
    postContentUpdatedAt: string;
    postUpdatedAt: string;
}
