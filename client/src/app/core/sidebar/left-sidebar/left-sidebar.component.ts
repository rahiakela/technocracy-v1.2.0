import { Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {Blog, BlogInfo} from '../../../shared/model/blog-model';
import {User} from "../../../shared/model/user-model";
import {UtilsService} from "../../../shared/service/utils-service";
import {UserAuthObserver} from "../../observer/user-auth-observer";
import {Subscription} from "rxjs/Subscription";
import {CoreService} from "../../service/core.service";
import {Statistics} from "../../../shared/model/statistics";

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, DoCheck, OnDestroy {

  @Input()
  blogList: Blog[];
  currentUser: User = {role: 'user'};
  @Input()
  statics: Statistics = {
    totalBlog: 0,
    totalQuestion: 0,
    totalPendingBlog: 0,
    totalPendingQuestion: 0,
    totalFollowers: 0,
    totalFollowing: 0
  };
  publishedOn: string;

  private userSubscribtion: Subscription;

  constructor(private utilService: UtilsService,
              private coreService: CoreService,
              private userAuthObserver: UserAuthObserver) {

  }

  ngOnInit() {
    // subscribe user Auth Observer: it is called on login
    this.userSubscribtion = this.userAuthObserver.authUser.subscribe(user => this.currentUser = user);
  }

  ngDoCheck() {
    // fetch already logged-in user from store: it is called on page load
    this.currentUser = this.utilService.getLoggedInUser();
  }

  getUserName(user: User): string {
    return this.utilService.getUserName(user);
  }

  showSkills(skills: string[]) {
    return skills.map(skill => '#' + skill);
  }

  ngOnDestroy() {
    this.userSubscribtion.unsubscribe();
  }
}
