import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {User} from "../../shared/model/user-model";

@Injectable()
export class UserAuthObserver {

  private subject = new Subject<User>();
  authUser = this.subject.asObservable();

  constructor() {}

  pushAuthUser(user) {
    this.subject.next(user);
  }
}
