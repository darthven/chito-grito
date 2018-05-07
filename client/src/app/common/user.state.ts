import { Observable } from 'rxjs/Observable';

import User from '../../models/user.model';

export interface UserState {
    users: Observable<User[]>;
    currentUser: Observable<User>;
    changed: boolean;
}
