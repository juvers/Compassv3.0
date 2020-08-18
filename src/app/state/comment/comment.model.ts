import { ParticipantPhoto } from '../participant-photo/participant-photo.model';

export class CommentApiModel {
    _id: string;
    createdAt: string;
    participant: ParticipantPhoto & { participantName: string };
    text: string;
}

export class CommentModel extends CommentApiModel {
    constructor(apiModel?: CommentApiModel, postId?) {
        super();
        Object.assign(this, apiModel, { postId });
    }
    postId: string;
}
