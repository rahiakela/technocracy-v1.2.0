import {Inject, Injectable} from '@angular/core';
import {ProfileRepository} from "../repository/profile.repository";
import {User, UserInfo} from "../../shared/model/user-model";
import {Store} from "redux";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import * as UserActions from "../../store/user/user.actions";

@Injectable()
export class ProfileService {

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private profileRepository: ProfileRepository) { }

  updateProfileImage(userId: string, user: User) {
    this.profileRepository.updateProfileImage(userId, user)
      .filter((userInfo: UserInfo) => userInfo.statusCode === 200)
      .subscribe(
        (userInfo: UserInfo) => {
          const updatedUser = userInfo.user;
          // reset user into store
          this.store.dispatch(UserActions.setCurrentUser(updatedUser));
        },
        error => console.log(`Network Error: ${error}`)
      )
  }
}
