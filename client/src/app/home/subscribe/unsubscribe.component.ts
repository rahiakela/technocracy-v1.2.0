import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User, UserInfo} from '../../shared/model/user-model';
import {HomeService} from '../home.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit, AfterViewInit {

  user: User;
  unsubscribed = false;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
  }

  unsubscribe(user) {
    this.homeService.unsubscribe(user.email).subscribe(data => {
      const userInfo: UserInfo = data;
      this.user = userInfo.user;
      if (this.user.subscription === 'N') {
        this.unsubscribed = true;
      }
    });
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
