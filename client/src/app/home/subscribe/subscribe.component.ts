import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User, UserInfo} from '../../shared/model/user-model';
import {HomeService} from '../home.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit, AfterViewInit {

  user: User;
  subscribed = false;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
  }

  subscribe(user) {
    this.homeService.subscribe(user.email).subscribe(data => {
      const userInfo: UserInfo = data;
      this.user = userInfo.user;
      if (this.user.subscription === 'Y') {
        this.subscribed = true;
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
