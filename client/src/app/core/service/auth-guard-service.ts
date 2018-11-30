import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {ShowHideModalObserver} from '../observer/show-hide-modal-observer';
import {UtilsService} from '../../shared/service/utils-service';

@Injectable()
export class AuthGuardService implements  CanActivate {

  showLogin = false;

  constructor(private utilsService: UtilsService, private observer: ShowHideModalObserver) {}

  canActivate() {
    if (this.utilsService.isUserLoggedIn()) {
      return true;
    } else {
      // open login dialog box if the user is not logged-in using observer
      this.showLogin = true;
      this.observer.pushShowHide(this.showLogin);
      return true;
    }
  }
}
