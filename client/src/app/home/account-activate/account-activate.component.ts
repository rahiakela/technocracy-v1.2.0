import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../home.service';
import {UserInfo} from '../../shared/model/user-model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css']
})
export class AccountActivateComponent implements OnInit, AfterViewInit, OnDestroy {

  currentMailId: string;
  subscription: Subscription;
  timer: Observable<any>;

  ACC_WELCOME_VIEW = false; ACC_UPDATE_VIEW = false; ACC_ACTIVATE_VIEW = false; ACC_RESENT_VIEW = false; ACC_TOKEN_EXPIRE_VIEW = false;

  constructor(private homeService: HomeService, private activeRoute: ActivatedRoute, private router: Router) {
    console.log('AccountActivateComponent is called');
    this.activeRoute.params.subscribe(params => {
      const verifyToken = params['verify-token'];
      console.log('verifyToken:' + verifyToken);
      if (verifyToken) {
        this.homeService.activateAccount(verifyToken).subscribe(data => {
          const userInfo: UserInfo = data;
          if (userInfo.statusCode === 200) {
            // show welcome view using timer
            this.setTimer();
            //  this.updateAccountView(true, false, false, false, false);
          } else {
            this.updateAccountView(false, false, false, false, true);
          }
        });
      } else {
        this.updateAccountView(false, false, true, false, false);
      }
    });

    this.activeRoute.queryParams.subscribe(queryParam => {
      const userMailId: string = queryParam['email'];
      console.log('userMailId:' + userMailId);
      if (userMailId) {
        this.currentMailId = userMailId;
      }
    });
  }

  resendActivateAccountMail() {
    this.homeService.reverifyMailAccount(this.currentMailId).subscribe(data => {
      const userInfo: UserInfo = data;
      if (userInfo.statusCode === 200) {
        this.updateAccountView(false, false, false, true, false);
      }
    });
  }

  updateMailId(form: NgForm) {
    console.log('reverifyMailAccount() is called:' + form.value.email);
    this.homeService.updateMailAccount(form.value.email, this.currentMailId).subscribe(data => {
      const userInfo: UserInfo = data;
      if (userInfo.statusCode === 200) {
        this.currentMailId = userInfo.user.local.email;
        this.updateAccountView(false, false, false, true, false);
      }
    });
  }

  showMailUpdateView() {
    this.updateAccountView(false, true, false, false, false);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ref: https://stackoverflow.com/questions/40503667/how-to-show-a-loader-for-3-sec-and-hide-in-angular-2
  setTimer() {
    // set true to show div on view
    this.ACC_WELCOME_VIEW = true;
    this.timer = Observable.timer(10000); // 10000 millisecond means 10 seconds
    this.subscription = this.timer.subscribe(() => {
      // set false to hide div from view after 5 seconds
      this.ACC_WELCOME_VIEW = false;

      // load blog after hide
      this.router.navigate(['/home']);
    });
  }

  updateAccountView(acc_welcome_view: boolean, acc_update_view: boolean, acc_activate_view: boolean, acc_resent_view: boolean, acc_token_expire_view: boolean) {
    this.ACC_WELCOME_VIEW = acc_welcome_view;
    this.ACC_UPDATE_VIEW = acc_update_view;
    this.ACC_ACTIVATE_VIEW = acc_activate_view;
    this.ACC_RESENT_VIEW = acc_resent_view;
    this.ACC_TOKEN_EXPIRE_VIEW = acc_token_expire_view;
  }
}
