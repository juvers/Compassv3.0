import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from './user.model';

export interface UserState {
    token: string;
    user: User;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user', idKey: '_id' })
export class UserStore extends Store<UserState> {
    constructor() {
        super({
            token: null,
            user: null
        });
    }
}
